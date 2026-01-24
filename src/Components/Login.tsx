import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../Styles/AuthorDetails.css";

interface LoginFormData {
  email: string;
  password: string;
}

interface JwtPayload {
  unique_name?: string;
  role?: string | string[];
}

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://localhost:7285/api/Account/login",
        formData
      );

      const token = response.data.token;
      const decoded = jwtDecode<JwtPayload>(token);

      const roleClaim = decoded.role;
      const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
      const role = roles.includes("Admin") ? "Admin" : "User";

      localStorage.setItem("token", token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", role);

      window.location.href = "/";
    } catch {
      setError("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="title">LOGIN</h1>

      <div className="editauthor-container">
        <h2>Sign in</h2>

        <div className="editauthor-form">
          <label>Email:</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

          <button
            className="primary-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button className="back-btn" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </div>

      <br />
      <Link to="/register" className="back-link">
        Register
      </Link>
    </div>
  );
}



