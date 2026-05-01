'use client';

import { Post } from "@/types";
import { likePost, retweetPost } from "@/lib/apis";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PostCard = ({ post }: { post: Post }) => {
  const router = useRouter();
  const [currentPost, setCurrentPost] = useState<Post>(post);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const updated = await likePost(currentPost.id);
    setCurrentPost(updated);
  };

  const handleRetweet = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const updated = await retweetPost(currentPost.id);
    setCurrentPost(updated);
  };

  return (
    <div
      className="post-card"
      onClick={() => router.push(`/post/${currentPost.id}`)}
    >
      <div className="post-inner">
        <div className="avatar">
          {currentPost.author.username.charAt(0).toUpperCase()}
        </div>

        <div className="post-body">
          <div className="post-header">
            <span className="post-author">
              {currentPost.author.username}
            </span>

            <span className="post-date">
              ahora
            </span>
          </div>

          <p className="post-content">
            {currentPost.content}
          </p>

          <div className="post-actions">
            <button
              className={
                currentPost.liked ? "action-button active" : "action-button"
              }
              onClick={handleLike}
            >
              ♥ {currentPost.likes}
            </button>

            <button
              className={
                currentPost.retweeted ? "action-button active" : "action-button"
              }
              onClick={handleRetweet}
            >
              ↻ {currentPost.retweets}
            </button>

            <button className="action-button">
              ◯ {currentPost.comments.length}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;