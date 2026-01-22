import { useEffect, useState } from "react";
import "../Styles/AuthorsList.css"; // możesz później zmienić nazwę na AuthorsList.css 😉
import { Author} from "../Models/Author";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AuthorsList() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    axios
      .get<Author[]>("https://localhost:7285/api/author")
      .then((response) => {
        setAuthors(response.data);
      })
      .catch(() => {
        setError("Błąd podczas pobierania autorów");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Ładowanie autorów...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="car-list-wrapper">
      <h1 className="car-list-title">Lista autorów</h1>

      <ul className="car-list">
        {authors.map((author) => (
          <li key={author.id} className="car-card">
            <Link to={`/authors/${author.id}`} className="car-link">
              <h2>{author.fullName}</h2>
              <span className="car-arrow">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
