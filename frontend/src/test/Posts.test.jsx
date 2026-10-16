import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

import Posts from "../components/Posts";

import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from "../services/api";

vi.mock("../services/api", () => ({
  getPosts: vi.fn(),
  createPost: vi.fn(),
  updatePost: vi.fn(),
  deletePost: vi.fn(),
}));

const samplePost = {
  _id: "1",
  title: "My First Post",
  content: "This is my first post content.",
  createdAt: "2026-10-15T10:00:00.000Z",
  imageUrl: "",
};

describe("Posts Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getPosts.mockResolvedValue([samplePost]);
    createPost.mockResolvedValue({
      ...samplePost,
      _id: "2",
      title: "New Test Post",
      content: "New post content",
    });
    updatePost.mockResolvedValue({
      ...samplePost,
      title: "Updated Post",
      content: "Updated content",
    });
    deletePost.mockResolvedValue({
      message: "Post deleted successfully",
    });

    vi.stubGlobal(
      "confirm",
      vi.fn().mockReturnValue(true)
    );

    vi.stubGlobal("scrollTo", vi.fn());
  });

  it("shows the page heading and form", async () => {
    render(<Posts />);

    expect(
      screen.getByRole("heading", { name: /community posts/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Post title")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Write something...")
    ).toBeInTheDocument();

    await screen.findByText("My First Post");
  });

  it("displays posts fetched from the API", async () => {
    render(<Posts />);

    expect(
      await screen.findByText("My First Post")
    ).toBeInTheDocument();

    expect(
      screen.getByText("This is my first post content.")
    ).toBeInTheDocument();

    expect(getPosts).toHaveBeenCalledTimes(1);
  });

  it("shows an empty state when no posts exist", async () => {
    getPosts.mockResolvedValueOnce([]);

    render(<Posts />);

    expect(
      await screen.findByText("No posts yet. Create the first one.")
    ).toBeInTheDocument();
  });

  it("shows an error when loading posts fails", async () => {
    getPosts.mockRejectedValueOnce(
      new Error("Unable to connect to the backend.")
    );

    render(<Posts />);

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Unable to connect to the backend.");
  });

  it("creates a new post", async () => {
    const user = userEvent.setup();

    render(<Posts />);

    await screen.findByText("My First Post");

    await user.type(
      screen.getByPlaceholderText("Post title"),
      "New Test Post"
    );

    await user.type(
      screen.getByPlaceholderText("Write something..."),
      "New post content"
    );

    await user.click(
      screen.getByRole("button", { name: "Create Post" })
    );

    await waitFor(() => {
      expect(createPost).toHaveBeenCalledWith({
        title: "New Test Post",
        content: "New post content",
        image: null,
      });
    });

    expect(
      await screen.findByText("Post created and saved to MongoDB.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("New Test Post")
    ).toBeInTheDocument();
  });

  it("validates empty form fields", async () => {
    const user = userEvent.setup();

    render(<Posts />);

    await screen.findByText("My First Post");

    await user.click(
      screen.getByRole("button", { name: "Create Post" })
    );

    expect(
      screen.getByRole("alert")
    ).toHaveTextContent("Title and content are required.");

    expect(createPost).not.toHaveBeenCalled();
  });

  it("enters edit mode when Edit is clicked", async () => {
    const user = userEvent.setup();

    render(<Posts />);

    await screen.findByText("My First Post");

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(
      screen.getByRole("heading", { name: "Edit post" })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Post title")
    ).toHaveValue("My First Post");

    expect(
      screen.getByRole("button", { name: "Update Post" })
    ).toBeInTheDocument();
  });

  it("updates an existing post", async () => {
    const user = userEvent.setup();

    render(<Posts />);

    await screen.findByText("My First Post");

    await user.click(screen.getByRole("button", { name: "Edit" }));

    const titleInput = screen.getByPlaceholderText("Post title");
    const contentInput = screen.getByPlaceholderText("Write something...");

    await user.clear(titleInput);
    await user.type(titleInput, "Updated Post");

    await user.clear(contentInput);
    await user.type(contentInput, "Updated content");

    await user.click(
      screen.getByRole("button", { name: "Update Post" })
    );

    await waitFor(() => {
      expect(updatePost).toHaveBeenCalledWith("1", {
        title: "Updated Post",
        content: "Updated content",
        image: null,
      });
    });

    expect(
      await screen.findByText("Post updated successfully.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Updated Post")
    ).toBeInTheDocument();
  });

  it("cancels edit mode", async () => {
    const user = userEvent.setup();

    render(<Posts />);

    await screen.findByText("My First Post");

    await user.click(screen.getByRole("button", { name: "Edit" }));

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(
      screen.getByRole("heading", { name: "New post" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Cancel" })
    ).not.toBeInTheDocument();
  });

  it("deletes a post after confirmation", async () => {
    const user = userEvent.setup();

    render(<Posts />);

    await screen.findByText("My First Post");

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(deletePost).toHaveBeenCalledWith("1");
    });

    expect(
      await screen.findByText("Post deleted successfully.")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("My First Post")
    ).not.toBeInTheDocument();
  });

  it("does not delete a post when confirmation is cancelled", async () => {
    const user = userEvent.setup();

    window.confirm.mockReturnValueOnce(false);

    render(<Posts />);

    await screen.findByText("My First Post");

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(deletePost).not.toHaveBeenCalled();

    expect(screen.getByText("My First Post")).toBeInTheDocument();
  });

  it("shows an error when creating a post fails", async () => {
    const user = userEvent.setup();

    createPost.mockRejectedValueOnce(
      new Error("Unable to save the post.")
    );

    render(<Posts />);

    await screen.findByText("My First Post");

    await user.type(
      screen.getByPlaceholderText("Post title"),
      "Failed Post"
    );

    await user.type(
      screen.getByPlaceholderText("Write something..."),
      "Some content"
    );

    await user.click(
      screen.getByRole("button", { name: "Create Post" })
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Unable to save the post.");
  });
});