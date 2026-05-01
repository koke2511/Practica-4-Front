'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";

const Header = () => {
  const router = useRouter();

  const logout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <header className="header">
      <Link href="/" className="logo-box">
        <div className="logo-circle">N</div>
        <div className="logo">
          Nebrija<span>Social</span>
        </div>
      </Link>

      <nav className="nav">
        <Link href="/" className="nav-link">
          ⌂
        </Link>

        <Link href="/profile/me" className="user-mini">
          <div className="user-avatar-small">K</div>
          <span>koke</span>
        </Link>

        <button className="logout-button" onClick={logout}>
          ↪
        </button>
      </nav>
    </header>
  );
};

export default Header;