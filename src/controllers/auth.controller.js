const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../services");
const { token } = require("morgan");

const register = catchAsync(async (req, res) => {
  const {name, email, password} = req.body;
  const user = await userService.createUser({
    name,
    email,
    password
  });
  // console.log(user);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({
    user,
    tokens
  });

  // const user = await userService.createUser(req.body);
  // const tokens = await tokenService.generateAuthTokens(user);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body
  // console.log("hellllooo");
  const user = await authService.loginUserWithEmailAndPassword(email, password)
  // console.log("hellllooo",token,user);
  const tokens = await tokenService.generateAuthTokens(user)
  // console.log("hellllooo",token,user);
  res.status(200).json({user,tokens});
});

module.exports = {
  register,
  login,
};
