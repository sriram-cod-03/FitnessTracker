import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-bg border-top border-secondary pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row gy-4">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <h4 className="flat-cyan fw-bold mb-3">fitnesstracker</h4>
            <p className="text-white small opacity-75">
              Your ultimate companion for tracking nutrition, hitting goals, and
              staying disciplined. Built for those who crave progress.
            </p>
            {/* Social Icons Section in Footer.jsx */}
            {/* Updated Social Icons Section in Footer.jsx */}
            <div className="d-flex gap-4 mt-3">
              <a href="your-instagram-link" className="social-icon">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="your-github-link" className="social-icon">
                <i className="bi bi-github"></i>
              </a>
              <a href="your-linkedin-link" className="social-icon">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="your-x-link" className="social-icon">
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 ms-auto">
            <h6 className="text-white fw-bold mb-3">Explore</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/dashboard"
                  className="text-white text-decoration-none hover-cyan small"
                >
                  Dashboard
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/diet-plan"
                  className="text-white text-decoration-none hover-cyan small"
                >
                  Diet Plan
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/profile"
                  className="text-white text-decoration-none hover-cyan small"
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white text-decoration-none hover-cyan small"
                >
                  Help Center
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white text-decoration-none hover-cyan small"
                >
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-white text-decoration-none hover-cyan small"
                >
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="text-center mt-5 pt-3 border-top border-dark">
          <p className="text-white small">
            &copy; {new Date().getFullYear()}{" "}
            <span className="flat-cyan fw-bold">Sriram R</span>. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
