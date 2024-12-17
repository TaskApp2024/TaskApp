import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";

const CompanySignup = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" }); // For handling the alert state

  const formik = useFormik({
    initialValues: {
      companyId: "",
      companyName: "",
      service: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      companyLogo: null,
    },
    validationSchema: Yup.object({
      companyId: Yup.string().required("Company ID is required"),
      companyName: Yup.string().required("Company Name is required"),
      service: Yup.string().required("Service is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phone: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      address: Yup.string().required("Address is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must include letters, numbers, and special characters"
        )
        .required("Password is required"),

      companyLogo: Yup.mixed()
        .required("Company Logo is required")
        .test(
          "fileSize",
          "File size is too large",
          (value) => value && value.size <= 1024 * 1024 // 1MB max
        )
        .test(
          "fileType",
          "Unsupported file type",
          (value) => value && ["image/jpeg", "image/png"].includes(value.type)
        ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true); // Show spinner

        // Create a new FormData object
        const formData = new FormData();
        
        // Append all form fields to the FormData object
        formData.append('companyId', values.companyId);
        formData.append('companyName', values.companyName);
        formData.append('service', values.service);
        formData.append('email', values.email);
        formData.append('phone', values.phone);
        formData.append('address', values.address);
        formData.append('password', values.password);
        
        // Append the file (make sure the name matches the field name used in multer)
        if (values.companyLogo) {
          formData.append('companyLogo', values.companyLogo);
        }

        // Send the request with FormData and necessary headers
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/companies/signup`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data', // Set the content type for file upload
            },
          }
        );

        // On success, show success alert
        setAlert({ message: 'Company registered successfully. Please check your email for verification!', type: 'success' });
        formik.resetForm();
      } catch (error) {
        console.error(error);
        // On error, show error alert
        setAlert({ message: 'Error submitting form: ' + (error.response?.data?.message || 'Unknown error'), type: 'danger' });
      } finally {
        setLoading(false); // Hide spinner
        setSubmitting(false);
      }
    }
  });

  return (
    <>
      <section className="bg-light py-3 py-md-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
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
                  <h2 className="text-center text-secondary mb-4">
                    Register Company
                  </h2>

                  {/* Bootstrap Alert */}
                  {alert.message && (
                    <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                      {alert.message}
                      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                  )}

                  <form onSubmit={formik.handleSubmit}>
                    <div className="row gy-3">
                      {/* Company ID */}
                      <div className="col-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="companyId"
                            name="companyId"
                            placeholder="Company ID"
                            value={formik.values.companyId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <label htmlFor="companyId">Company ID</label>
                          {formik.touched.companyId && formik.errors.companyId ? (
                            <div className="text-danger">{formik.errors.companyId}</div>
                          ) : null}
                        </div>
                      </div>
                      {/* Company Name */}
                      <div className="col-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="companyName"
                            name="companyName"
                            placeholder="Company Name"
                            value={formik.values.companyName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <label htmlFor="companyName">Company Name</label>
                          {formik.touched.companyName && formik.errors.companyName ? (
                            <div className="text-danger">{formik.errors.companyName}</div>
                          ) : null}
                        </div>
                      </div>
                      {/* Service */}
                      <div className="col-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="service"
                            name="service"
                            placeholder="Service"
                            value={formik.values.service}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <label htmlFor="service">Service</label>
                          {formik.touched.service && formik.errors.service ? (
                            <div className="text-danger">{formik.errors.service}</div>
                          ) : null}
                        </div>
                      </div>
                      {/* Email */}
                      <div className="col-6">
                        <div className="form-floating">
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <label htmlFor="email">Email</label>
                          {formik.touched.email && formik.errors.email ? (
                            <div className="text-danger">{formik.errors.email}</div>
                          ) : null}
                        </div>
                      </div>
                      {/* Phone */}
                      <div className="col-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="phone"
                            name="phone"
                            placeholder="Phone Number"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <label htmlFor="phone">Phone</label>
                          {formik.touched.phone && formik.errors.phone ? (
                            <div className="text-danger">{formik.errors.phone}</div>
                          ) : null}
                        </div>
                      </div>
                      {/* Address */}
                      <div className="col-6">
                        <div className="form-floating">
                          <textarea
                            className="form-control"
                            id="address"
                            name="address"
                            placeholder="Address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <label htmlFor="address">Address</label>
                          {formik.touched.address && formik.errors.address ? (
                            <div className="text-danger">{formik.errors.address}</div>
                          ) : null}
                        </div>
                      </div>
                      {/* Password */}
                      <div className="col-6">
                        <div className="form-floating">
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <label htmlFor="password">Password</label>
                          {formik.touched.password && formik.errors.password ? (
                            <div className="text-danger">{formik.errors.password}</div>
                          ) : null}
                        </div>
                      </div>
                      {/* Company Logo */}
                      <div className="col-6">
                        <div className="form-floating">
                          <input
                            type="file"
                            className="form-control"
                            id="companyLogo"
                            name="companyLogo"
                            onChange={(event) => formik.setFieldValue("companyLogo", event.currentTarget.files[0])}
                          />
                          <label htmlFor="companyLogo">Company Logo</label>
                          {formik.touched.companyLogo && formik.errors.companyLogo ? (
                            <div className="text-danger">{formik.errors.companyLogo}</div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="d-grid gap-2 mt-4">
                      <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                        {loading ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          "Register"
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
    </>
  );
};

export default CompanySignup;
