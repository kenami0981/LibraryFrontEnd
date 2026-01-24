import { useEffect, useState } from "react";
import "../Styles/AuthorsList.css";
import { Author} from "../Models/Author";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AuthorsList() {
    const navigate = useNavigate();

  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  setLoading(true);

  axios
    .get<Author[]>("https://localhost:7285/api/author", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setAuthors(response.data);
    })
    .catch((err) => {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Błąd podczas pobierania autorów");
      }
    })
    .finally(() => {
      setLoading(false);
    });
}, [navigate]);


  if (loading) return <p>Ładowanie autorów...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="author-list-wrapper">
      <h1 className="author-list-title">Lista autorów</h1>

      <ul className="author-list">
        {authors.map((author) => (
          <li key={author.id} className="author-card">
            <Link to={`/authors/${author.id}`} className="author-link">
              <h2>{author.fullName}</h2>
              <span className="author-arrow">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
