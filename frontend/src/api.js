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
    throw new Error(data.message || "Đăng ký thất bại");
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
    throw new Error(data.message || "Đăng nhập thất bại");
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
    throw new Error(data.message || "Lấy thông tin người dùng thất bại");
  }

  return data;
}

export async function verifyResetToken(token) {
  const res = await fetch(
    `${API_URL}/auth/reset-password/verify?token=${encodeURIComponent(token)}`
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Token verification failed");
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
    throw new Error(data.message || "Reset password failed");
  }

  return data;
}

// ==================== Other APIs ====================

export async function getUsers() {
  const res = await fetch(`${API_URL}/api/users`);
  return res.json();
}
