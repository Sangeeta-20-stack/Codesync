
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Code2,
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#0b0912] py-3.5 pl-11 pr-12 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-300 hover:border-violet-400/30 focus:border-violet-400 focus:bg-[#120c20] focus:ring-4 focus:ring-violet-500/10";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080610] text-white">
      <Navbar />

      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(167,139,250,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.04) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
        }}
      />

      {/* Ambient purple glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-violet-700/15 blur-[150px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-purple-600/15 blur-[150px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.06] blur-[130px]" />

      {/* Main section */}
      <main className="relative flex min-h-screen items-center justify-center px-5 pb-12 pt-28">
        <div className="w-full max-w-[470px]">

          {/* Heading */}
          <div className="mb-8 animate-[fadeIn_0.7s_ease-out] text-center">
            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/20 to-purple-600/10 text-violet-300 shadow-[0_0_40px_rgba(139,92,246,0.2)]">
              <Code2 size={32} strokeWidth={1.8} />

              <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#080610] bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
            </div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-violet-300">
              <Sparkles size={13} />
              JOIN THE CODESYNC COMMUNITY
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Create your{" "}
              <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                account.
              </span>
            </h1>

            <p className="mt-3 text-sm text-zinc-500">
              Start collaborating and building together.
            </p>
          </div>

          {/* Registration card */}
          <div className="group relative">

            {/* Outer glow */}
            <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-br from-violet-500/50 via-purple-500/10 to-fuchsia-500/30 opacity-70 blur-[2px] transition duration-500 group-hover:opacity-100" />

            <div className="relative overflow-hidden rounded-[25px] border border-violet-400/20 bg-gradient-to-b from-[#171024] via-[#100c1b] to-[#0c0915] p-7 shadow-[0_25px_90px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:p-9">

              {/* Card top highlight */}
              <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-400 to-transparent" />

              {/* Decorative glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-500/[0.08] blur-[60px]" />

              <div className="relative">

                {/* Card heading */}
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Get started
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500">
                      Create your CodeSync account
                    </p>
                  </div>

                  <div className="rounded-xl border border-violet-400/15 bg-violet-500/10 p-2.5 text-violet-300">
                    <ShieldCheck size={21} />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
                  >
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="register-name"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                      />

                      <input
                        id="register-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        minLength={2}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="register-email"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                      />

                      <input
                        id="register-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="register-password"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                      />

                      <input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Minimum 8 characters"
                        autoComplete="new-password"
                        minLength={8}
                        required
                        className={inputClass}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-violet-300"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="register-confirm-password"
                      className="mb-2 block text-sm font-medium text-zinc-300"
                    >
                      Confirm Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                      />

                      <input
                        id="register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                        className={inputClass}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-violet-300"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group/button mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3.5 text-sm font-semibold text-white shadow-[0_5px_25px_rgba(124,58,237,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_8px_35px_rgba(124,58,237,0.4)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {loading ? "Creating Account..." : "Create Account"}

                    {!loading && (
                      <ArrowRight
                        size={17}
                        className="transition-transform duration-300 group-hover/button:translate-x-1"
                      />
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/[0.08]" />
                  <span className="text-[10px] font-medium uppercase tracking-[2px] text-zinc-600">
                    Already registered?
                  </span>
                  <div className="h-px flex-1 bg-white/[0.08]" />
                </div>

                {/* Login link */}
                <p className="text-center text-sm text-zinc-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-violet-400 transition hover:text-violet-300 hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-zinc-600">
            <Code2 size={14} className="text-violet-500/70" />
            CodeSync — Code together. Build better.
          </div>
        </div>
      </main>

      {/* Subtle animation */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Register;
