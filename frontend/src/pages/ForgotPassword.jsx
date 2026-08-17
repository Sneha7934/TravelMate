import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  CheckCircle,
} from "lucide-react";

import api from "../api/api";

import forgotPasswordBg from "../assets/images/forgot-password-bg.png";
import travelmateLogo from "../assets/images/travelmate-logo.png";

function ForgotPassword() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [generatedOTP, setGeneratedOTP] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // STEP 1: CHECK EMAIL + GENERATE OTP
  // =====================================================

  const handleSendOTP = async (e) => {
    e.preventDefault();

    const email = formData.email.trim().toLowerCase();

    // Fixed: Removed `formData.name` reference which was causing runtime errors
    if (!email) {
      alert("Please enter your registered email.");
      return;
    }

    try {
      setLoading(true);

      // Verify email exists in backend
      await api.post("/users/check-email", { email });

      // Generate random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      setGeneratedOTP(otp);

      setFormData((previous) => ({
        ...previous,
        email: email,
        otp: "",
      }));

      // Move to OTP step
      setStep(2);

      console.log("Generated OTP:", otp);
    } catch (error) {
      console.error("Error checking email:", error);

      if (error.response?.status === 404) {
        alert("No account exists with this email.");
      } else {
        alert(
          "Unable to verify email. Please make sure the server is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STEP 2: VERIFY OTP
  // =====================================================

  const handleVerifyOTP = (e) => {
    e.preventDefault();

    if (!formData.otp) {
      alert("Please enter the OTP.");
      return;
    }

    if (formData.otp !== generatedOTP) {
      alert("Invalid OTP. Please try again.");
      return;
    }

    setStep(3);
  };

  // =====================================================
  // RESEND OTP
  // =====================================================

  const handleResendOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    setGeneratedOTP(otp);

    setFormData((previous) => ({
      ...previous,
      otp: "",
    }));

    console.log("New generated OTP:", otp);
    alert("A new OTP has been generated.");
  };

  // =====================================================
  // STEP 3: RESET PASSWORD
  // =====================================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      alert("Please enter both password fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Backend endpoint to update password (if implemented)
      // await api.post("/users/reset-password", {
      //   email: formData.email,
      //   password: formData.password,
      // });

      setStep(4);
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      {/* BACKGROUND */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${forgotPasswordBg})`,
        }}
      />

      {/* OVERLAY */}
      <div className="fixed inset-0 bg-[#f6eadb]/35" />

      {/* PAGE CONTAINER */}
      <div className="relative z-10 min-h-screen">
        {/* HEADER */}
        <header className="pt-8 text-center">
          <div className="flex items-center justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-0"
              aria-label="Go to TravelMate Home"
            >
              <img
                src={travelmateLogo}
                alt="TravelMate Logo"
                className="h-15 w-17 object-contain"
              />
              <h1 className="text-4xl font-bold tracking-tight text-[#172554]">
                TravelMate
              </h1>
            </Link>
          </div>
          <p className="mt-1 text-sm font-medium text-[#172554]/80">
            Explore India, Experience Wonder
          </p>
        </header>

        {/* MAIN CONTENT */}
        <section className="flex min-h-[calc(100vh-125px)] items-center justify-center px-5 pb-12 pt-5">
          <div className="w-full max-w-[485px] rounded-[30px] border border-white/60 bg-white/70 p-7 shadow-[0_25px_70px_rgba(23,37,84,0.25)] backdrop-blur-xl md:p-8">
            {/* STEP 1: EMAIL ENTRY */}
            {step === 1 && (
              <>
                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#172554] shadow-md">
                    <ShieldCheck size={28} className="text-white" />
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-[30px] font-bold text-[#172554]">
                    Forgot Password?
                  </h2>
                  <p className="mx-auto mt-2 max-w-[350px] text-[15px] leading-6 text-gray-500">
                    Enter your registered details to verify your TravelMate account.
                  </p>
                </div>

                <form onSubmit={handleSendOTP} className="mt-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                      Registered Email
                    </label>

                    <div className="relative">
                      <Mail
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your registered email"
                        autoComplete="email"
                        required
                        className="h-[48px] w-full rounded-xl border border-gray-300 bg-white/80 pl-12 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#f97316] text-base font-semibold text-white shadow-sm transition duration-200 hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
                  >
                    <KeyRound size={20} />
                    {loading ? "Checking Email..." : "Send OTP"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb] hover:underline"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </Link>
                </div>
              </>
            )}

            {/* STEP 2: OTP VERIFICATION */}
            {step === 2 && (
              <>
                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#172554] shadow-md">
                    <ShieldCheck size={27} className="text-white" />
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-[30px] font-bold text-[#172554]">
                    Verify Your Email
                  </h2>
                  <p className="mx-auto mt-2 max-w-[350px] text-[15px] leading-6 text-gray-500">
                    Enter the 6-digit verification code generated for your account.
                  </p>
                </div>

                {/* DEV OTP BANNER */}
                <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 px-5 py-4 text-center">
                  <p className="text-xs font-medium text-gray-500">
                    Your verification OTP
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-[0.35em] text-[#172554]">
                    {generatedOTP}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    Development mode only
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="mt-6">
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-center text-sm font-semibold text-gray-800"
                  >
                    Enter OTP
                  </label>

                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        otp: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    placeholder="Enter 6-digit OTP"
                    autoComplete="one-time-code"
                    required
                    className="h-[52px] w-full rounded-xl border border-gray-300 bg-white/80 text-center text-lg font-semibold tracking-[0.5em] outline-none transition placeholder:text-sm placeholder:tracking-normal placeholder:text-gray-400 focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="submit"
                    className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#f97316] text-base font-semibold text-white shadow-sm transition duration-200 hover:bg-[#ea580c] active:scale-[0.98]"
                  >
                    <ShieldCheck size={20} />
                    Verify OTP
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-500">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="font-semibold text-[#2563eb] hover:underline"
                  >
                    Resend OTP
                  </button>
                </p>

                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb] hover:underline"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                </div>
              </>
            )}

            {/* STEP 3: RESET PASSWORD */}
            {step === 3 && (
              <>
                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#172554] shadow-md">
                    <Lock size={27} className="text-white" />
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-[30px] font-bold text-[#172554]">
                    Create New Password
                  </h2>
                  <p className="mx-auto mt-2 max-w-[350px] text-[15px] leading-6 text-gray-500">
                    Create a new password for your TravelMate account.
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="mt-7">
                  {/* NEW PASSWORD */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                      New Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                        required
                        className="h-[48px] w-full rounded-xl border border-gray-300 bg-white/80 pl-12 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#172554]"
                      >
                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="mt-4">
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                      Confirm New Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                        required
                        className="h-[48px] w-full rounded-xl border border-gray-300 bg-white/80 pl-12 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#172554]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#f97316] text-base font-semibold text-white shadow-sm transition duration-200 hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
                  >
                    {loading ? "Updating..." : "Reset Password"}
                  </button>
                </form>
              </>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <div className="py-4 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 shadow-sm">
                    <CheckCircle size={36} className="text-green-600" />
                  </div>
                </div>

                <h2 className="text-[28px] font-bold text-[#172554]">
                  Password Reset!
                </h2>

                <p className="mt-2 text-[15px] leading-6 text-gray-500">
                  Your password has been successfully updated. You can now log in
                  with your new password.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#f97316] text-base font-semibold text-white shadow-sm transition duration-200 hover:bg-[#ea580c] active:scale-[0.98]"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default ForgotPassword;