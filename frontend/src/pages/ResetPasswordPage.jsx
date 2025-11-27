import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword, verifyResetToken } from "../api";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenStatus, setTokenStatus] = useState({
    checking: true,
    valid: false,
    message: "",
  });
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const queryToken = searchParams.get("token");
    if (!queryToken) {
      setTokenStatus({
        checking: false,
        valid: false,
        message: "Reset link is invalid or missing.",
      });
      return;
    }

    setToken(queryToken);
    verifyResetToken(queryToken)
      .then((res) => {
        setTokenStatus({
          checking: false,
          valid: Boolean(res?.valid),
          message: res?.valid ? "" : "Reset link is invalid or expired.",
        });
      })
      .catch((err) => {
        setTokenStatus({
          checking: false,
          valid: false,
          message: err?.message || "Reset link is invalid or expired.",
        });
      });
  }, [searchParams]);

  const validate = () => {
    const newErrors = {};

    if (!password.trim()) {
      newErrors.password = "Please enter a new password.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirm.trim()) {
      newErrors.confirm = "Please confirm your password.";
    } else if (password && password !== confirm) {
      newErrors.confirm = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!tokenStatus.valid || !token) {
      setErrors({ general: "Reset link is invalid or expired." });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess("");
    try {
      const res = await resetPassword({ token, password });
      setSuccess(
        res?.message || "Password has been reset. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setErrors({ general: err?.message || "Reset password failed." });
    } finally {
      setLoading(false);
    }
  };

  if (tokenStatus.checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-md p-6 sm:p-8 text-center">
          <p className="text-lg font-semibold">Checking reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenStatus.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-md p-6 sm:p-8 text-center space-y-4">
          <p className="text-lg font-semibold text-red-600">
            {tokenStatus.message || "Reset link is invalid or expired."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full p-3 rounded-lg bg-orange-200 hover:bg-orange-300 transition text-lg"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Reset your password
        </h1>

        {errors.general && (
          <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleReset}>
          {/* NEW PASSWORD */}
          <div className="mb-3">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className={`w-full p-3 border rounded-lg text-base sm:text-lg ${
                errors.password ? "border-red-500" : ""
              } ${loading ? "bg-gray-100" : ""}`}
            />
            <p
              className={`text-sm mt-1 ${
                errors.password ? "text-red-500" : "invisible"
              }`}
            >
              {errors.password || "placeholder"}
            </p>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-4">
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
              className={`w-full p-3 border rounded-lg text-base sm:text-lg ${
                errors.confirm ? "border-red-500" : ""
              } ${loading ? "bg-gray-100" : ""}`}
            />
            <p
              className={`text-sm mt-1 ${
                errors.confirm ? "text-red-500" : "invisible"
              }`}
            >
              {errors.confirm || "placeholder"}
            </p>
          </div>

          {success && (
            <p className="text-sm text-green-600 mb-3 text-center">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg text-lg transition ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-orange-200 hover:bg-orange-300"
            }`}
          >
            {loading ? "Processing..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}
