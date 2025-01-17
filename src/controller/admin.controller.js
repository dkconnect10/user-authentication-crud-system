import { ApiError } from '../utility/ApiError.js';
import { ApiResponse } from '../utility/ApiResponse.js';
import {User} from '../model/user.model.js'
import bcrypt from 'bcrypt'

const deleteUserById = async (req, res) => {
  const { id } = req.params; 

  try {

    const user = await User.findByIdAndUpdate(
      id, 
      { deletedAt: Date.now() }, 
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "User soft-deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Error in deleting user." });
  }
};


const resetUserPassword = async (req, res) => {
  console.log("Request Body:", req.body); // Debugging line

  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      throw new ApiError(400, "New password is required");
    }

    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password updated successfully"));
  } catch (error) {
    console.error(error);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
};


export {deleteUserById,resetUserPassword}