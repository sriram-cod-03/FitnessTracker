import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import ToastMessage from "../components/ToastMessage";
import api from "../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await api.post("/auth/signup", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    setToast({
      show: true,
      message: "Account created successfully 🎉",
      type: "success",
    });

    // go to login instead of saving token
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  } catch (err) {
    setToast({
      show: true,
      message:
        err.response?.data?.message || "Signup failed",
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <AuthCard
      title="💪 Signup"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </>
      }
    >
      {toast.show && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="form-control mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="mb-3 password-wrapper">
          <input
            className="form-control"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button className="btn auth-btn w-100" disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </button>
      </form>
    </AuthCard>
  );
};

export default Signup;
