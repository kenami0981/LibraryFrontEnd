import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BookGenre } from "../Models/Book";
import "../Styles/AuthorDetails.css";

interface AuthorOption {
  id: string;
  fullName: string;
}
//Walidacje
interface FormErrors {
  title?: string;
  authorId?: string;
  publishedDate?: string;
  isbn?: string;
  pageCount?: string;
  publisher?: string;
  genre?: string;
  description?: string;
}

const validateForm = (data: BookCreateForm): FormErrors => {
  const errors: FormErrors = {};

  if (!data.title.trim()) {
    errors.title = "Title is required.";
  } else if (data.title.length > 200) {
    errors.title = "Title cannot exceed 200 characters.";
  }


  if (!data.authorId) {
    errors.authorId = "Author is required.";
  }

  if (!data.publishedDate) {
    errors.publishedDate = "Published date is required.";
  } else if (new Date(data.publishedDate) > new Date()) {
    errors.publishedDate = "Published date cannot be in the future.";
  }


  if (!data.isbn) {
    errors.isbn = "ISBN is required.";
  } else if (!/^(97(8|9))?\d{9}(\d|X)$/.test(data.isbn)) {
    errors.isbn = "ISBN must be a valid format.";
  }

  if (data.pageCount <= 0) {
    errors.pageCount = "Page count must be greater than zero.";
  }

  if (!data.publisher.trim()) {
    errors.publisher = "Publisher is required.";
  } else if (data.publisher.length > 100) {
    errors.publisher = "Publisher cannot exceed 100 characters.";
  }


  if (data.genre === null || data.genre === undefined) {
    errors.genre = "Genre must be selected.";
  }


  if (data.description && data.description.length > 1000) {
    errors.description = "Description cannot exceed 1000 characters.";
  }

  return errors;
};

interface BookCreateForm {
  title: string;
  description?: string;
  genre: number;
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get<AuthorOption[]>("https://localhost:7285/api/author", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAuthors(res.data))
      .catch(() => setError("Failed to load authors"));
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "genre"
          ? Number(value)
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  

   const [formErrors, setFormErrors] = useState<FormErrors>({});

const handleCreate = async () => {
  const errors = validateForm(formData);
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }

  setFormErrors({});
  setLoading(true);
  setError(null);

  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "https://localhost:7285/api/book",
      {
        ...formData,
        publishedDate: formData.publishedDate
          ? new Date(formData.publishedDate).toISOString()
          : null,
        authorId: formData.authorId || null,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Book created successfully!");
    navigate("/books");
  } catch (err: any) {
    console.log(err.response?.data);
    setError(JSON.stringify(err.response?.data));
  } finally {
    setLoading(false);
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
            {formErrors.title && <p className="error">{formErrors.title}</p>}

            <label>Author:</label>
            <select name="authorId" value={formData.authorId} onChange={handleChange}>
            <option value="">-- Select author --</option>
            {authors.map((a) => (
                <option key={a.id} value={a.id}>
                {a.fullName}
                </option>
            ))}
            </select>
            {formErrors.authorId && <p className="error">{formErrors.authorId}</p>}


          <label>Genre:</label>
          <select name="genre" value={formData.genre} onChange={handleChange}>
            <option value="">-- Select genre --</option>
            <option value={BookGenre.Fiction}>Fiction</option>
            <option value={BookGenre.NonFiction}>NonFiction</option>
            <option value={BookGenre.ScienceFiction}>ScienceFiction</option>
            <option value={BookGenre.Biography}>Biography</option>
            <option value={BookGenre.Mystery}>Mystery</option>
            <option value={BookGenre.Romance}>Romance</option>
            <option value={BookGenre.Fantasy}>Fantasy</option>
            <option value={BookGenre.History}>History</option>
            <option value={BookGenre.Thriller}>Thriller</option>
            <option value={BookGenre.SelfHelp}>SelfHelp</option>
          </select>
          {formErrors.genre && <p className="error">{formErrors.genre}</p>}

          <label>Published date:</label>
          <input
            type="date"
            name="publishedDate"
            value={formData.publishedDate}
            onChange={handleChange}
          />
          {formErrors.publishedDate && <p className="error">{formErrors.publishedDate}</p>}

          <label>ISBN:</label>
          <input name="isbn" value={formData.isbn} onChange={handleChange} />
            {formErrors.isbn && <p className="error">{formErrors.isbn}</p>}
          <label>Page count:</label>
          <input
            type="number"
            name="pageCount"
            value={formData.pageCount}
            onChange={handleChange}
          />
          {formErrors.pageCount && <p className="error">{formErrors.pageCount}</p>}

          <label>Publisher:</label>
          <input name="publisher" value={formData.publisher} onChange={handleChange} />
          {formErrors.publisher && <p className="error">{formErrors.publisher}</p>}

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
