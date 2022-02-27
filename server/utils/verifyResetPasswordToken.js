const User = require("../models/user");

const verifyResetPasswordToken = async (token) => {
  // checking whether token exist or not
  const resetPasswordToken = await User.findOne({ resetPasswordToken: token });

  if (!resetPasswordToken) {
    return 'token not found';
  }

  const tokenExpiryTime = resetPasswordToken.resetPasswordTokenExpiryTime;

  // validating expiry time
  // token will be expired when current time is greater than or equal to <token generation time> + <10 minutes>
  if (Date.now() >= tokenExpiryTime + 60000) {
    return "token expired";
  }

  return "valid token";
}

module.exports = verifyResetPasswordToken;
