'use client';

import PostCard from "@/components/PostCard";
import { followUser, getMyProfile, getProfile, getUserPosts, unfollowUser } from "@/lib/apis";
import { Post, User } from "@/types";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { username } = useParams();
  const router = useRouter();

  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadProfile =
      username === "me" ? getMyProfile() : getProfile(String(username));

    loadProfile
      .then((data) => {
        setProfile(data);
      })
      .catch((e: AxiosError) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username]);

  useEffect(() => {
    if (!profile) return;

    getUserPosts(profile.username, page).then((data) => {
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    });
  }, [profile, page]);

  const toggleFollow = async () => {
    if (!profile) return;

    if (profile.isFollowing) {
      const updated = await unfollowUser(profile.id);
      setProfile(updated);
    } else {
      const updated = await followUser(profile.id);
      setProfile(updated);
    }
  };

  return (
    <main className="container">
      <span className="back-link" onClick={() => router.push("/")}>
        ← Volver
      </span>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {profile && (
        <>
          <section className="profile-box">
            <div className="profile-cover"></div>

            <div className="profile-content">
              <div className="profile-avatar">
                {profile.username.charAt(0).toUpperCase()}
              </div>

              <div className="profile-info">
                <h1 className="profile-name">{profile.username}</h1>

                {username !== "me" && (
                  <button className="follow-button" onClick={toggleFollow}>
                    {profile.isFollowing ? "Siguiendo" : "Seguir"}
                  </button>
                )}
              </div>

              <div className="profile-stats">
                <span>{profile.followers || 0} seguidores</span>
                <span>{profile.following || 0} seguidos</span>
              </div>

              {profile.bio && <p>{profile.bio}</p>}
            </div>
          </section>

          <div className="section-title">
            Publicaciones ({posts.length})
          </div>

          {posts.length === 0 && (
            <p className="empty-message">Sin publicaciones aun</p>
          )}

          <section className="posts-list">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>

          {posts.length > 0 && (
            <div className="pagination">
              <button
                className="secondary-button"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </button>

              <span>{page} / {totalPages}</span>

              <button
                className="secondary-button"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default ProfilePage;