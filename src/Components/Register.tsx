import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../Styles/AuthorDetails.css";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axios.post("https://localhost:7285/api/Account/register", {
        email: formData.email,
        userName: formData.username,
        displayName: formData.displayName,
        password: formData.password,
      });

      navigate("/login");
    } catch (err: any) {
      const data = err.response?.data;

      if (data?.errors) {
        const messages = Object.values(data.errors).flat().join(" ");
        setError(messages);
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="title">REGISTER</h1>

      <div className="editauthor-container">
        <h2>Create account</h2>

        <div className="editauthor-form">
          <label>Email:</label>
          <input name="email" value={formData.email} onChange={handleChange} />

          <label>Username:</label>
          <input name="username" value={formData.username} onChange={handleChange} />

          <label>Display name:</label>
          <input name="displayName" value={formData.displayName} onChange={handleChange} />

          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />

          <label>Confirm password:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />

          {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

          <button className="primary-btn" onClick={handleRegister} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <button className="back-btn" onClick={() => navigate("/login")}>
            Cancel
          </button>
        </div>
      </div>

      <br />
      <Link to="/login" className="back-link">Login</Link>
    </div>
  );
}

