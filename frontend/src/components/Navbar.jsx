import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // 🔐 SAFE localStorage access
  const token = localStorage.getItem("token");

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h3>Fitness Tracker</h3>
      <button className="logout-btn" onClick={logoutHandler}>
        Logout
      </button>
      
    </nav>
  );
};

export default Navbar;
