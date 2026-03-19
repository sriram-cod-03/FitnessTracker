import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  // Check for the 'Bearer <token>' format in headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Uses 'supersecretkey' from your Render dashboard
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request object (excluding password)
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};

export default protect;