import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../services/api";

describe("Sprint 11 API service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const mockResponse = (data, options = {}) => ({
    ok: options.ok ?? true,
    status: options.status ?? 200,
    headers: {
      get: () => options.contentType ?? "application/json",
    },
    json: async () => data,
    text: async () => JSON.stringify(data),
  });

  it("fetches posts from the backend", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        mockResponse([{ _id: "1", title: "Hello" }])
      )
    );

    await expect(getPosts()).resolves.toEqual([
      { _id: "1", title: "Hello" },
    ]);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/posts",
      {}
    );
  });

  it("creates a post using multipart form data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(mockResponse({ _id: "1" }, { status: 201 }))
    );

    const file = new File(["image"], "poster.png", {
      type: "image/png",
    });

    await createPost({
      title: "Test Post",
      content: "Test Content",
      image: file,
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][1].body).toBeInstanceOf(FormData);
  });

  it("updates an existing post", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(mockResponse({ _id: "1" }))
    );

    const file = new File(["image"], "poster.png", {
      type: "image/png",
    });

    await updatePost("1", {
      title: "Updated Post",
      content: "Updated Content",
      image: file,
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][1].body).toBeInstanceOf(FormData);
  });

  it("deletes a post", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        mockResponse({ message: "Post deleted successfully" })
      )
    );

    await deletePost("123");

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/posts/123",
      { method: "DELETE" }
    );
  });

  it("handles a failed API request", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        mockResponse(
          { message: "Server error" },
          { ok: false, status: 500 }
        )
      )
    );

    await expect(getPosts()).rejects.toThrow();
  });

  it("handles a network error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    await expect(getPosts()).rejects.toThrow("Network error");
  });
});