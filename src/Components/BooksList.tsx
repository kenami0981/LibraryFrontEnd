import { useEffect, useState } from "react";
import axios from "axios";
import { BookDto } from "../Models/Book";
import "../Styles/BooksList.css";
import { Link } from "react-router-dom";

export default function BooksList() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<BookDto[]>("https://localhost:7285/api/book")
      .then((res) => setBooks(res.data))
      .catch(() => setError("Failed to load books"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="books-list-wrapper">

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <h2>{book.title}</h2>

            <p className="book-author">{book.authorName}</p>

            <div className="book-meta">
              <span>{book.genre}</span>
              <span>{new Date(book.publishedDate).getFullYear()}</span>
            </div>

        

            <div className={`availability ${book.isAvailable ? "yes" : "no"}`}>
              {book.isAvailable ? "Available" : "Unavailable"}
            </div>

            <Link to={`/books/${book.id}`} className="details-btn">
              Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
