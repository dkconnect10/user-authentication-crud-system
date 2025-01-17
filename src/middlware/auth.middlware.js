import jwt from "jsonwebtoken";
import { ApiError } from "../utility/ApiError.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken || req.header("Authorization")?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Authentication token missing hai.");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    req.user = { id: decoded.id, role: decoded.role };
  
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid ya expired token hai."));
  }
};

const isAuthorized = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          "Aapke paas is resource ko access karne ka permission nahi hai."
        )
      );
    }
    next();
  };
};

export { isAuthenticated, isAuthorized };
