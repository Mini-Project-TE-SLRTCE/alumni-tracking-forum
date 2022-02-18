const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../utils/schemaCleaner');
const { commentSchema } = require('./post');

/*
TODO: 
* add fields to user
- name
- mobile number
- email
- college [enum]
- 
*/

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: 3,
      unique: true,
      maxlength: 20,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      minlength: 1,
      maxlength: 100,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email address is required',
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phoneNumber: {
      type: String,
      minlength: 10,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      default: null
    },
    branch: {
      type: String,
      default: null
    },
    role: {
      type: String,
      default: null
    },
    avatar: {
      exists: {
        type: Boolean,
        default: 'false',
      },
      imageLink: {
        type: String,
        trim: true,
        default: 'null',
      },
      imageId: {
        type: String,
        trim: true,
        default: 'null',
      },
    },
    karmaPoints: {
      postKarma: {
        type: Number,
        default: 0,
      },
      commentKarma: {
        type: Number,
        default: 0,
      },
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    subscribedSubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subreddit',
      },
    ],
    totalComments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);

// replaces _id with id, convert id to string from ObjectID and deletes __v
schemaCleaner(userSchema);

module.exports = mongoose.model('User', userSchema);
