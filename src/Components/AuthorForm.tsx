import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../Styles/AuthorDetails.css";

interface AuthorCreateForm {
  firstName: string;
  lastName: string;
  biography?: string;
  nationality?: string;
  dateOfBirth?: string;
}

export default function AuthorForm() {
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
  }
  }, [navigate]);

  const [formData, setFormData] = useState<AuthorCreateForm>({
    firstName: "",
    lastName: "",
    biography: "",
    nationality: "",
    dateOfBirth: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleCreate = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://localhost:7285/api/author",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          biography: formData.biography,
          nationality: formData.nationality,
          dateOfBirth: formData.dateOfBirth || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Author created successfully!");
      navigate("/authors");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("You must be logged in.");
        navigate("/login");
      } else {
        setError(err.response?.data || "Failed to create author");
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>
      <h1 className="title">ADD AUTHOR</h1>

      <div className="editauthor-container">
        <h2>Create new author</h2>

        <div className="editauthor-form">
          <label>First name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          <label>Last name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />

          <label>Nationality:</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
          />

          <label>Date of birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />

          <label>Biography:</label>
          <textarea
            name="biography"
            value={formData.biography}
            onChange={handleChange}
          />

          {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

          <button
            className="primary-btn"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>

          <button className="back-btn" onClick={() => navigate("/authors")}>
            Cancel
          </button>
        </div>
      </div>

      <br />

      <Link to="/authors" className="back-link">
        Back to Author List
      </Link>
    </div>
  );
}
