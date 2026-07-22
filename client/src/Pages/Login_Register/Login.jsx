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
  <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 shadow-2xl shadow-black/40 rounded-2xl p-6 sm:p-8">
    {/* Corner Rivets */}
    <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-700" />
    <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-700" />
    <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-700" />
    <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-700" />

    {/* Vault Icon */}
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
      Welcome Back
    </h1>

    <p className="text-sm text-slate-500 text-center mb-8">
      Sign in to continue
    </p>

    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Email */}
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

      {/* Password */}
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
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>

    <p className="text-center text-sm text-slate-500 mt-7">
      Don't have an account?{" "}
      <Link
        to="/register"
        className="text-amber-400 hover:text-amber-300 hover:underline"
      >
        Register
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
