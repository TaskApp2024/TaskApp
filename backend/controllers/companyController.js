
const Company = require('../models/companyModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // For generating a token




exports.signupCompany = async (req, res) => {
    try {
        const { companyId, companyName, service, email, phone, address, password } = req.body;

        // Check if companyId or email already exists
        const existingCompany = await Company.findOne({ $or: [{ companyId }, { email }] });
        if (existingCompany) {
            return res.status(400).json({ message: 'Company ID or email already exists.' });
        }

        const companyLogo = req.file ? req.file.path : null; // Check if logo is provided

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpirationTime = new Date();
        tokenExpirationTime.setHours(tokenExpirationTime.getHours() + 24);
        
        const company = new Company({
            companyId,
            companyName,
            service,
            email,
            phone,
            address,
            password: hashedPassword,
            companyLogo,
            emailVerificationToken: verificationToken, // Must be set
            emailVerificationTokenExpires: tokenExpirationTime, // Must be set
        });
        

        await company.save();

        // Send verification email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

        const verificationUrl = `${process.env.REACT_APP_FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            html: `
                <p>Please click the link below to verify your email address. The link will expire in 24 hours:</p>
                <a href="${verificationUrl}">${verificationUrl}</a>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: 'Company registered successfully. Please check your email for verification.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};



exports.verifyEmail = async (req, res) => {
    try {
        console.log("Verify email function called.");
        const { token } = req.query;

        // Log the received token
        if (!token) {
            console.log("No token provided in query.");
            return res.status(400).json({ message: "No token provided." });
        }
        console.log("Received token:", token);

        // Find the company by token
        const company = await Company.findOne({
            emailVerificationToken: token,
            emailVerificationTokenExpires: { $gt: new Date() }, // Token must not be expired
        });

        // Log whether a matching document was found
        if (!company) {
            console.log("Invalid or expired token.");
            return res.status(400).json({ message: "Invalid or expired token." });
        }
        console.log("Company found with email:", company.email);

        // Log before updating the document
        console.log("Marking email as verified...");

        // Mark email as verified
        company.emailVerified = true;
        company.emailVerificationToken = undefined;
        company.emailVerificationTokenExpires = undefined;

        // Save the updated document and log the result
        const savedCompany = await company.save();
        console.log("Company updated successfully:", savedCompany);

        res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {
        // Log the error details
        console.error("Error during email verification:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the company by email
        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        // Check if the email is verified
        if (!company.emailVerified) {
            // Resend the verification email
            const verificationToken = crypto.randomBytes(32).toString('hex');
            const tokenExpirationTime = new Date();
            tokenExpirationTime.setHours(tokenExpirationTime.getHours() + 24);

            company.emailVerificationToken = verificationToken;
            company.emailVerificationTokenExpires = tokenExpirationTime;

            await company.save();

            // Send the verification email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            const verificationUrl = `${process.env.REACT_APP_FRONTEND_URL}/verify-email?token=${verificationToken}`;
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Email Verification',
                html: `
                    <p>Please click the link below to verify your email address. The link will expire in 24 hours:</p>
                    <a href="${verificationUrl}">${verificationUrl}</a>
                `,
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: 'Email not verified. A verification email has been resent.' ,emailVerified:false});
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, company.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { companyId: company.companyId, email: company.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful.',
            token,
            emailVerified:true,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};




exports.resendMail = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the company by email
        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        // Check if already verified
        if (company.emailVerified) {
            return res.status(400).json({ message: 'Email is already verified.' });
        }

        // Generate a new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpirationTime = new Date();
        tokenExpirationTime.setHours(tokenExpirationTime.getHours() + 24);

        company.emailVerificationToken = verificationToken;
        company.emailVerificationTokenExpires = tokenExpirationTime;

        await company.save();

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const verificationUrl = `${process.env.REACT_APP_FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            html: `
                <p>Please click the link below to verify your email address. The link will expire in 24 hours:</p>
                <a href="${verificationUrl}">${verificationUrl}</a>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Verification email resent successfully.' });
    } catch (error) {
        console.error('Error resending verification email:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};








