import { useState } from "react";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { login } from "../api";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "メールアドレスを入力してください。";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      newErrors.username = "正しいメールアドレス形式で入力してください。";
    }

    if (!password.trim()) {
      newErrors.password = "パスワードを入力してください。";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await login({
        email: username,
        password: password,
      });

      // Save token to localStorage
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect to home page without alert
      window.location.href = "/home";
    } catch (error) {
      setErrors({
        general:
          error.message || "ログインに失敗しました。もう一度お試しください。",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-[420px] mx-auto px-4 sm:px-0">
        {/* General Error */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* USERNAME */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="メールアドレス"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className={`w-full p-3 border rounded-lg text-base sm:text-lg ${
              errors.username ? "border-red-500" : ""
            } ${loading ? "bg-gray-100" : ""}`}
          />
          <p
            className={`text-sm mt-1 ${
              errors.username ? "text-red-500" : "invisible"
            }`}
          >
            {errors.username || ""}
          </p>
        </div>

        {/* PASSWORD */}
        <div className="mb-3">
          <input
            type="password"
            placeholder="パスワード"
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
            {errors.password || ""}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end text-sm mb-4 gap-2">
          <button
            onClick={() => setShowForgot(true)}
            className="text-blue-600 sm:text-right"
            disabled={loading}
          >
            パスワードを忘れた
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full p-3 rounded-lg text-lg transition ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-orange-200 hover:bg-orange-300"
          }`}
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </div>

      {showForgot && (
        <ForgotPasswordModal onClose={() => setShowForgot(false)} />
      )}
    </>
  );
}
