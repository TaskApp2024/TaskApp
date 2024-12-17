import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'expired'
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyEmail = async () => {
            console.log("verifying email...");
            const queryParams = new URLSearchParams(location.search);
            const token = queryParams.get('token');

            if (!token) {
                setStatus('error');
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/companies/verify-email?token=${token}`);

                if (response.status === 200) {
                    setStatus('success');
                    setTimeout(() => navigate('/companyLogin'), 3000); // Redirect to login after 3 seconds
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setStatus('expired'); // Token is invalid or expired
                } else {
                    setStatus('error');
                }
            }
        };

        verifyEmail();
    }, [location.search, navigate]);

    // Conditional rendering based on status
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            {status === 'verifying' && <p>Verifying your email...</p>}
            {status === 'success' && <p>Email verified successfully! Redirecting to login...</p>}
            {status === 'expired' && (
                <>
                    <p>Your verification link has expired.</p>
                    <button
                        onClick={() => navigate('/resend-verification')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Resend Verification Email
                    </button>
                </>
            )}
            {status === 'error' && <p>An error occurred. Please try again later.</p>}
        </div>
    );
};

export default VerifyEmail;
