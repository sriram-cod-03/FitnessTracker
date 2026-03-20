import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
      setQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-secondary sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold text-info" to="/dashboard">
          fitnesstracker
        </Link>

        {/* 1. THE BUTTON: Check data-bs-target */}
        <button 
          className="navbar-toggler shadow-none border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#fitnessNavbar" // 👈 MUST MATCH ID BELOW
          aria-controls="fitnessNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 2. THE MENU: Check the ID */}
        <div className="collapse navbar-collapse" id="fitnessNavbar"> 
          
          {/* Search bar inside the menu for mobile */}
          <form className="d-flex mx-auto my-3 my-lg-0 col-12 col-lg-5" onSubmit={handleSearch}>
            <input
              className="form-control bg-dark border-secondary text-white rounded-pill px-4"
              type="search"
              placeholder="Search food..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link text-white mx-lg-2" to="/diet-plan">Diet Plan</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white mx-lg-2" to="/profile">Profile</Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-danger btn-sm rounded-pill ms-lg-3 mt-3 mt-lg-0 px-4" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;