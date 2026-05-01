'use client';

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Post } from "@/types";
import { createPost, getPosts } from "@/lib/apis";
import PostCard from "@/components/PostCard";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState<string>("");

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const loadPosts = () => {
    setLoading(true);
    setError("");

    getPosts(page)
      .then((data) => {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      })
      .catch((e: AxiosError) => {
        console.log(e.response?.data);

        if (e.response?.status === 500) {
          setError("El servidor ha devuelto un error al cargar las publicaciones.");
        } else if (e.response?.status === 401) {
          setError("No autorizado. Cierra sesión y vuelve a entrar.");
        } else if (e.response?.status === 404) {
          setError("No se ha encontrado el endpoint de publicaciones.");
        } else {
          setError(e.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

  const publishPost = async () => {
    if (content.trim() === "") return;

    try {
      setError("");

      const newPost = await createPost(content);

      setPosts([newPost, ...posts]);
      setContent("");
    } catch (e) {
      const error = e as AxiosError;

      if (error.response?.status === 500) {
        setError("El servidor ha devuelto un error al publicar.");
      } else if (error.response?.status === 401) {
        setError("No autorizado. Cierra sesión y vuelve a entrar.");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <main className="container">
      <section className="publish-box">
        <div className="publish-row">
          <div className="avatar">?</div>

          <textarea
            className="textarea"
            maxLength={280}
            placeholder="¿Qué hay de nuevo en Nebrija?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="publish-bottom">
          <span className="counter">{content.length}/280</span>

          <button className="main-button" onClick={publishPost}>
            ✈ Publicar
          </button>
        </div>
      </section>

      <div className="section-title">
        ✣ Últimas publicaciones
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <section className="posts-list">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>

      <div className="pagination">
        <button
          className="secondary-button"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Anterior
        </button>

        <span>
          {page} / {totalPages}
        </span>

        <button
          className="secondary-button"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </main>
  );
};

export default HomePage;