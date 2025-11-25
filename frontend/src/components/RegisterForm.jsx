import { useState } from "react";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

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
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "確認用パスワードを入力してください。";
    } else if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致していません。";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 sm:px-0">
      {/* ユーザー名 */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full p-3 border rounded-lg text-base sm:text-lg ${
            errors.username ? "border-red-500" : ""
          }`}
        />
        <p
          className={`mt-1 text-sm ${
            errors.username ? "text-red-500" : "invisible"
          }`}
        >
          {errors.username || ""}
        </p>
      </div>

      {/* メール */}
      <div className="mb-3">
        <input
          type="email"
          placeholder="メール"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-3 border rounded-lg text-base sm:text-lg ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        <p
          className={`mt-1 text-sm ${
            errors.email ? "text-red-500" : "invisible"
          }`}
        >
          {errors.email || ""}
        </p>
      </div>

      {/* パスワード */}
      <div className="mb-3">
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-3 border rounded-lg text-base sm:text-lg ${
            errors.password ? "border-red-500" : ""
          }`}
        />
        <p
          className={`mt-1 text-sm ${
            errors.password ? "text-red-500" : "invisible"
          }`}
        >
          {errors.password || ""}
        </p>
      </div>

      {/* パスワード確認 */}
      <div className="mb-5">
        <input
          type="password"
          placeholder="パスワード確認"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full p-3 border rounded-lg text-base sm:text-lg ${
            errors.confirmPassword ? "border-red-500" : ""
          }`}
        />
        <p
          className={`mt-1 text-sm ${
            errors.confirmPassword ? "text-red-500" : "invisible"
          }`}
        >
          {errors.confirmPassword || ""}
        </p>
      </div>

      <button
        onClick={handleRegister}
        className="w-full p-3 rounded-lg bg-orange-200 text-lg hover:bg-orange-300 transition"
      >
        登録
      </button>
    </div>
  );
}
