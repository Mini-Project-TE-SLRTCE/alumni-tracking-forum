const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Post = require('../models/post');
const { cloudinary, UPLOAD_PRESET } = require('../utils/config');
const paginateResults = require('../utils/paginateResults');
const googleHandler = require('../scrapper/google-it');

const getUser = async (req, res) => {
  const { username } = req.params;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const user = await User.findOne({
    username: { $regex: new RegExp('^' + username + '$', 'i') },
  });

  if (!user) {
    return res
      .status(404)
      .send({ message: `Username '${username}' does not exist on server.` });
  }

  const postsCount = await Post.find({ author: user.id }).countDocuments();
  const paginated = paginateResults(page, limit, postsCount);
  const userPosts = await Post.find({ author: user.id })
    .sort({ createdAt: -1 })
    .select('-comments')
    .limit(limit)
    .skip(paginated.startIndex)
    .populate('author', 'username')
    .populate('subreddit', 'subredditName');

  const paginatedPosts = {
    previous: paginated.results.previous,
    results: userPosts,
    next: paginated.results.next,
  };

  res.status(200).json({ userDetails: user, posts: paginatedPosts });
};

const updateUser = async (req, res) => {
  const {
    id,
    username,
    name,
    email,
    phoneNumber,
    linkedinUsername,
    role,
    branch,
    batch,
    password
  } = req.body.details;

  let detailsToUpdate;

  if (password === '') {
    detailsToUpdate = { username, name, email, phoneNumber, linkedinUsername, role, branch, batch };
  }
  else {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    detailsToUpdate = { username, name, email, phoneNumber, linkedinUsername, role, branch, batch, passwordHash };
  }

  const user = await User.update({ _id: id }, { $set: detailsToUpdate });

  // user = {
  //   "n": 0 or 1,
  //   "nModified": 0 or 1,
  //   "ok": 0 or 1
  // }

  if (user.nModified === 0) {
    return res.status(400).send({ message: 'User details are not updated.' });
  }
  else {
    return res.status(200).json({
      username: user.username,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      linkedinUsername: user.linkedinUsername,
      role: user.role,
      branch: user.branch,
      batch: user.batch,
    });
  }
};

const setUserAvatar = async (req, res) => {
  const { avatarImage } = req.body;

  if (!avatarImage) {
    return res
      .status(400)
      .send({ message: 'Image URL needed for setting avatar.' });
  }

  const user = await User.findById(req.user);

  if (!user) {
    return res
      .status(404)
      .send({ message: 'User does not exist in database.' });
  }

  const uploadedImage = await cloudinary.uploader.upload(
    avatarImage,
    {
      upload_preset: UPLOAD_PRESET,
    },
    (error) => {
      if (error) return res.status(401).send({ message: error.message });
    }
  );

  user.avatar = {
    exists: true,
    imageLink: uploadedImage.url,
    imageId: uploadedImage.public_id,
  };

  const savedUser = await user.save();
  res.status(201).json({ avatar: savedUser.avatar });
};

const removeUserAvatar = async (req, res) => {
  const user = await User.findById(req.user);

  if (!user) {
    return res
      .status(404)
      .send({ message: 'User does not exist in database.' });
  }

  user.avatar = {
    exists: false,
    imageLink: 'null',
    imageId: 'null',
  };

  await user.save();
  res.status(204).end();
};

const getSearchedUsers = async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const query = req.query.query;

  console.log(req.query);

  const findQuery = {
    name: {
      $regex: query,
      $options: 'i'
    }
  };

  const usersCount = await User.find(findQuery).countDocuments();
  const paginated = paginateResults(page, limit, usersCount);
  const searchedUsers = await User.find(findQuery)
    .sort({ hotAlgo: -1 })
    .select('-comments')
    .limit(limit)
    .skip(paginated.startIndex)

  const googleResults = await googleHandler(query);

  const registeredLinkedinUsernames = [];

  searchedUsers.map(data => {
    console.log(data.linkedinUsername);
    registeredLinkedinUsernames.push(data.linkedinUsername);
  });

  let modifiedGoogleResults = googleResults;

  googleResults.map(data => {
    let googleLinkedinUrl = data.link;
    let googleLinkedinUsername = googleLinkedinUrl.slice(googleLinkedinUrl.lastIndexOf('/') + 1);

    if (registeredLinkedinUsernames.includes(googleLinkedinUsername)) {
      modifiedGoogleResults = modifiedGoogleResults.filter(obj => obj.link !== googleLinkedinUrl);
    }
  });

  // temporary Google results
  // modifiedGoogleResults = [
  //   {
  //     title: 'Laukik Paradhan - Engineer - Naik Environmental Engineers Pvt Ltd',
  //     link: 'https://in.linkedin.com/in/laukik-paradhan-05491035',
  //     snippet: 'Project Lead at GDSC SLRTCE, General Secretary & AI and Mechatronics Head at SLRTCE, Machine Learning ... Deepanshu Y. Member of Codeyantra Team at SLRTCE.'
  //   },
  //   {
  //     title: 'Sachin Yadav - Mumbai, Maharashtra, India | Professional Profile',
  //     link: 'https://in.linkedin.com/in/sachin-yadav-29339736',
  //     snippet: 'Project Lead at GDSC SLRTCE, General Secretary & AI and Mechatronics Head at SLRTCE, Machine Learning Intern, 3⭐ star on Codechef.'
  //   },
  //   {
  //     title: 'Laura West - Real Estate Investor - West Corporation | LinkedIn',
  //     link: 'https://www.linkedin.com/in/laura-west-85b213140',
  //     snippet: 'Assistant Professor at SLRTCE,MUMBAI. Mumbai · Tanmay Toraskar ... Deepanshu Vangani. SDE intern @Amazon. Mumbai · Shantanu Godbole.'
  //   }
  // ];

  const paginatedUsers = {
    previous: paginated.results.previous,
    userResults: searchedUsers,
    googleResults: modifiedGoogleResults,
    next: paginated.results.next,
  };

  res.status(200).json(paginatedUsers);
};

module.exports = {
  getUser,
  updateUser,
  setUserAvatar,
  removeUserAvatar,
  getSearchedUsers
};
