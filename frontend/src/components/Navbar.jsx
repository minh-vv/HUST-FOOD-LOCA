import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex justify-between items-center py-4 px-6 border-b bg-white">
      {/* Logo */}
      <div className="text-2xl font-bold">HUST-FOOD-LOCA</div>

      {/* User Info */}
      <div className="flex items-center gap-4">
        {/* Greeting with dropdown under it */}
        <div className="relative group cursor-pointer">
          <span className="px-2 py-1">Aさん, こんにちは</span>
          <div className="absolute hidden group-hover:block top-full left-0 mt-2 bg-white shadow-md border rounded w-40">
            <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">プロフィール</div>
            <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer">ログアウト</div>
          </div>
        </div>
      </div>
    </header>
  );
}
