import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "../Styles/NavBar.css";

export default function LibraryNavbar() {
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setRole(localStorage.getItem("role"));
  }, []);

  const isAdmin = role === "Admin";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="library-navbar">
      <div className="navbar-logo">📚 Library</div>

      <div className="navbar-content">
        <ul className="navbar-left">
          <li><NavLink to="/authors" className="nav-link">Authors</NavLink></li>
          <li><NavLink to="/books" className="nav-link">Books</NavLink></li>

          {isAdmin && (
            <>
              <li><NavLink to="/add-author" className="nav-link">Add Author</NavLink></li>
              <li><NavLink to="/add-book" className="nav-link add-link">Add Book</NavLink></li>
            </>
          )}
        </ul>

        <ul className="navbar-right">
          {!username ? (
            <>
              <li><NavLink to="/login" className="nav-link">Login</NavLink></li>
              <li><NavLink to="/register" className="nav-link">Register</NavLink></li>
            </>
          ) : (
            <>
              <li className="nav-user">
                Logged in as <strong>{username}</strong> ({role})
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}





