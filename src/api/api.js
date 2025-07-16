const API_URL = "http://127.0.0.1:8000"; // or your Render backend URL

/**
 * Log in with email/password
 * Returns: { access_token }
 */
export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json(); // { access_token }
}

/**
 * Get the currently authenticated user info
 * Requires: token
 */
export async function getMe(token) {
  const res = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json(); // { user_id, email }
}

/**
 * Send a chat message
 * Requires: input text and optional token
 * Returns: { result: GPT response }
 */
export async function sendChat(input, token) {
  const form = new FormData();
  form.append("input", input);

  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
    body: form,
  });

  if (!res.ok) {
    throw new Error("Chat error");
  }

  return res.json(); // { result }
}

/**
 * (Optional) Load chat history for authenticated users
 */
export async function getChatHistory(token) {
  const res = await fetch(`${API_URL}/chat/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load history");
  }

  return res.json(); // array of messages
}
