const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(data?.message || "API request failed");
  }
  return data;
}

export function getPosts() {
  return request("/api/posts");
}

export function createPost({ title, content, image }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (image) formData.append("image", image);
  return request("/api/posts", { method: "POST", body: formData });
}

export function updatePost(id, { title, content, image }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (image) formData.append("image", image);
  return request(`/api/posts/${id}`, { method: "PUT", body: formData });
}

export function deletePost(id) {
  return request(`/api/posts/${id}`, { method: "DELETE" });
}
