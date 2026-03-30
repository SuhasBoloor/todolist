const userService = require("../service/user.service");

// REGISTER
const register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const result = await userService.loginUser(req.body);

    res.status(200).json({
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    res.status(401).json({
      error: err.message,
    });
  }
};

module.exports = {
  register,
  login,
};