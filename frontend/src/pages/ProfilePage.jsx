import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Home,
    Heart,
    Bookmark,
    Edit3,
    Camera,
    X,
    Eye,
    EyeOff,
    User,
    Phone,
    Mail,
    AlertCircle,
    ChevronRight,
    MapPin,
} from "lucide-react";
import { API_URL, getProfile } from "../api";

const API_BASE_URL = "http://localhost:3000";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("favorites"); // 'favorites' | 'saved'
    const [favorites, setFavorites] = useState({ menus: [], restaurants: [] });
    const [saved, setSaved] = useState({ menus: [], restaurants: [] });
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTab, setEditTab] = useState("basic"); // 'basic' | 'password'

    // Fetch user data on mount
    useEffect(() => {
        fetchUserData();
        fetchFavorites();
        fetchSaved();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                navigate("/");
                return;
            }
            const userData = await getProfile(token);
            setUser(userData);
        } catch (error) {
            console.error("Error fetching user:", error);
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`${API_BASE_URL}/api/favorites`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setFavorites({
                    menus: data.data.menus || [],
                    restaurants: data.data.restaurants || [],
                });
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    const fetchSaved = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`${API_BASE_URL}/api/saved`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setSaved({
                    menus: data.data.menus || [],
                    restaurants: data.data.restaurants || [],
                });
            }
        } catch (error) {
            console.error("Error fetching saved:", error);
            // If API doesn't exist, use empty data
        }
    };

    const totalFavorites = favorites.menus.length + favorites.restaurants.length;
    const totalSaved = saved.menus.length + saved.restaurants.length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/home")}
                        className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">ホーム</span>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">マイページ</h1>
                    <div className="w-20"></div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    {/* Cover gradient */}
                    <div className="h-32 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400"></div>

                    {/* Profile info */}
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                                    {user?.profile_image_url ? (
                                        <img
                                            src={user.profile_image_url}
                                            alt={user.full_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-16 h-16 text-orange-300" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* User info */}
                            <div className="flex-1 pb-2">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {user?.full_name || user?.username || "ユーザー"}
                                    </h2>
                                    <button
                                        onClick={() => setShowEditModal(true)}
                                        className="p-2 rounded-full hover:bg-orange-100 text-orange-500 transition-colors"
                                        title="プロフィール編集"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    {user?.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span>{user.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span>{user?.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-6">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-rose-500">
                                        <Heart className="w-5 h-5 fill-current" />
                                        {totalFavorites}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">お気に入り</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-blue-500">
                                        <Bookmark className="w-5 h-5 fill-current" />
                                        {totalSaved}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">保存済み</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab("favorites")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "favorites"
                                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200"
                                : "bg-white text-gray-600 hover:bg-rose-50 border border-gray-200"
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${activeTab === "favorites" ? "fill-current" : ""}`} />
                        お気に入り
                        <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
                            {totalFavorites}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("saved")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "saved"
                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200"
                                : "bg-white text-gray-600 hover:bg-blue-50 border border-gray-200"
                            }`}
                    >
                        <Bookmark className={`w-5 h-5 ${activeTab === "saved" ? "fill-current" : ""}`} />
                        保存済み
                        <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
                            {totalSaved}
                        </span>
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {activeTab === "favorites" ? (
                        <>
                            {/* Favorite Menus */}
                            {favorites.menus.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-rose-500 rounded-full"></span>
                                        お気に入りの料理
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {favorites.menus.map((item) => (
                                            <MenuCard
                                                key={item.favorite_id}
                                                item={item}
                                                onClick={() => navigate(`/dish/${item.menu_id}`)}
                                                onRemove={() => handleRemoveFavorite("menu", item.menu_id)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Favorite Restaurants */}
                            {favorites.restaurants.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-rose-500 rounded-full"></span>
                                        お気に入りのレストラン
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {favorites.restaurants.map((item) => (
                                            <RestaurantCard
                                                key={item.favorite_id}
                                                item={item}
                                                onClick={() => navigate(`/restaurant/${item.restaurant_id}`)}
                                                onRemove={() => handleRemoveFavorite("restaurant", item.restaurant_id)}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {totalFavorites === 0 && (
                                <EmptyState
                                    icon={<Heart className="w-16 h-16 text-gray-300" />}
                                    title="お気に入りがありません"
                                    description="料理やレストランをお気に入りに追加してみましょう"
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {/* Saved Menus */}
                            {saved.menus.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                        保存した料理
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {saved.menus.map((item) => (
                                            <MenuCard
                                                key={item.saved_id}
                                                item={item}
                                                onClick={() => navigate(`/dish/${item.menu_id}`)}
                                                onRemove={() => handleRemoveSaved("menu", item.menu_id)}
                                                isSaved
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Saved Restaurants */}
                            {saved.restaurants.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                        保存したレストラン
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {saved.restaurants.map((item) => (
                                            <RestaurantCard
                                                key={item.saved_id}
                                                item={item}
                                                onClick={() => navigate(`/restaurant/${item.restaurant_id}`)}
                                                onRemove={() => handleRemoveSaved("restaurant", item.restaurant_id)}
                                                isSaved
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {totalSaved === 0 && (
                                <EmptyState
                                    icon={<Bookmark className="w-16 h-16 text-gray-300" />}
                                    title="保存済みがありません"
                                    description="料理やレストランを保存してみましょう"
                                />
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <EditProfileModal
                    user={user}
                    activeTab={editTab}
                    setActiveTab={setEditTab}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveProfile}
                />
            )}
        </div>
    );

    async function handleRemoveFavorite(type, itemId) {
        try {
            const token = localStorage.getItem("access_token");
            const endpoint = type === "menu"
                ? `/api/favorites/menu/${itemId}`
                : `/api/favorites/restaurant/${itemId}`;

            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                fetchFavorites();
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    }

    async function handleRemoveSaved(type, itemId) {
        try {
            const token = localStorage.getItem("access_token");
            const endpoint = type === "menu"
                ? `/api/saved/menu/${itemId}`
                : `/api/saved/restaurant/${itemId}`;

            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                fetchSaved();
            }
        } catch (error) {
            console.error("Error removing saved:", error);
        }
    }

    async function handleSaveProfile(updatedData) {
        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (res.ok) {
                await fetchUserData();
                setShowEditModal(false);
            } else {
                const data = await res.json();
                alert(data.message || "プロフィールの更新に失敗しました");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("プロフィールの更新に失敗しました");
        }
    }
}

// ========== Component: Menu Card ==========
function MenuCard({ item, onClick, onRemove, isSaved = false }) {
    return (
        <div
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
            onClick={onClick}
        >
            <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.menu_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        画像なし
                    </div>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors ${isSaved
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-rose-500 text-white hover:bg-rose-600"
                        }`}
                >
                    {isSaved ? (
                        <Bookmark className="w-4 h-4 fill-current" />
                    ) : (
                        <Heart className="w-4 h-4 fill-current" />
                    )}
                </button>
            </div>
            <div className="p-4">
                <h4 className="font-semibold text-gray-800 truncate">{item.menu_name}</h4>
                <p className="text-sm text-gray-500 truncate">{item.restaurant_name}</p>
                {item.price && (
                    <p className="text-orange-500 font-medium mt-1">
                        ¥{item.price.toLocaleString()}
                    </p>
                )}
            </div>
        </div>
    );
}

// ========== Component: Restaurant Card ==========
function RestaurantCard({ item, onClick, onRemove, isSaved = false }) {
    return (
        <div
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
            onClick={onClick}
        >
            <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.restaurant_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        画像なし
                    </div>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors ${isSaved
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-rose-500 text-white hover:bg-rose-600"
                        }`}
                >
                    {isSaved ? (
                        <Bookmark className="w-4 h-4 fill-current" />
                    ) : (
                        <Heart className="w-4 h-4 fill-current" />
                    )}
                </button>
            </div>
            <div className="p-4">
                <h4 className="font-semibold text-gray-800 truncate">{item.restaurant_name}</h4>
                {item.address && (
                    <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {item.address}
                    </p>
                )}
            </div>
        </div>
    );
}

// ========== Component: Empty State ==========
function EmptyState({ icon, title, description }) {
    return (
        <div className="text-center py-16">
            <div className="inline-block mb-4">{icon}</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    );
}

// ========== Component: Edit Profile Modal ==========
function EditProfileModal({ user, activeTab, setActiveTab, onClose, onSave }) {
    const [formData, setFormData] = useState({
        full_name: user?.full_name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        allergies: user?.allergies || [],
    });
    const [allergyInput, setAllergyInput] = useState("");
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(user?.profile_image_url || null);
    const fileInputRef = useRef(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);

        // TODO: Upload to server
        setUploading(true);
        try {
            // Upload logic here
            await new Promise((resolve) => setTimeout(resolve, 1000));
        } finally {
            setUploading(false);
        }
    };

    const handleAddAllergy = (e) => {
        if (e.key === "Enter" && allergyInput.trim()) {
            e.preventDefault();
            if (!formData.allergies.includes(allergyInput.trim())) {
                setFormData({
                    ...formData,
                    allergies: [...formData.allergies, allergyInput.trim()],
                });
            }
            setAllergyInput("");
        }
    };

    const handleRemoveAllergy = (allergyToRemove) => {
        setFormData({
            ...formData,
            allergies: formData.allergies.filter((a) => a !== allergyToRemove),
        });
    };

    const handleSaveBasicInfo = () => {
        onSave(formData);
    };

    const handleSavePassword = async () => {
        if (passwordData.new_password !== passwordData.confirm_password) {
            alert("新しいパスワードが一致しません");
            return;
        }
        if (passwordData.new_password.length < 8) {
            alert("パスワードは8文字以上である必要があります");
            return;
        }

        try {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`http://localhost:3000/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: passwordData.current_password,
                    new_password: passwordData.new_password,
                }),
            });

            if (res.ok) {
                alert("パスワードが変更されました");
                onClose();
            } else {
                const data = await res.json();
                alert(data.message || "パスワードの変更に失敗しました");
            }
        } catch (error) {
            alert("パスワードの変更に失敗しました");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">プロフィール編集</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab("basic")}
                        className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === "basic"
                                ? "text-orange-500 border-b-2 border-orange-500"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        基本情報
                    </button>
                    <button
                        onClick={() => setActiveTab("password")}
                        className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === "password"
                                ? "text-orange-500 border-b-2 border-orange-500"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        パスワード
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {activeTab === "basic" ? (
                        <div className="space-y-6">
                            {/* Profile Image Upload */}
                            <div className="flex flex-col items-center">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group"
                                >
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                                            <User className="w-12 h-12 text-orange-300" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <p className="text-sm text-gray-500 mt-2">クリックして画像を変更</p>
                            </div>

                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    氏名
                                </label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, full_name: e.target.value })
                                    }
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                    placeholder="山田太郎"
                                />
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    電話番号
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                    placeholder="090-1234-5678"
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    メールアドレス
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                    placeholder="example@email.com"
                                />
                            </div>

                            {/* Allergies Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    食物アレルギー
                                </label>
                                <input
                                    type="text"
                                    value={allergyInput}
                                    onChange={(e) => setAllergyInput(e.target.value)}
                                    onKeyDown={handleAddAllergy}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                    placeholder="Enterで追加"
                                />
                                {formData.allergies.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {formData.allergies.map((allergy, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                                            >
                                                {allergy}
                                                <button
                                                    onClick={() => handleRemoveAllergy(allergy)}
                                                    className="hover:text-red-900"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    現在のパスワード
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? "text" : "password"}
                                        value={passwordData.current_password}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                current_password: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPasswords({
                                                ...showPasswords,
                                                current: !showPasswords.current,
                                            })
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.current ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    新しいパスワード
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? "text" : "password"}
                                        value={passwordData.new_password}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                new_password: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPasswords({
                                                ...showPasswords,
                                                new: !showPasswords.new,
                                            })
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.new ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    新しいパスワード（確認）
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? "text" : "password"}
                                        value={passwordData.confirm_password}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                confirm_password: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPasswords({
                                                ...showPasswords,
                                                confirm: !showPasswords.confirm,
                                            })
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.confirm ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="flex items-start gap-2 p-4 bg-amber-50 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-700">
                                    <p className="font-medium">パスワード要件：</p>
                                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                                        <li>8文字以上</li>
                                        <li>英大文字・小文字を含む</li>
                                        <li>数字を含む</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={activeTab === "basic" ? handleSaveBasicInfo : handleSavePassword}
                        className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-200"
                    >
                        保存する
                    </button>
                </div>
            </div>
        </div>
    );
}
