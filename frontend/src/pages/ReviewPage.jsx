import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Heart, Star, X, Image as ImageIcon, Edit2, Trash2 } from "lucide-react";

const API_BASE_URL = "http://localhost:3000/api";
const COMMENTS_BASE_URL = "http://localhost:3000/api/comments";
const ALLERGEN_KEYWORDS = [
  "milk",
  "dairy",
  "egg",
  "peanut",
  "soy",
  "wheat",
  "gluten",
  "shrimp",
  "shellfish",
  "fish",
  "sesame",
  "tree nut",
  "nut",
];

export default function DishDetailPage() {
  const { menuId } = useParams();
  const navigate = useNavigate();

  const [dishDetail, setDishDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  const [filter, setFilter] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [thumbIndex, setThumbIndex] = useState(0);

  const [editModal, setEditModal] = useState({
    open: false,
    id: null,
    rating: 0,
    content: "",
    loading: false,
    error: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    id: null,
    loading: false,
    error: "",
  });

  useEffect(() => {
    fetchDishDetail();
    fetchComments();
  }, [menuId]);

  const fetchDishDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/menu/${menuId}`);
      if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
      const data = await res.json();
      setDishDetail(data);
    } catch (err) {
      console.error("Error fetching dish:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      setCommentsError(null);
      const res = await fetch(`${COMMENTS_BASE_URL}/menu/${menuId}?limit=50&page=1`);
      if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
      const data = await res.json();
      setComments(data?.data || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setCommentsError(err.message);
    } finally {
      setCommentsLoading(false);
    }
  };

  const token = localStorage.getItem("access_token");
  const currentUser = (() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  })();

  const allIngredients = useMemo(() => {
    const main = dishDetail?.ingredients?.main || [];
    const others = dishDetail?.ingredients?.others || [];
    return [...main, ...others];
  }, [dishDetail]);

  const allergenIngredients = useMemo(() => {
    return allIngredients.filter((ing) =>
      ALLERGEN_KEYWORDS.some((k) =>
        ing.name?.toLowerCase().includes(k.toLowerCase())
      )
    );
  }, [allIngredients]);

  const filteredComments = useMemo(() => {
    if (!comments) return [];
    if (filter === "all") return comments;
    const star = Number(filter);
    return comments.filter((c) => Math.round(c.rating) === star);
  }, [comments, filter]);

  const handleSubmitComment = async () => {
    setSubmitError("");
    if (!token) {
      setSubmitError("レビューを投稿するにはログインしてください。");
      return;
    }
    if (!selectedRating) {
      setSubmitError("★の数を選んでください(1～5)。");
      return;
    }
    if (!comment.trim()) {
      setSubmitError("コメントの内容は空にできません。");
      return;
    }

    try {
      setSubmitLoading(true);
      const res = await fetch(COMMENTS_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          menu_id: Number(menuId),
          rating: selectedRating,
          comment: comment.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      setComment("");
      setSelectedRating(0);
      await Promise.all([fetchComments(), fetchDishDetail()]);
    } catch (err) {
      console.error("Submit comment error:", err);
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const openEditModal = (commentItem) => {
    setEditModal({
      open: true,
      id: commentItem.review_id || commentItem.id,
      rating: commentItem.rating,
      content: commentItem.comment || "",
      loading: false,
      error: "",
    });
  };

  const submitEdit = async () => {
    if (!token) {
      setEditModal((prev) => ({ ...prev, error: "ログインしてください。" }));
      return;
    }
    if (!editModal.rating) {
      setEditModal((prev) => ({ ...prev, error: "★の数を選んでください。" }));
      return;
    }
    if (!editModal.content.trim()) {
      setEditModal((prev) => ({
        ...prev,
        error: "コメントの内容は空にできません。",
      }));
      return;
    }
    try {
      setEditModal((prev) => ({ ...prev, loading: true, error: "" }));
      const res = await fetch(`${COMMENTS_BASE_URL}/${editModal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: editModal.rating,
          comment: editModal.content.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      setEditModal({
        open: false,
        id: null,
        rating: 0,
        content: "",
        loading: false,
        error: "",
      });
      await Promise.all([fetchComments(), fetchDishDetail()]);
    } catch (err) {
      console.error("Edit comment error:", err);
      setEditModal((prev) => ({ ...prev, loading: false, error: err.message }));
    }
  };

  const openDeleteConfirm = (commentItem) => {
    setDeleteConfirm({
      open: true,
      id: commentItem.review_id || commentItem.id,
      loading: false,
      error: "",
    });
  };

  const submitDelete = async () => {
    if (!token) {
      setDeleteConfirm((prev) => ({ ...prev, error: "ログインしてください。" }));
      return;
    }
    try {
      setDeleteConfirm((prev) => ({ ...prev, loading: true, error: "" }));
      const res = await fetch(`${COMMENTS_BASE_URL}/${deleteConfirm.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      setDeleteConfirm({ open: false, id: null, loading: false, error: "" });
      await Promise.all([fetchComments(), fetchDishDetail()]);
    } catch (err) {
      console.error("Delete comment error:", err);
      setDeleteConfirm((prev) => ({ ...prev, loading: false, error: err.message }));
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96 text-gray-600">
          料理の詳細を読み込み中...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96 text-red-600">
          {error}
        </div>
      </div>
    );

  if (!dishDetail)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-96 text-gray-600">
          料理が見つかりません
        </div>
      </div>
    );

  const priceText =
    dishDetail.price != null
      ? `₫${Number(dishDetail.price).toLocaleString()}`
      : "準備中";

  const totalReviews = dishDetail.total_reviews || 0;
  const breakdown = dishDetail.rating_breakdown || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <button
            className="hover:text-orange-600"
            onClick={() => navigate(`/dish/${menuId}`)}
          >
            メニュー
          </button>
          <span>/</span>
          <span className="text-gray-700 font-medium">原材料・評価</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md border p-6 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {dishDetail.menu_name || dishDetail.name || "料理名"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {dishDetail.restaurant?.name || "レストラン名"} ·{" "}
                  {dishDetail.restaurant?.address || "所在地不明"}
                </p>
                <button
                  onClick={() => setIsFavorited((v) => !v)}
                  className={`mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm transition ${
                    isFavorited
                      ? "bg-red-100 border-red-300 text-red-600"
                      : "bg-white border-gray-300 text-gray-600 hover:border-gray-500"
                  }`}
                >
                  <Heart
                    size={16}
                    className={isFavorited ? "fill-red-500 text-red-500" : ""}
                  />
                  {isFavorited ? "お気に入り済み" : "お気に入りに追加"}
                </button>
              </div>

              <div
                className="relative w-full h-[340px] bg-gray-100 rounded-xl overflow-hidden cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              >
                {dishDetail.images?.length ? (
                  <>
                    <img
                      src={dishDetail.images[thumbIndex]?.image_url}
                      alt={dishDetail.name}
                      className="w-full h-full object-cover"
                    />
                    {dishDetail.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setThumbIndex((prev) =>
                              prev === 0 ? dishDetail.images.length - 1 : prev - 1
                            );
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                        >
                          ❮
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setThumbIndex((prev) =>
                              prev === dishDetail.images.length - 1 ? 0 : prev + 1
                            );
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                        >
                          ❯
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    画像なし
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <ImageIcon size={14} />
                  クリックしてズーム
                </div>
              </div>

              {dishDetail.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {dishDetail.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setThumbIndex(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                        thumbIndex === idx ? "border-blue-500" : "border-gray-300"
                      }`}
                    >
                      <img
                        src={img.image_url}
                        className="w-full h-full object-cover"
                        alt={`Thumbnail ${idx + 1}`}
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-700">
                <span className="font-semibold">参考価格</span>
                <span className="text-lg font-bold text-blue-700">
                  {priceText}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  使用原材料リスト
                </h2>
                {allergenIngredients.length > 0 && (
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                    アレルギー注意
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <IngredientGroup
                  title="主要材料"
                  items={dishDetail.ingredients?.main}
                />
                <IngredientGroup
                  title="副材料"
                  items={dishDetail.ingredients?.others}
                />
                {allergenIngredients.length > 0 && (
                  <IngredientGroup
                    title="アレルギーの可能性"
                    items={allergenIngredients}
                    highlight
                  />
                )}
                {allIngredients.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    原材料情報がまだあります。
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md border p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    平均評価スコア
                  </p>
                  <div className="flex items-end gap-2 mt-2">
                    <span className="text-5xl font-bold text-gray-900">
                      {dishDetail.rating?.toFixed(1) || "0.0"}
                    </span>
                    <div className="flex items-center gap-1 pb-2 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < Math.round(dishDetail.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    総評価数: {totalReviews} 件
                  </p>
                </div>

                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = breakdown[star] || 0;
                    const percent =
                      totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <span className="w-6 text-right">{star}★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-10 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm">
                {["all", "5", "4", "3"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full border text-sm transition ${
                      filter === f
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {f === "all" ? "すべて" : `${f}★`}
                  </button>
                ))}
              </div>

              <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
                <h3 className="font-semibold text-gray-900">評価を投稿</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">星評価:</span>
                  <StarSelector value={selectedRating} onChange={setSelectedRating} />
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="コメントを入力してください"
                  className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {submitError && (
                  <p className="text-red-600 text-sm">{submitError}</p>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setComment("");
                      setSelectedRating(0);
                      setSubmitError("");
                    }}
                    className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                    disabled={submitLoading}
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSubmitComment}
                    className={`px-4 py-2 rounded-lg text-white ${
                      submitLoading
                        ? "bg-orange-300 cursor-not-allowed"
                        : "bg-orange-400 hover:bg-orange-500"
                    }`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? "送信中..." : "投稿する"}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    ユーザーレビュー
                  </h3>
                  <span className="text-sm text-gray-500">
                    {filteredComments.length} 件
                  </span>
                </div>

                {commentsLoading && (
                  <p className="text-gray-500 text-sm">レビューを読み込み中...</p>
                )}
                {commentsError && (
                  <p className="text-red-600 text-sm">{commentsError}</p>
                )}
                {!commentsLoading && !commentsError && filteredComments.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    レビューがまだありません。
                  </p>
                )}

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {filteredComments.map((review) => (
                    <ReviewCard
                      key={review.review_id || review.id}
                      review={review}
                      canEdit={
                        currentUser &&
                        (review.user_id === currentUser.user_id ||
                          review.user?.user_id === currentUser.user_id)
                      }
                      onEdit={() => openEditModal(review)}
                      onDelete={() => openDeleteConfirm(review)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && dishDetail.image_url && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <button
            className="absolute top-6 right-6 text-white hover:text-gray-200"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={28} />
          </button>
          <img
            src={dishDetail.image_url}
            alt={dishDetail.name}
            className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

      {editModal.open && (
        <Modal onClose={() => setEditModal({ ...editModal, open: false })}>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">レビューを編集</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">★の数:</span>
              <StarSelector
                value={editModal.rating}
                onChange={(v) => setEditModal((prev) => ({ ...prev, rating: v }))}
              />
            </div>
            <textarea
              value={editModal.content}
              onChange={(e) =>
                setEditModal((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={3}
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {editModal.error && (
              <p className="text-red-600 text-sm">{editModal.error}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModal({ ...editModal, open: false })}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                disabled={editModal.loading}
              >
                キャンセル
              </button>
              <button
                onClick={submitEdit}
                className={`px-4 py-2 rounded-lg text-white ${
                  editModal.loading
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-400 hover:bg-orange-500"
                }`}
                disabled={editModal.loading}
              >
                {editModal.loading ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteConfirm.open && (
        <Modal onClose={() => setDeleteConfirm({ ...deleteConfirm, open: false })}>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">レビューを削除しますか？</h3>
            <p className="text-sm text-gray-700">
              このレビューを削除してもよろしいですか？この操作は元に戻せません。
            </p>
            {deleteConfirm.error && (
              <p className="text-red-600 text-sm">{deleteConfirm.error}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm({ ...deleteConfirm, open: false })}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                disabled={deleteConfirm.loading}
              >
                キャンセル
              </button>
              <button
                onClick={submitDelete}
                className={`px-4 py-2 rounded-lg text-white ${
                  deleteConfirm.loading
                    ? "bg-red-300 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={deleteConfirm.loading}
              >
                {deleteConfirm.loading ? "削除中..." : "削除"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StarSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {Array.from({ length: 5 }).map((_, idx) => {
        const star = idx + 1;
        return (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="text-yellow-400"
          >
            <Star
              size={22}
              className={value >= star ? "fill-yellow-400" : "text-gray-300"}
            />
          </button>
        );
      })}
    </div>
  );
}

function IngredientGroup({ title, items = [], highlight = false }) {
  if (!items.length) return null;
  return (
    <div
      className={`border rounded-lg p-3 ${
        highlight ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
      }`}
    >
      <p
        className={`text-sm font-semibold ${
          highlight ? "text-red-700" : "text-gray-800"
        }`}
      >
        {title}
      </p>
      <ul className="mt-2 space-y-1">
        {items.map((ing) => (
          <li key={ing.id || ing.ingredient_id || ing.name} className="text-gray-700 text-sm">
            • {ing.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReviewCard({ review, canEdit, onEdit, onDelete }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-800">
            {review.user?.full_name ||
              review.user_name ||
              review.username ||
              "匿名"}
          </p>
          <p className="text-xs text-gray-500">
            {review.created_at
              ? new Date(review.created_at).toLocaleDateString()
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-1 text-yellow-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.round(review.rating || 0)
                  ? "fill-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-gray-700 mt-2 leading-relaxed">
          {review.comment}
        </p>
      )}

      {canEdit && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border text-sm text-gray-700 hover:bg-gray-100"
          >
            <Edit2 size={14} />
            編集
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border text-sm text-red-600 hover:bg-red-50 border-red-200"
          >
            <Trash2 size={14} />
            削除
          </button>
        </div>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
