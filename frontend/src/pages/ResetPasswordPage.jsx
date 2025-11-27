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
        message: "リセットリンクが無効か見つかりません。",
      });
      return;
    }

    setToken(queryToken);
    verifyResetToken(queryToken)
      .then((res) => {
        setTokenStatus({
          checking: false,
          valid: Boolean(res?.valid),
          message: res?.valid ? "" : "リセットリンクが無効または期限切れです。",
        });
      })
      .catch((err) => {
        setTokenStatus({
          checking: false,
          valid: false,
          message: err?.message || "リセットリンクが無効または期限切れです。",
        });
      });
  }, [searchParams]);

  const validate = () => {
    const newErrors = {};

    if (!password.trim()) {
      newErrors.password = "新しいパスワードを入力してください。";
    } else if (password.length < 8) {
      newErrors.password = "パスワードは8文字以上にしてください。";
    }

    if (!confirm.trim()) {
      newErrors.confirm = "パスワードを確認してください。";
    } else if (password && password !== confirm) {
      newErrors.confirm = "パスワードが一致しません。";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!tokenStatus.valid || !token) {
      setErrors({ general: "リセットリンクが無効または期限切れです。" });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess("");
    try {
      const res = await resetPassword({ token, password });
      setSuccess(
        res?.message || "パスワードをリセットしました。ログイン画面へリダイレクトします..."
      );

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setErrors({ general: err?.message || "パスワードのリセットに失敗しました。" });
    } finally {
      setLoading(false);
    }
  };

  if (tokenStatus.checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-md p-6 sm:p-8 text-center">
          <p className="text-lg font-semibold">リセットリンクを確認しています...</p>
        </div>
      </div>
    );
  }

  if (!tokenStatus.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-md p-6 sm:p-8 text-center space-y-4">
          <p className="text-lg font-semibold text-red-600">
            {tokenStatus.message || "リセットリンクが無効または期限切れです。"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full p-3 rounded-lg bg-orange-200 hover:bg-orange-300 transition text-lg"
          >
            ログインに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          パスワードをリセット
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
              placeholder="新しいパスワード"
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
              placeholder="新しいパスワード（確認）"
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
            {loading ? "処理中..." : "パスワードをリセット"}
          </button>
        </form>
      </div>
    </div>
  );
}
