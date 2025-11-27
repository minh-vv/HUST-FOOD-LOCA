import { useState } from "react";
import { register } from "../api";


export default function RegisterForm({ onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);


  const validate = () => {
    const newErrors = {};


    if (!username.trim()) {
      newErrors.username = "ユーザー名を入力してください。";
    }


    if (!email.trim()) {
      newErrors.email = "メールアドレスを入力してください。";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "正しいメールアドレス形式で入力してください。";
    }


    if (!password.trim()) {
      newErrors.password = "パスワードを入力してください。";
    } else if (password.length < 8) {
      newErrors.password = "パスワードは8文字以上にしてください。";
    } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      newErrors.password = "パスワードは英字と数字を含めてください。";
    }


    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "確認用パスワードを入力してください。";
    } else if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません。";
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await register({
        username: username,
        email: email,
        password: password,
      });

      // Don't save token, just switch to login tab
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error) {
      setErrors({
        general: error.message || "登録に失敗しました。もう一度お試しください。",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
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
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          className={`w-full p-3 border rounded-lg text-base sm:text-lg ${errors.username ? "border-red-500" : ""
            } ${loading ? "bg-gray-100" : ""}`}
        />
        <p
          className={`mt-1 text-sm ${errors.username ? "text-red-500" : "invisible"
            }`}
        >
          {errors.username || ""}
        </p>
      </div>


      {/* EMAIL */}
      <div className="mb-3">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className={`w-full p-3 border rounded-lg text-base sm:text-lg ${errors.email ? "border-red-500" : ""
            } ${loading ? "bg-gray-100" : ""}`}
        />
        <p
          className={`mt-1 text-sm ${errors.email ? "text-red-500" : "invisible"
            }`}
        >
          {errors.email || ""}
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
          className={`w-full p-3 border rounded-lg text-base sm:text-lg ${errors.password ? "border-red-500" : ""
            } ${loading ? "bg-gray-100" : ""}`}
        />
        <p
          className={`mt-1 text-sm ${errors.password ? "text-red-500" : "invisible"
            }`}
        >
          {errors.password || ""}
        </p>
      </div>


      {/* CONFIRM PASSWORD */}
      <div className="mb-5">
        <input
          type="password"
          placeholder="パスワード（確認）"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          className={`w-full p-3 border rounded-lg text-base sm:text-lg ${errors.confirmPassword ? "border-red-500" : ""
            } ${loading ? "bg-gray-100" : ""}`}
        />
        <p
          className={`mt-1 text-sm ${errors.confirmPassword ? "text-red-500" : "invisible"
            }`}
        >
          {errors.confirmPassword || ""}
        </p>
      </div>

      <button
        onClick={handleRegister}
        disabled={loading}
        className={`w-full p-3 rounded-lg text-lg transition ${
          loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-orange-200 hover:bg-orange-300"
        }`}
      >
        {loading ? "登録中..." : "登録"}
      </button>
    </div>
  );
}
