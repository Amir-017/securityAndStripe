import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.access_token);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:3000/auth/google";
    };

    const handleGithubLogin = () => {
        window.location.href = "http://localhost:3000/auth/github";
    };

    return (
     <div className="w-screen min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
  <div className="relative w-full max-w-md sm:max-w-lg bg-slate-900 border border-slate-800 shadow-2xl shadow-black/40 rounded-2xl p-6 sm:p-8 lg:p-10">
    <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-700" />
    <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-700" />
    <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-700" />
    <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-700" />

    <div
      className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
      style={{
        background:
          "repeating-conic-gradient(from 0deg, rgba(245,158,11,0.55) 0deg 2deg, transparent 2deg 30deg)",
      }}
    >
      <div className="w-14 h-14 rounded-full bg-slate-900 border border-amber-500/30 flex flex-col items-center justify-center gap-px">
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <div
          className="w-1.5 h-2 bg-amber-400"
          style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
        />
      </div>
    </div>

    <p className="text-center text-[11px] font-mono tracking-widest text-amber-500/70 mb-2">
      SECURE ACCESS
    </p>

    <h1 className="text-3xl font-semibold text-slate-100 text-center mb-2">
      Create Account
    </h1>

    <p className="text-sm text-slate-500 text-center mb-8">
      Register to start using your account
    </p>

    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          placeholder="John"
          value={form.firstName}
          onChange={handleChange}
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-colors"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
        )}
        {loading ? "Creating account..." : "Register"}
      </button>
    </form>

    <div className="flex items-center gap-3 my-7">
      <div className="flex-1 h-px bg-slate-800" />
      <span className="text-[11px] uppercase tracking-wider text-slate-600">
        Or continue with
      </span>
      <div className="flex-1 h-px bg-slate-800" />
    </div>

    <div className="flex flex-col gap-3">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 w-full bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300 text-sm font-medium py-3 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.15.8 3.88 1.5l2.65-2.55C16.9 3.05 14.7 2 12 2 6.98 2 3 6 3 11s3.98 9 9 9c5.2 0 8.6-3.65 8.6-8.8 0-.6-.07-1-.15-1.5H12z"
          />
        </svg>
        Continue with Google
      </button>

      <button
        onClick={handleGithubLogin}
        className="flex items-center justify-center gap-2 w-full bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300 text-sm font-medium py-3 rounded-lg transition-colors"
      >
        <svg
          className="w-4 h-4 text-slate-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.5 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.35c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .28.18.6.69.5A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2z" />
        </svg>
        Continue with GitHub
      </button>
    </div>

    <p className="text-center text-sm text-slate-500 mt-7">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-amber-400 hover:text-amber-300 hover:underline"
      >
        Login
      </Link>
    </p>

    <p className="text-center text-[11px] font-mono text-slate-600 tracking-wide mt-5">
      AES-256 encrypted · TLS 1.3
    </p>
  </div>
</div>
    );
};

export default Login;
