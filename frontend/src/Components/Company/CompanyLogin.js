import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For navigation

const CompanyLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must include letters, numbers, and special characters"
        )
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        setErrorMessage(""); // Clear previous error messages
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/companies/login`,
          values
        );
        console.log(response.data.emailVerified);
        if (!response.data.emailVerified) {
          console.log("email not verified");
          // Redirect to verification page if email is not verified
          navigate("/email-verification", { state: { email: values.email } });
        } else {
          // Redirect to dashboard on successful login
          navigate("/dashboard");
        }
      } catch (error) {
        if(error.response?.status === 400){
          navigate("/email-verification", { state: { email: values.email } });
        }
        
        if (error.response?.status === 401 || error.response?.status === 404) {
          setErrorMessage("Invalid email or password.");
        } else {
          console.log(error);
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <section className="bg-light py-3 py-md-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
            <div className="card border border-light-subtle rounded-3 shadow-sm">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="text-center mb-3">
                  <a href="#!">
                    <img
                      src="./assets/img/bsb-logo.svg"
                      alt="BootstrapBrain Logo"
                      width="175"
                      height="57"
                    />
                  </a>
                </div>
                <h2 className="fs-6 fw-normal text-center text-secondary mb-4">
                  Enter your details to login
                </h2>

                {errorMessage && (
                  <div className="alert alert-danger text-center">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={formik.handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className={`form-control ${
                        formik.touched.email && formik.errors.email
                          ? "is-invalid"
                          : ""
                      }`}
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <label htmlFor="email">Email</label>
                    {formik.touched.email && formik.errors.email ? (
                      <div className="invalid-feedback">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className={`form-control ${
                        formik.touched.password && formik.errors.password
                          ? "is-invalid"
                          : ""
                      }`}
                      id="password"
                      name="password"
                      placeholder="Password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <label htmlFor="password">Password</label>
                    {formik.touched.password && formik.errors.password ? (
                      <div className="invalid-feedback">
                        {formik.errors.password}
                      </div>
                    ) : null}
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        "Log in"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyLogin;
