const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    type: type,
    exp: expires,
    iat: Date.now() / 1000,
  };

  const token = jwt.sign(payload, secret);
  return token;
};

const generateAuthTokens = async (user) => {
  const expirationTime = Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;
  const accessToken = generateToken(
    user._id,
    expirationTime,
    tokenTypes.ACCESS
  );

  const result = {
    access: {
      token: accessToken,
      expires: new Date(expirationTime * 1000),
    },
  };
  return result;
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
