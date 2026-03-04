import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (

    <nav className="navbar-dark">

      {/* LEFT SIDE */}
      <h3 className="nav-title">
        Fitness Tracker
      </h3>


      {/* RIGHT SIDE BUTTONS */}
      <div className="nav-right">

        <button
          className="motion-btn diet-btn"
          onClick={() => navigate("/diet-plan")}
        >
          🥗 Diet Plan
        </button>

        <button
          className="motion-btn edit-btn"
          onClick={() => navigate("/edit-profile")}
        >
          ✏️ Edit Profile
        </button>

        <button
          className="logout-btn"
          onClick={logoutHandler}
        >
          Logout
        </button>

      </div>

    </nav>

  );

};

export default Navbar;