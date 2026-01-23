import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Author } from "../Models/Author";
import "../Styles/AuthorDetails.css";

export default function AuthorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  biography: "",
  nationality: "",
  dateOfBirth: ""
});

  useEffect(() => {
    axios
      .get<Author>(`https://localhost:7285/api/author/${id}`)
      .then((res) => {
        setAuthor(res.data);
        const parts = res.data.fullName.split(" ");

      setFormData({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        biography: res.data.biography || "",
        nationality: res.data.nationality || "",
        dateOfBirth: res.data.dateOfBirth
          ? res.data.dateOfBirth.substring(0, 10)
          : ""
      });

      })
      .catch(() => setError("Error loading author details"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this author?")) return;

    try {
      await axios.delete(`https://localhost:7285/api/author/${id}`);
      navigate("/authors");
    } catch {
      alert("Failed to delete author");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://localhost:7285/api/author/${id}`, {
  firstName: formData.firstName,
  lastName: formData.lastName,
  biography: formData.biography,
  nationality: formData.nationality,
  dateOfBirth: formData.dateOfBirth || null
});

      alert("Author updated!");
      setAuthor((prev) => ({
  ...prev!,
  fullName: `${formData.firstName} ${formData.lastName}`,
  biography: formData.biography,
  nationality: formData.nationality,
  dateOfBirth: formData.dateOfBirth
}));

      setIsEditing(false);
    } catch {
      alert("Failed to update author");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!author) return <p>Author not found</p>;

  return (
    <div>
      <h1 className="title">AUTHOR DETAILS</h1>

      {!isEditing ? (
        <>
          <div className="author-details-card">
            <h1 className="details-title">{author.fullName}</h1>

            <div className="details-grid">
              <p>
                <span>Nationality:</span> {author.nationality || "—"}
              </p>
              <p>
                <span>Date of birth:</span>{" "}
                {author.dateOfBirth
                  ? new Date(author.dateOfBirth).toLocaleDateString()
                  : "—"}
              </p>
              <p>
                <span>Biography:</span> {author.biography || "—"}
              </p>
              <p>
                <span>Books count:</span> {author.books?.length ?? 0}
              </p>
            </div>

            <div className="details-buttons">
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                Edit
              </button>

              <button className="btn-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="editauthor-container">
            <h2>Edit Author</h2>

            <div className="editauthor-form">
              <label>First name:</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />

              <label>Last name:</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />


              <label>Nationality:</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality || ""}
                onChange={handleChange}
              />

              <label>Date of birth:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={
                  formData.dateOfBirth
                    ? String(formData.dateOfBirth).substring(0, 10)
                    : ""
                }
                onChange={handleChange}
              />

              <label>Biography:</label>
              <textarea
                name="biography"
                value={formData.biography || ""}
                onChange={handleChange}
              />

              <br />

              <button className="primary-btn" onClick={handleSave}>
                Save
              </button>
              <button
                className="back-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      <br />
      <br />

      <Link to="/authors" className="back-link">
        Back to Author List
      </Link>
    </div>
  );
}
