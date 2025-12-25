export const API_URL = "http://localhost:3000";

// ==================== Auth APIs ====================

export async function register(userData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "登録に失敗しました");
  }

  return data;
}

export async function login(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "ログインに失敗しました");
  }

  return data;
}

export async function getProfile(token) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "ユーザー情報の取得に失敗しました");
  }

  return data;
}

export async function updateProfile(token, profileData) {
  const res = await fetch(`${API_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "プロフィールの更新に失敗しました");
  }

  return data;
}

export async function changePassword(token, passwordData) {
  const res = await fetch(`${API_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(passwordData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "パスワードの変更に失敗しました");
  }

  return data;
}

export async function verifyResetToken(token) {
  const res = await fetch(
    `${API_URL}/auth/reset-password/verify?token=${encodeURIComponent(token)}`
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "トークンの検証に失敗しました");
  }

  return data;
}

export async function resetPassword(payload) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "パスワードのリセットに失敗しました");
  }

  return data;
}

// ==================== Favorites APIs ====================

export async function getFavorites(token) {
  const res = await fetch(`${API_URL}/api/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "お気に入りの取得に失敗しました");
  }

  return data;
}

export async function addMenuFavorite(token, menuId) {
  const res = await fetch(`${API_URL}/api/favorites/menu/${menuId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "お気に入りの追加に失敗しました");
  }

  return data;
}

export async function removeMenuFavorite(token, menuId) {
  const res = await fetch(`${API_URL}/api/favorites/menu/${menuId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "お気に入りの削除に失敗しました");
  }

  return data;
}

export async function addRestaurantFavorite(token, restaurantId) {
  const res = await fetch(`${API_URL}/api/favorites/restaurant/${restaurantId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "お気に入りの追加に失敗しました");
  }

  return data;
}

export async function removeRestaurantFavorite(token, restaurantId) {
  const res = await fetch(`${API_URL}/api/favorites/restaurant/${restaurantId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "お気に入りの削除に失敗しました");
  }

  return data;
}

export async function checkMenuFavorite(token, menuId) {
  const res = await fetch(`${API_URL}/api/favorites/menu/${menuId}/check`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "確認に失敗しました");
  }

  return data;
}

export async function checkRestaurantFavorite(token, restaurantId) {
  const res = await fetch(`${API_URL}/api/favorites/restaurant/${restaurantId}/check`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "確認に失敗しました");
  }

  return data;
}

// ==================== Saved APIs ====================

export async function getSaved(token) {
  const res = await fetch(`${API_URL}/api/saved`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "保存済みの取得に失敗しました");
  }

  return data;
}

export async function addMenuSaved(token, menuId) {
  const res = await fetch(`${API_URL}/api/saved/menu/${menuId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "保存に失敗しました");
  }

  return data;
}

export async function removeMenuSaved(token, menuId) {
  const res = await fetch(`${API_URL}/api/saved/menu/${menuId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "保存解除に失敗しました");
  }

  return data;
}

export async function checkMenuSaved(token, menuId) {
  const res = await fetch(`${API_URL}/api/saved/menu/${menuId}/check`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "確認に失敗しました");
  }

  return data;
}

// ==================== Other APIs ====================

export async function getUsers() {
  const res = await fetch(`${API_URL}/api/users`);
  return res.json();
}

