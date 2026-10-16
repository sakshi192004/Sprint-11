import { useEffect, useState } from "react";
import { createPost, deletePost, getPosts, updatePost } from "../services/api";

const initialForm = { title: "", content: "" };

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPosts = async () => {
    setLoading(true);
    setError("");
    try {
      setPosts(await getPosts());
    } catch (requestError) {
      setError(requestError.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        const updated = await updatePost(editingId, { ...form, image });
        setPosts((current) => current.map((post) => (post._id === editingId ? updated : post)));
        setSuccess("Post updated successfully.");
      } else {
        const created = await createPost({ ...form, image });
        setPosts((current) => [created, ...current]);
        setSuccess("Post created and saved to MongoDB.");
      }
      setForm(initialForm);
      setImage(null);
      setEditingId(null);
      event.target.reset();
    } catch (requestError) {
      setError(requestError.message || "Unable to save the post.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (post) => {
    setEditingId(post._id);
    setForm({ title: post.title, content: post.content });
    setImage(null);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    setError("");
    try {
      await deletePost(id);
      setPosts((current) => current.filter((post) => post._id !== id));
      setSuccess("Post deleted successfully.");
      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
      }
    } catch (requestError) {
      setError(requestError.message || "Unable to delete the post.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setImage(null);
    setSuccess("");
    setError("");
  };

  return (
    <main className="posts-page">
      <section className="posts-hero">
        <div>
          
          <h1>Community <span>Posts</span></h1>
          
        </div>
        
      </section>

      <section className="posts-layout">
        <form className="post-form" onSubmit={handleSubmit}>
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">{editingId ? "UPDATE DOCUMENT" : "CREATE DOCUMENT"}</p>
              <h2>{editingId ? "Edit post" : "New post"}</h2>
            </div>
          </div>

          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title" /></label>
          <label>Content<textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write something..." rows="6" /></label>
          <label>Thumbnail <span className="muted">(optional)</span><input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} /></label>

          {error && <div className="error-box" role="alert">{error}</div>}
          {success && <div className="success-box" role="status">{success}</div>}

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Update Post" : "Create Post"}
            </button>
            {editingId && <button className="secondary-button" type="button" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>

        <div className="posts-list">
          <div className="section-heading compact">
            <div><h2>Saved Posts</h2></div>
            <span className="movie-count">{posts.length} documents</span>
          </div>

          {loading && <div className="loader">Loading posts from API...</div>}
          {!loading && posts.length === 0 && !error && <div className="empty-state">No posts yet. Create the first one.</div>}

          <div className="posts-grid">
            {posts.map((post) => (
              <article className="post-card" key={post._id}>
                {post.imageUrl && <img src={post.imageUrl} alt="" className="post-image" />}
                <div className="post-card-body">
                  <p className="post-date">{new Date(post.createdAt).toLocaleString()}</p>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <div className="post-actions">
                    <button className="secondary-button" onClick={() => startEdit(post)}>Edit</button>
                    <button className="danger-button" onClick={() => handleDelete(post._id)}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
