import { NavLink } from "react-router-dom";
import "../Styles/NavBar.css";

export default function LibraryNavbar() {
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("displayName");
    window.location.href = "/login";
  };

  return (
    <nav className="library-navbar">
      <div className="navbar-logo">📚 Library</div>

      <div className="navbar-content">
        <ul className="navbar-left">
          <li>
            <NavLink to="/authors" className="nav-link">
              Authors
            </NavLink>
          </li>
          <li>
            <NavLink to="/books" className="nav-link">
              Books
            </NavLink>
          </li>

          {username && (
            <>
              <li>
                <NavLink to="/add-author" className="nav-link">
                  Add Author
                </NavLink>
              </li>
              <li>
                <NavLink to="/add-book" className="nav-link add-link">
                  Add Book
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <ul className="navbar-right">
          {!username ? (
            <>
              <li>
                <NavLink to="/login" className="nav-link">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className="nav-link">
                  Register
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="nav-user">
                Logged in as <strong>{username}</strong>
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}


