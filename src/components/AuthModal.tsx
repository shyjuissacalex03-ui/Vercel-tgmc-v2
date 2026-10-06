import React, { useState } from "react";
import { useAuth } from "../firebase/authContext.tsx";
import { X, Mail, Lock, User as UserIcon, LogIn, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "signin",
}) => {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, sendPasswordReset } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
        onClose();
      } else if (mode === "signup") {
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters.");
        }
        await signUpWithEmail(email, password, displayName);
        onClose();
      } else if (mode === "forgot") {
        await sendPasswordReset(email);
        setSuccessMsg("Password reset email sent! Check your inbox.");
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      let msg = err.message || "An error occurred during authentication.";
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        msg = "Invalid email or password. Please try again.";
      } else if (msg.includes("email-already-in-use")) {
        msg = "This email is already registered. Please sign in instead.";
      } else if (msg.includes("weak-password")) {
        msg = "Password should be at least 6 characters.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-[#478226] uppercase tracking-wider">
              {mode === "signin"
                ? "Welcome Back"
                : mode === "signup"
                ? "Join The Fellowship"
                : "Account Recovery"}
            </span>
            <h2 className="text-2xl font-extrabold text-[#282f3b] mt-0.5">
              {mode === "signin"
                ? "Sign In"
                : mode === "signup"
                ? "Create Account"
                : "Reset Password"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch for signin / signup */}
        {mode !== "forgot" && (
          <div className="flex p-1 bg-[#f0f3f9] rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === "signin"
                  ? "bg-[#478226] text-white shadow"
                  : "text-slate-600 hover:text-[#282f3b]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === "signup"
                  ? "bg-[#478226] text-white shadow"
                  : "text-slate-600 hover:text-[#282f3b]"
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Notifications */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold text-[#282f3b] mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#282f3b] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-[#282f3b]">Password</label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setError(null);
                    }}
                    className="text-[11px] text-[#478226] hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f0f3f9] border border-slate-300 text-xs text-[#282f3b] focus:outline-none focus:border-[#478226]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#478226] hover:bg-[#39691e] disabled:opacity-60 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "signin" ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In with Email</span>
              </>
            ) : mode === "signup" ? (
              <>
                <UserIcon className="w-4 h-4" />
                <span>Create TGMC Account</span>
              </>
            ) : (
              <span>Send Password Reset Email</span>
            )}
          </button>
        </form>

        {mode === "forgot" && (
          <div className="text-center">
            <button
              onClick={() => {
                setMode("signin");
                setError(null);
                setSuccessMsg(null);
              }}
              className="text-xs text-[#478226] font-bold hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {/* Google Alternative */}
        {mode !== "forgot" && (
          <div className="space-y-3 pt-2">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-slate-400 font-medium absolute">
                or continue with
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#f0f3f9] hover:bg-slate-200 border border-slate-300 text-[#282f3b] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google Account</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
