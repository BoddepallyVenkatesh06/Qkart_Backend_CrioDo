const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService, tokenService } = require("../services");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const getUser = catchAsync(async (req, res) => {
  // const { userId } = req.params;
  // const { q } = req.query;
  // // let user = await userService.getUserById(userId);
  // let user = await userService.getUserAddressById(userId);

  // if (userId != req.user._id) {
  //   throw new ApiError(httpStatus.FORBIDDEN, "User not Authenticated to see other user's data");
  // }

  // if (q) {
  //   user = await userService.getUserAddressById(userId, q);
  //   // return res.status(httpStatus.OK).send(user);
  //   return res.status(httpStatus.OK).json({
  //     address: user.address,
  //   });
  // }
  // return res.status(httpStatus.OK).send(user);
  const { userId } = req.params;
  const { q } = req.query;
  let userData;
  if (q === "address") {
    userData = await userService.getUserAddressById(userId);
  } else {
    userData = await userService.getUserById(userId);
  }
  const reqToken = req.headers.authorization.split(" ")[1];
  const decode = jwt.verify(reqToken, config.jwt.secret);
  if (decode.sub !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "User not authorized");
  }
  if (userData) {
    if (q === "address") {
      res.status(httpStatus.OK).json({ address: userData.address });
    } else {
      
      res.status(httpStatus.OK).json(userData);
    }
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
});

const setAddress = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.email != req.user.email) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "User not authorized to access this resource"
    );
  }

  const address = await userService.setAddress(user, req.body.address);

  res.send({
    address: address,
  });
});

module.exports = {
  getUser,
  setAddress,
};
