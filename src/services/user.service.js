const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

const getUserById = async (id) => {
  // return User.findById(id);
  const response = await User.findOne({ _id: id });
  return response;
};

const getUserByEmail = async (email) => {
  // return User.findOne({ email });
  const response = await User.findOne({ email });
  return response;
};

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.OK, "Email already taken");
  }
  // const usersPassword = await bcrypt.hash(userBody.Password, 10);
  const hashedPassword = await bcrypt.hash(userBody.password, 10);
  const user = await User.create({ ...userBody, password: hashedPassword });
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    walletMoney: parseInt(user.walletMoney),
  };
  // return user;
};

const getUserAddressById = async (id) => {
    const user = await User.findOne({ _id: id }, { email: 1, address: 1 });
    return user;
};


const setAddress = async (user, newAddress) => {
  user.address = newAddress;
  await user.save();

  return user.address;
};

module.exports = {
  getUserAddressById,
  setAddress,
  getUserById,
  getUserByEmail,
  createUser,
};
