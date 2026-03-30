const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepo = require("../repository/user.repo");

// REGISTER
const registerUser = async (data) => {
  const { name, email, password } = data;

  // check if user exists
  const existingUser = await userRepo.findEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await userRepo.createUser({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

// LOGIN
const loginUser = async (data) => {
  const { email, password } = data;

  // check user
  const user = await userRepo.findEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // generate token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
};