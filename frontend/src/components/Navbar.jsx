import { useState, useRef } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <header className="flex justify-between items-center py-4 px-6 border-b bg-white">
      {/* Logo */}
      <div className="text-2xl font-bold">HUST-FOOD-LOCA</div>

      {/* User Info */}
      <div className="flex items-center gap-4">
        {/* Greeting with dropdown under it */}
        <div className="relative cursor-pointer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <span className="px-2 py-1">Aさん, こんにちは</span>
          {isOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white shadow-md border rounded w-40 z-10">
              <div className="px-3 py-2 hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors" onClick={() => console.log('Profile')}>プロフィール</div>
              <div className="px-3 py-2 hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors" onClick={() => console.log('Logout')}>ログアウト</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
