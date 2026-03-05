import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css"; 

const Navbar = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="nav-wrapper">
      <nav className="navbar-pill">
        
        {/* LEFT: BRANDING */}
        <div className="nav-left">
          <h3 className="nav-logo" onClick={() => navigate("/")}>
            fitnesstracker
          </h3>
        </div>

        {/* CENTER: NAV BUTTONS WITH STAR BORDER */}
        <div className="nav-center">
          <button className="star-pill-btn" onClick={() => navigate("/diet-plan")}>
            <div className="star-pill-inner">
               <i className="bi bi-apple"></i> Diet Plan
            </div>
          </button>

          <button className="star-pill-btn" onClick={() => navigate("/edit-profile")}>
            <div className="star-pill-inner">
               <i className="bi bi-person-gear"></i> Profile
            </div>
          </button>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="nav-right">
          <button className="pill-logout" onClick={logoutHandler}>
            Logout
          </button>
        </div>

      </nav>
    </div>
  );
};

export default Navbar;