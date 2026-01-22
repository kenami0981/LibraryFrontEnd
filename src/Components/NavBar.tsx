import { Link, NavLink } from "react-router-dom";
import "../Styles/NavBar.css";


export default function LibraryNavbar() {
  return (
    <nav className="library-navbar">
      <div className="navbar-logo">
        📚 Library
      </div>

      <ul className="navbar-links">
        <li>
          <NavLink to="/authors" className="nav-link">
            Authors
          </NavLink>
        </li>
        <li>
          <NavLink to="/add-author" className="nav-link">
            Add Author
          </NavLink>
        </li>
        <li>
          <NavLink to="/books" className="nav-link">
            Books
          </NavLink>
        </li>
        <li>
          <NavLink to="/add-book" className="nav-link add-link">
            Add Book
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
