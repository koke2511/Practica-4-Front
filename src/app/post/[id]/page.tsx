'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Post } from "@/types";
import { createComment, getPostById, likePost, retweetPost } from "@/lib/apis";

const PostDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [commentContent, setCommentContent] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    getPostById(String(id))
      .then((data) => {
        setPost(data);
      })
      .catch((e: AxiosError) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleLike = async () => {
    if (!post) return;

    const updated = await likePost(post.id);
    setPost(updated);
  };

  const handleRetweet = async () => {
    if (!post) return;

    const updated = await retweetPost(post.id);
    setPost(updated);
  };

  const sendComment = async () => {
    if (!post) return;
    if (commentContent.trim() === "") return;

    const updatedPost = await createComment(post.id, commentContent);

    setPost(updatedPost);
    setCommentContent("");
  };

  return (
    <main className="container">
      <span className="back-link" onClick={() => router.push("/")}>
        ← Volver
      </span>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {post && (
        <>
          <section className="post-detail">
            <div className="post-inner">
              <div className="avatar">
                {post.author.username.charAt(0).toUpperCase()}
              </div>

              <div className="post-body">
                <div className="post-header">
                  <span className="post-author">
                    {post.author.username}
                  </span>

                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="post-content">
                  {post.content}
                </p>

                <div className="post-actions">
                  <button className="action-button" onClick={handleLike}>
                    ♥ {post.likes}
                  </button>

                  <button className="action-button" onClick={handleRetweet}>
                    ↻ {post.retweets}
                  </button>

                  <button className="action-button">
                    ◯ {post.comments.length}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="comment-box">
            <h2>Comentarios</h2>

            <textarea
              className="textarea"
              placeholder="Escribe un comentario..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />

            <button className="main-button" onClick={sendComment}>
              Comentar
            </button>
          </section>

          <section className="comments-list">
            {post.comments.map((comment) => (
              <div key={comment.id} className="comment">
                <strong>
                  {comment.author.username}
                </strong>

                <p>
                  {comment.content}
                </p>

                <small>
                  {new Date(comment.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
};

export default PostDetailPage;