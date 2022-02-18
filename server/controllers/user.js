const User = require('../models/user');
const Post = require('../models/post');
const { cloudinary, UPLOAD_PRESET } = require('../utils/config');
const paginateResults = require('../utils/paginateResults');

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
  const user = await User.updateOne({ username: req.body.username }, { $set: req.body });

  // user = {
  //   "n": 0 or 1,
  //   "nModified": 0 or 1,
  //   "ok": 0 or 1
  // }

  if (user.nModified === 0) {
    return res.status(401).send({ message: 'User details are not updated.' });
  }
  else {
    return res.status(200).json(user);
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

module.exports = { getUser, updateUser, setUserAvatar, removeUserAvatar };
