import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/config.js";
import UserModel from "../Model/UserModel.js";

export const authMiddle = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }

    // Verify JWT token
    jwt.verify(token, JWT_SECRET, async (err, decode) => {
      if (err) {
        console.log("JWT verification error:", err);
        return res.status(401).send({
          success: false,
          message: "Unauthorized User",
        });
      }

      // Find user by decoded token ID
      const user = await UserModel.findById(decode.id);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }

      // Attach user information to request object
      req.userId = user._id;
      req.isAdmin = user.isAdmin;

      next(); // Proceed to the next middleware or controller
    });
  } catch (error) {
    console.error("Authentication Middleware Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in Authentication Middleware",
      error,
    });
  }
};

// Admin middleware to check if the user is an admin
export const adminMiddleware = (req, res, next) => {
  try {
    if (!req.isAdmin) {
      return res.status(401).send({
        success: false,
        message: "Only Admin Access",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Unauthorized Access",
      error,
    });
  }
};
