import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BookGenre } from "../Models/Book";
import "../Styles/AuthorDetails.css";

interface AuthorOption {
  id: string;
  fullName: string;
}

interface BookCreateForm {
  title: string;
  description?: string;
  genre: BookGenre;
  authorId: string;
  publishedDate: string;
  isbn: string;
  pageCount: number;
  publisher: string;
  isAvailable: boolean;
}

export default function BookForm() {
  const navigate = useNavigate();

  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BookCreateForm>({
    title: "",
    description: "",
    genre: BookGenre.Fiction,
    authorId: "",
    publishedDate: "",
    isbn: "",
    pageCount: 0,
    publisher: "",
    isAvailable: true,
  });

  // auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // load authors
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  axios.get("https://localhost:7285/api/author", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((res) => {
    setAuthors(res.data);
  })
  .catch((err) => {
    console.error(err);
    setError("Failed to load authors");
  });
}, [navigate]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleCreate = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://localhost:7285/api/book",
        {
          ...formData,
          publishedDate: formData.publishedDate || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Book created successfully!");
      navigate("/books");
    } catch (err: any) {
  console.log(err.response?.data);
  setError(JSON.stringify(err.response?.data));
}

  };

  return (
    <div>
      <h1 className="title">ADD BOOK</h1>

      <div className="editauthor-container">
        <h2>Create new book</h2>

        <div className="editauthor-form">
          <label>Title:</label>
          <input name="title" value={formData.title} onChange={handleChange} />

          <label>Author:</label>
          <select name="authorId" value={formData.authorId} onChange={handleChange}>
            <option value="">-- Select author --</option>
            {authors.map(a => (
              <option key={a.id} value={a.id}>
                {a.fullName}
              </option>
            ))}
          </select>

          <label>Genre:</label>
          <select
        name="genre"
        value={formData.genre}
        onChange={handleChange}
        >
        <option value="">-- Select genre --</option>
        <option value={0}>Fiction</option>
        <option value={1}>NonFiction</option>
        <option value={2}>ScienceFiction</option>
        <option value={3}>Biography</option>
        <option value={4}>Mystery</option>
        <option value={5}>Romance</option>
        <option value={6}>Fantasy</option>
        <option value={7}>History</option>
        <option value={8}>Thriller</option>
        <option value={9}>SelfHelp</option>
        </select>


          <label>Published date:</label>
          <input type="date" name="publishedDate" value={formData.publishedDate} onChange={handleChange} />

          <label>ISBN:</label>
          <input name="isbn" value={formData.isbn} onChange={handleChange} />

          <label>Page count:</label>
          <input type="number" name="pageCount" value={formData.pageCount} onChange={handleChange} />

          <label>Publisher:</label>
          <input name="publisher" value={formData.publisher} onChange={handleChange} />

          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />

          <label>
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
            />{" "}
            Available
          </label>

          {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

          <button className="primary-btn" onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>

          <button className="back-btn" onClick={() => navigate("/books")}>
            Cancel
          </button>
        </div>
      </div>

      <br />

      <Link to="/books" className="back-link">
        Back to Book List
      </Link>
    </div>
  );
}
