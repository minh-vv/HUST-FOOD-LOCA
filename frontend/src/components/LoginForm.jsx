import { useState } from "react";
import ForgotPasswordModal from "./ForgotPasswordModal";


export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showForgot, setShowForgot] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "ユーザー名を入力してください。";

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


  const handleLogin = () => {
    if (!validate()) return;
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 sm:px-0">
      {/* USERNAME */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="メールアドレス"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full p-3 border rounded-lg text-base sm:text-lg ${
            errors.username ? "border-red-500" : ""
          }`}
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
          className={`w-full p-3 border rounded-lg text-base sm:text-lg ${
            errors.password ? "border-red-500" : ""
          }`}
        />
        <p
          className={`text-sm mt-1 ${
            errors.password ? "text-red-500" : "invisible"
          }`}
        >
          {errors.password || ""}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm mb-4 gap-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" /> アカウントを保持する
        </label>

        <button
          onClick={() => setShowForgot(true)}
          className="text-blue-600 sm:text-right"
        >
          パスワードを忘れた
        </button>
      </div>

      <button
        onClick={handleLogin}
        className="w-full p-3 rounded-lg bg-orange-200 text-lg hover:bg-orange-300 transition"
      >
        ログイン
      </button>
    </div>
  );
}

  return (
    <>
      <div className="w-full max-w-[420px] mx-auto px-4 sm:px-0">
        {/* USERNAME */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="メールアドレス"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-3 border rounded-lg text-base sm:text-lg ${errors.username ? "border-red-500" : ""
              }`}
          />
          <p
            className={`text-sm mt-1 ${errors.username ? "text-red-500" : "invisible"
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
            className={`w-full p-3 border rounded-lg text-base sm:text-lg ${errors.password ? "border-red-500" : ""
              }`}
          />
          <p
            className={`text-sm mt-1 ${errors.password ? "text-red-500" : "invisible"
              }`}
          >
            {errors.password || ""}
          </p>
        </div>


        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm mb-4 gap-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> アカウントを保持する
          </label>


          <button
            onClick={() => setShowForgot(true)}
            className="text-blue-600 sm:text-right"
          >
            パスワードを忘れた
          </button>
        </div>


        <button
          onClick={handleLogin}
          className="w-full p-3 rounded-lg bg-orange-200 text-lg hover:bg-orange-300 transition"
        >
          ログイン
        </button>
      </div>


      {showForgot && (
        <ForgotPasswordModal onClose={() => setShowForgot(false)} />
      )}
    </>
  );
}
