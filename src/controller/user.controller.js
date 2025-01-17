import { response } from "express";
import { User } from "../model/user.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import bcrypt from "bcrypt";

const createAccessTokenandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Something went wrong while creating tokens.");
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, profileImage } = req.body;

    if (
      [name, email, password].some((field) => !field || field.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      role: role || "user",
      profileImage: profileImage || null,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newUser, "User created successfully"));
  } catch (error) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Something went wrong while creating the user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if ([email, password, role].some((field) => !field?.trim())) {
      throw new ApiError(400, "Email, Password, and role are required.");
    }

    const validUserTypes = ["admin", "user"];
    if (!validUserTypes.includes(role)) {
      throw new ApiError(400, "Invalid user type provided.");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(401, "Invalid credentials.");
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new ApiError(401, "Invalid credentials.");
    }

    if (user.role !== role) {
      throw new ApiError(401, "Unauthorized user role.");
    }

    const { refreshToken, accessToken } =
      await createAccessTokenandRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    user.password = undefined;
    user.refreshToken = undefined;

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .cookie("role", role, options) // Adding the role to the cookie
      .json(
        new ApiResponse(
          200,
          { user, refreshToken, accessToken, role },
          "User logged in successfully."
        )
      );
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 500;
    res.status(status).json({
      success: false,
      message:
        error.message || "Something went wrong while logging in the user.",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(501, "User ID not received.");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options)
      .json({ message: "User logged out successfully." });
  } catch (error) {
    console.log(error);
    throw new ApiError(501, error.message, "Something went wrong while logging out the user.");
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, profileImage } = req.body;

    if (!name && !profileImage) {
      throw new ApiError(404, "name and profileImage filds are required");
    }
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "user id not recived");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name,
        profileImage: profileImage,
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new ApiError(
        501,
        "somthing went worng while updating User Profile"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(201, updatedUser, "user update successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      501,
      error.message,
      "somthing went wrong while updateUser Profile"
    );
  }
};

const getUser = async (req, res) => {
  const { id } = req.user;

  if (!id) {
    throw new ApiError(400, "User ID is not available.");
  }

  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User found successfully."));
};

import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

 const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json(new ApiError(400, "Email is required"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  const otp = crypto.randomBytes(3).toString('hex'); // Generate OTP

  const otpExpiresAt = new Date();
  otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10); // OTP expiry time is 10 minutes from now

  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json(new ApiError(500, "Failed to send OTP email"));
    }

    return res.status(200).json(new ApiResponse(200, null, "OTP sent to your email"));
  });
};

 const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json(new ApiError(400, "Email and OTP are required"));
  }

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp) {
    return res.status(400).json(new ApiError(400, "Invalid OTP"));
  }

  const currentTime = new Date();

  if (currentTime > user.otpExpiresAt) {
    return res.status(400).json(new ApiError(400, "OTP has expired"));
  }

  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  return res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));
};

const resetPassword = [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').matches(/\d/).withMessage('Password must contain a number').matches(/[A-Z]/).withMessage('Password must contain an uppercase letter').matches(/[a-z]/).withMessage('Password must contain a lowercase letter'),

  async (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
  }
];




export { createUser, loginUser, updateProfile,logoutUser, getUser,forgotPassword,verifyOtp,resetPassword};
