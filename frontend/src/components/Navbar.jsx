import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css"; 

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      // ✅ Navigates to a dedicated search page
      navigate(`/search?query=${searchQuery}`);
      setSearchQuery(""); // Clears input after search
    }
  };

  return (
    <div className="nav-wrapper">
      <nav className="navbar-pill">
        
        {/* LEFT: BRANDING & SEARCH */}
        <div className="nav-left">
          <h3 className="nav-logo" onClick={() => navigate("/")}>
            fitnesstracker
          </h3>

          {/* ✅ SEARCH FIELD INTEGRATION */}
          <div className="nav-search-container">
            <i className="bi bi-search search-icon"></i>
            <input 
              type="text" 
              className="nav-search-input" 
              placeholder="Search global foods..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        {/* CENTER: NAV BUTTONS (Absolute Centered) */}
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