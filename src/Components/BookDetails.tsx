import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BookDto } from "../Models/Book";
import "../Styles/AuthorDetails.css";
import { BookGenre } from "../Models/Book";

interface AuthorOption {
  id: string;
  fullName: string;
}
const genreOptions = Object.entries(BookGenre).filter(
  ([_, v]) => typeof v === "number"
) as [string, number][];


export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<BookDto | null>(null);
  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
  title: "",
  description: "",
  genre: "" as number | "",
  publishedDate: "",
  isbn: "",
  pageCount: 0,
  publisher: "",
  isAvailable: true,
  authorId: "",
});



  const role = localStorage.getItem("role");
  const isAdmin = role === "Admin";

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
    .get<AuthorOption[]>("https://localhost:7285/api/author", {
        headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setAuthors(res.data));

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get<BookDto>(`https://localhost:7285/api/book/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBook(res.data);
        setFormData({
  title: res.data.title,
  description: res.data.description ?? "", 
  genre: Number(res.data.genre),
  publishedDate: res.data.publishedDate.substring(0, 10),
  isbn: res.data.isbn,
  pageCount: res.data.pageCount,
  publisher: res.data.publisher,
  isAvailable: res.data.isAvailable,
  authorId: res.data.authorId ?? "",
});


      })
      .catch((err) => {
        if (err.response?.status === 401) navigate("/login");
        else if (err.response?.status === 403)
          setError("You are not authorized to view this page");
        else setError("Error loading book details");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:7285/api/book/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/books");
    } catch {
      alert("Failed to delete book");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "genre"
        ? Number(value)
        : value,

    }));
  };

  const handleSave = async () => {
  if (!isAdmin) return;

  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `https://localhost:7285/api/book/${id}`,
      { ...formData, pageCount: Number(formData.pageCount)},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const res = await axios.get<BookDto>(`https://localhost:7285/api/book/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setBook(res.data);
    const updatedAuthor = authors.find(a => a.id === formData.authorId);

setBook(prev => prev ? {
  ...prev,
  title: formData.title,
  description: formData.description,
  authorId: formData.authorId,
  authorName: updatedAuthor?.fullName ?? prev.authorName,
  isbn: formData.isbn,
  pageCount: formData.pageCount,
  publisher: formData.publisher,
  isAvailable: formData.isAvailable,
  publishedDate: formData.publishedDate,
  genre: prev.genre,
} : prev);


    setIsEditing(false);
  } catch {
    alert("Failed to update book");
  }
};


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div>
      <h1 className="title">BOOK DETAILS</h1>

      {!isEditing ? (
        <div className="author-details-card">
          <h1 className="details-title">{book.title}</h1>

          <div className="details-grid">
            <p><span>Author:</span> {book.authorName}</p>
            <p><span>Genre:</span> {book.genre}</p>
            <p><span>Published:</span> {new Date(book.publishedDate).toLocaleDateString()}</p>
            <p><span>ISBN:</span> {book.isbn}</p>
            <p><span>Pages:</span> {book.pageCount}</p>
            <p><span>Publisher:</span> {book.publisher}</p>
            <p><span>Available:</span> {book.isAvailable ? "Yes" : "No"}</p>
            <p><span>Description:</span> {book.description || "—"}</p>
          </div>

          {isAdmin && (
            <div className="details-buttons">
              <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="btn-delete" onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      ) : (
        <div className="editauthor-container">
          <h2>Edit Book</h2>

          <div className="editauthor-form">
            <label>Title</label>
            <input name="title" value={formData.title} onChange={handleChange} />
            <label>Author</label>
<select name="authorId" value={formData.authorId} onChange={handleChange}>
  <option value="">-- Select author --</option>
  {authors.map((a) => (
    <option key={a.id} value={a.id}>
      {a.fullName}
    </option>
  ))}
</select>

            <label>Genre</label>
            <select
  name="genre"
  value={formData.genre}
  onChange={handleChange}
>
  <option value="">-- Select genre --</option>
  {genreOptions.map(([name, value]) => (
    <option key={value} value={value}>
      {name}
    </option>
  ))}
</select>



            <label>Published Date</label>
            <input type="date" name="publishedDate" value={formData.publishedDate} onChange={handleChange} />

            <label>ISBN</label>
            <input name="isbn" value={formData.isbn} onChange={handleChange} />

            <label>Page count</label>
            <input type="number" name="pageCount" value={formData.pageCount} onChange={handleChange} />

            <label>Publisher</label>
            <input name="publisher" value={formData.publisher} onChange={handleChange} />

            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />

            <label>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              /> Available
            </label>

            <button className="primary-btn" onClick={handleSave}>Save</button>
            <button className="back-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}

      <br />

      <Link to="/books" className="back-link">
        Back to Books List
      </Link>
    </div>
  );
}
