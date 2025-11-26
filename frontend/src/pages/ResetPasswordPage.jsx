import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();


    const validate = () => {
        const newErrors = {};


        if (!password.trim()) {
            newErrors.password = "新しいパスワードを入力してください。";
        } else if (password.length < 8) {
            newErrors.password = "パスワードは8文字以上にしてください。";
        }


        if (!confirm.trim()) {
            newErrors.confirm = "確認用パスワードを入力してください。";
        } else if (password && password !== confirm) {
            newErrors.confirm = "パスワードが一致しません。";
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleReset = (e) => {
        e.preventDefault();
        if (!validate()) return;


        // ここでAPIにトークンと新パスワードを送る想定
        // await api.post("/auth/reset-password", { token, password });


        setSuccess("パスワードをリセットしました。ログイン画面へお進みください。");


        setTimeout(() => {
            navigate("/"); // ログイン画面 or メイン画面のパスに変更
        }, 1500);
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-md p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
                    パスワード再設定
                </h1>


                <form onSubmit={handleReset}>
                    {/* NEW PASSWORD */}
                    <div className="mb-3">
                        <input
                            type="password"
                            placeholder="新しいパスワード"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full p-3 border rounded-lg text-base sm:text-lg ${errors.password ? "border-red-500" : ""
                                }`}
                        />
                        <p
                            className={`text-sm mt-1 ${errors.password ? "text-red-500" : "invisible"
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
                            className={`w-full p-3 border rounded-lg text-base sm:text-lg ${errors.confirm ? "border-red-500" : ""
                                }`}
                        />
                        <p
                            className={`text-sm mt-1 ${errors.confirm ? "text-red-500" : "invisible"
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
                        className="w-full p-3 rounded-lg bg-orange-200 text-lg hover:bg-orange-300 transition"
                    >
                        パスワードをリセット
                    </button>
                </form>
            </div>
        </div>
    );
}