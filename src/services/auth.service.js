const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email)
  if(!user || !(await user.isPasswordMatch(password)))
  {
    throw new ApiError(httpStatus.UNAUTHORIZED,"Incorrect Credentials")
  }
  // return {_id:user._id,walletMoney:parseInt(user.walletMoney),name:user.name,email:user.email,password:user.password,address:user.address};
  return user

};

module.exports = {
  loginUserWithEmailAndPassword,
};
