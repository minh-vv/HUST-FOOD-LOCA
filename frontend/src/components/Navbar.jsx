import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Lấy tên user từ localStorage
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.full_name || user.username || "ユーザー");
      }
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
      setUserName("ユーザー");
    }
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  const handleLogout = () => {
    // Xóa user data từ localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    // Điều hướng về trang login
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center py-4 px-6 border-b bg-white">
      {/* Logo */}
      <div 
        className="text-2xl font-bold cursor-pointer hover:text-blue-600 transition-colors"
        onClick={() => navigate("/home")}
      >
        ハスト・フード・ロカ
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4">
        {/* Greeting with dropdown under it */}
        <div className="relative cursor-pointer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <span className="px-2 py-1">{userName}さん、こんにちは</span>
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white shadow-md border rounded w-40 z-10">
              <div className="px-3 py-2 hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors" onClick={() => console.log('Profile')}>プロフィール</div>
              <div className="px-3 py-2 hover:bg-red-100 hover:text-red-700 cursor-pointer transition-colors" onClick={handleLogout}>ログアウト</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
