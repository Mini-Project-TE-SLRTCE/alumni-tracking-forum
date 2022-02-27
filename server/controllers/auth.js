const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const verifyResetPasswordToken = require('../utils/verifyResetPasswordToken');
const { SECRET } = require('../utils/config');

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    username: { $regex: new RegExp('^' + username + '$', 'i') },
  });

  if (!user) {
    return res
      .status(400)
      .send({ message: 'No account with this username has been registered.' });
  }

  const credentialsValid = await bcrypt.compare(password, user.passwordHash);

  if (!credentialsValid) {
    return res.status(401).send({ message: 'Invalid username or password.' });
  }

  const payloadForToken = {
    id: user._id,
  };

  const token = jwt.sign(payloadForToken, SECRET);

  res.status(200).json({
    token,
    username: user.username,
    id: user._id,
    avatar: user.avatar,
    karma: user.karmaPoints.postKarma + user.karmaPoints.commentKarma,
  });
};

const signupUser = async (req, res) => {
  const { username, password, name, email, phoneNumber } = req.body;

  if (!password || password.length < 6) {
    return res
      .status(400)
      .send({ message: 'Password needs to be atleast 6 characters long.' });
  }

  if (!username || username.length > 20 || username.length < 3) {
    return res
      .status(400)
      .send({ message: 'Username character length must be in range of 3-20.' });
  }

  const existingUser = await User.findOne({
    username: { $regex: new RegExp('^' + username + '$', 'i') },
  });

  if (existingUser) {
    return res.status(400).send({
      message: `Username '${username}' is already taken. Choose another one.`,
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
    name,
    email,
    phoneNumber
  });

  const savedUser = await user.save();

  const payloadForToken = {
    id: savedUser._id,
  };

  const token = jwt.sign(payloadForToken, SECRET);

  res.status(200).json({
    token,
    username: savedUser.username,
    id: savedUser._id,
    avatar: savedUser.avatar,
    karma: 0,
  });
};

const forgotPwd = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .send({ message: 'No account with this email address has been registered.' });
  }

  let token;

  while (true) {
    // use 'crypto' package here
    token = crypto.randomBytes(20).toString("hex");

    // checking whether token already existing or not
    const isTokenAlreadyExist = await User.findOne({ resetPasswordToken: token });

    // if token is not existing,
    // i.e. if token is unique
    // then break the loop
    if (isTokenAlreadyExist === null || isTokenAlreadyExist === undefined) {
      break;
    }
  }

  // generating expiry time for token
  // expiry time of a token = <current time> + <10 minutes>
  const tokenExpiryTime = Date.now() + 600000;

  // saving generated token and its expiry time into database
  const tokenSaveRes = await User.updateOne({ email }, {
    $set: {
      resetPasswordToken: token,
      resetPasswordTokenExpiryTime: tokenExpiryTime
    }
  });

  if (!tokenSaveRes) {
    return res
      .status(400)
      .send({ message: 'Oops! An error occurred.' });
  }

  // if token and its expiry time successfully saved into database,
  // then sending reset password link via email to the user
  // body of email
  const emailText = "You are receiving this email because you (or someone else) has been requested to change your password of Alumni Tracking System.\n\n" +
    "Below is the link provided to reset your password. And the link is valid only for 10 minutes.\n" +
    `http://localhost:3000/reset-password/${token}\n\n` +
    "If you are not requested for this link, simply ignore this email. The will link automatically expire after 10 minutes.";

  // sending email
  const sendEmailRes = await sendEmail({
    emailTo: email,
    emailSubject: "Password Reset - Alumni Tracking System",
    emailText
  });

  if (sendEmailRes.status === 200) {
    return res
      .status(200)
      .send(sendEmailRes.msg);
  } else {
    return res
      .status(400)
      .send({ message: 'Oops! An error occurred while sending email.' });
  }
};

const resetPwd = async (req, res) => {
  const { token, password } = req.body;

  // verifying token
  const tokenStatus = await verifyResetPasswordToken(token);

  if (tokenStatus === 'token not found') {
    return res
      .status(400)
      .send({ message: 'Token is not valid.' });
  }

  if (tokenStatus === 'token expired') {
    await User.updateOne({ resetPasswordToken: token }, {
      $set: {
        resetPasswordToken: "",
        resetPasswordTokenExpiryTime: 0
      }
    });

    return res
      .status(400)
      .send({ message: 'Token has been expired.' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const passwordUpdate = await User.updateOne({ resetPasswordToken: token }, {
    $set: {
      passwordHash,
      resetPasswordToken: "",
      resetPasswordTokenExpiryTime: 0
    }
  });

  if (!passwordUpdate) {
    return res
      .status(400)
      .send({ message: 'Oops! An error occurred while updating password.' });
  }

  return res.status(200).send({ message: 'Password updated.' });
};

module.exports = { loginUser, signupUser, forgotPwd, resetPwd };
