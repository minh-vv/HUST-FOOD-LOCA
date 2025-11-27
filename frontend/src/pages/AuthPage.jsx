import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";


export default function AuthPage() {
  const [tab, setTab] = useState("login");


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-10">
      <div className="w-[420px] bg-white p-6 rounded-2xl shadow-lg">
        <div className="text-center text-2xl font-bold mb-6">
          ハスト・フード・ロカ
        </div>


        <div className="flex justify-around border-b pb-2 mb-6 text-lg">
          <button
            className={`pb-1 ${tab === "login" ? "text-blue-600 font-bold" : "text-gray-500"
              }`}
            onClick={() => setTab("login")}
          >
            ログイン
          </button>


          <button
            className={`pb-1 ${tab === "register" ? "text-blue-600 font-bold" : "text-gray-500"
              }`}
            onClick={() => setTab("register")}
          >
            登録
          </button>
        </div>


        {tab === "login" && <LoginForm />}
        {tab === "register" && <RegisterForm />}
      </div>
    </div>
  );
}
