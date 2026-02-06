import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthCard from "../components/AuthCard";
import ToastMessage from "../components/ToastMessage";
import FullScreenLoader from "../components/FullScreenLoader";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { email, password } = formData;

  /* HANDLE INPUT CHANGE */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* LOGIN SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      // SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      setToast({
        show: true,
        message: "Login successful 🎉",
        type: "success",
      });

      // REDIRECT AFTER SHORT DELAY
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      setToast({
        show: true,
        message:
          err.response?.data?.message || "Invalid email or password",
        type: "error",
      });
      setLoading(false);
    }
  };

  /* FULL SCREEN LOADER */
  if (loading) {
    return (
      <FullScreenLoader
        title="Logging you in..."
        subtitle="Please wait a moment 🔐"
      />
    );
  }

  return (
    <>
      {/* TOAST */}
      {toast.show && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <AuthCard
        title="🏋️ Login"
        footer={
          <>
            Don’t have an account?{" "}
            <Link to="/signup" className="auth-link">
              Signup
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3 password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <button
            className="btn auth-btn w-100"
            disabled={!email || !password}
          >
            Login
          </button>
        </form>
      </AuthCard>
    </>
  );
};

export default Login;
