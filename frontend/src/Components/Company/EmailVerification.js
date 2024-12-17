import React from "react";
import { useLocation } from "react-router-dom";

const EmailVerification = () => {
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    return (
      <section className="bg-light py-3 py-md-5">
        <div className="container text-center">
          <h1>Error</h1>
          <p>No email address provided. Please try again.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-light py-3 py-md-5">
      <div className="container text-center">
        <h1>Email Verification Required</h1>
        <p>
          We've sent a verification email to <strong>{email}</strong>. Please check your inbox and
          click the verification link to complete the process.
        </p>
        <p>If you didn't receive the email, click the button below to resend it.</p>
        <button
          className="btn btn-primary"
          onClick={() => {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/companies/resend-verification`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            })
              .then((res) => res.json())
              .then((data) => alert(data.message))
              .catch((err) => alert("Error resending verification email."));
          }}
        >
          Resend Email
        </button>
      </div>
    </section>
  );
};

export default EmailVerification;
