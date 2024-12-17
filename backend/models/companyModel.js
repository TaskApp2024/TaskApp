const mongoose=require('mongoose');


const companySchema = new mongoose.Schema({
    companyId: { type: String, required: true },
    companyName: { type: String, required: true },
    service: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    companyLogo: { type: String },
    emailVerificationToken: { type: String }, // Ensure this field is present
    emailVerificationTokenExpires: { type: Date }, // Ensure this field is present
    emailVerified: { type: Boolean, default: false },
});


module.exports = mongoose.model('Company', companySchema);
