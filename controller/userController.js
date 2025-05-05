const user = require("../models/User");
const note = require("../models/Note");
const asyncHandler = require("express-async-handler"); // Middleware for handling async errors
const bcrypt = require("bcrypt"); // For hashing passwords
const { get } = require("mongoose");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await user.find().select("-password").lean(); // Fetch all users without password
  if (!users.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.status(200).json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, password, roles } = req.body;

  // Check if all required fields are provided
  if (
    !firstName ||
    !username ||
    !password ||
    !Array.isArray(roles) ||
    !roles.length
  ) {
    return res.status(400).json({ message: "Invalid user data" });
  }

  // Check if username already exists
  const duplicate = await user.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Hash password
  // read this for more details - https://stackoverflow.com/questions/46693430/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt
  const hashedPassword = await bcrypt.hash(password, 10); //here 10 is salt factor. which indicates - 10 rounds of hashing

  const userObject = {
    firstName,
    lastName,
    username,
    password: hashedPassword,
    roles,
  }; //Here unlike password, other fields are same as model so we don't need to mention them while creating object.

  // Create user and save to database
  const userCreated = await user.create(userObject);
  if (userCreated) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc Get user details
// @route GET /users/:id
// @access Private
const getUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Check if ID is provided
  if (!id) {
    return res.status(400).json({ message: "User ID required" });
  }

  // Fetch user details from database
  const userDetails = await user.findById(id).select("-password").lean().exec();
  if (!userDetails) {
    return res.status(400).json({ message: "User not found" });
  }
  res.status(200).json(userDetails);
});

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
      const { id, firstName, lastName, username, password, roles, isActive } =
        req.body;
      // Check if all required fields are provided
      if (
        !id ||
        !firstName ||
        !username ||
        !Array.isArray(roles) ||
        !roles.length ||
        typeof isActive !== "boolean"
      ) {
        return res.status(400).json({ message: "Invalid user data" });
      }

      // Check if username already exists
      const duplicateUsername = await user.findone({ username }).lean().exec();
      if(duplicateUsername){
            return res.status(409).json({ message: "Username already exists" });
      }

      // Hash password if provided
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user object to update
      const userObject = {
        firstName,
        lastName,
        username,
        password: hashedPassword,
        roles,
        isActive,
      };

      // Fetch user and Update user in database
      const updatedUser = await user.findByIdAndUpdate(id, userObject, {
        new: true,
      });
      if (updatedUser) {
        res.status(200).json({ message: `${updatedUser.username} updated` });
      } else {
        res.status(400).json({ message: "Invalid user data received" });
      }

});

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
      const { id } = req.body;
      // Check if ID is provided
      if (!id) {
      return res.status(400).json({ message: "User ID required" });
      }
      
      // Check if user exists
      const userToDelete = await user.findById(id).exec();
      if (!userToDelete) {
      return res.status(400).json({ message: "User not found" });
      }
      
      // Check if user has notes
      const noteToDelete = await note.findOne({ user: id }).lean().exec();
      if (noteToDelete) {
      return res.status(400).json({
            message: "User has assigned notes. Please delete them first.",
      });
      }
      
      // Delete user from database
      const result = await user.deleteOne({ _id: id });
      const reply = `Username ${result.username} with ID ${result._id} deleted`;
      res.status(200).json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  getUserDetails,
  updateUser,
  deleteUser,
};
