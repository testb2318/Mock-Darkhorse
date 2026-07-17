import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "@/components/common/ErrorAlert";
import SuccessAlret from "@/components/common/SuccessAlert";
import Spinner from "@/components/common/Spinner";

import { loginAdmin, clearErrors } from "../../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import Navbar from "../../Layouts/Public/Navbar";
import Footer from "../../Layouts/Public/Footer";

export default function AdminLogin() {
  const [showPass, setShowPass] = useState(false);
  const { loading, error, admin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Incorrect email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      dispatch(loginAdmin(values));
    },
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearErrors());
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (admin) {
      navigate(`/admin/dashboard`);
    }
  }, [error, dispatch, admin, navigate]);

  return (
    <>
      <Navbar/>
      <div
        className="flex items-center justify-center px-4 sm:px-8 py-26 min-h-screen bg-cover bg-center relative align-middle bg-theme-base"
        style={{
          backgroundImage: "url('/images/img_12.jpg')", // ✅ Changed to stock3.png
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/90"></div>

        {/* Card - positioned on the right side */}
        <div className="w-full max-w-md h-[500px] md:h-auto md:max-w-lg relative z-10 glass-card rounded-2xl shadow-[0_0_60px_rgba(212,175,55,.1),0_25px_50px_rgba(0,0,0,.5)] p-8 ">
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-2xl font-bold bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light bg-clip-text text-transparent">
              Admin Login
            </h2>
            <p className="text-gray-300 text-sm sm:text-xs mt-1">
              Access the admin dashboard
            </p>
          </div>

          <form className="space-y-5" onSubmit={formik.handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm  sm:text-xs font-medium text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="email"
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-gold-dark/20 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold-medium focus:border-gold-medium transition-all"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm sm:text-xs text-rose-400">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-gold-dark/20 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold-medium focus:border-gold-medium transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gold-medium transition-colors"
                >
                  {showPass ? (
                    <FaRegEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaRegEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-rose-400">{formik.errors.password}</p>
              )}
            </div>

            {error && <ErrorAlert error={error} />}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full max-w-xs mx-auto py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed text-white opacity-50"
                  : "bg-gradient-to-r from-gold-dark via-gold-medium to-gold-light text-black hover:brightness-110 shadow-lg shadow-gold-medium/10 cursor-pointer"
              } flex items-center justify-center gap-2`}
            >
              {loading ? <Spinner /> : "Login →"}
            </button>
          </form>

          {/* Back to Home link */}
          <p className="mt-6 text-center text-gray-300">
            Not a member?{" "}
            <Link
              to="/"
              className="font-semibold text-gold-medium hover:text-gold-light hover:underline transition-colors"
            >
              Back to Home
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}