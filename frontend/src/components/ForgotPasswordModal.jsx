import { useState } from "react";
import { API_URL } from "../api";

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError("メールアドレスを入力してください。");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("有効なメールアドレスを入力してください。");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "メール送信に失敗しました。");
      }

      setSent(true);
    } catch (err) {
      setError(err.message || "メール送信に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {!sent ? (
          <>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
              パスワード再設定リンクを送信
            </h2>
            <p className="text-sm text-gray-600 mb-4 text-center">
              登録済みのメールアドレスを入力してください。
              <br className="hidden sm:block" />
              パスワード再設定用のリンクをお送りします。
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="メールアドレス"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className={`w-full p-3 border rounded-lg text-base sm:text-lg ${
                    error ? "border-red-500" : ""
                  }`}
                />
                <p
                  className={`text-sm mt-1 ${
                    error ? "text-red-500" : "invisible"
                  }`}
                >
                  {error || "placeholder"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-sm sm:text-base"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-orange-200 hover:bg-orange-300 transition text-sm sm:text-base"
                >
                  {loading ? "送信中..." : "送信する"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
              メールを送信しました
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center leading-relaxed">
              パスワード再設定リンクを{" "}
              <span className="font-semibold">{email}</span> に送信しました。
              <br />
              メールをご確認ください。
            </p>
            <button
              onClick={onClose}
              className="w-full p-3 rounded-lg bg-orange-200 hover:bg-orange-300 transition text-lg"
            >
              閉じる
            </button>
          </>
        )}
      </div>
    </div>
  );
}
