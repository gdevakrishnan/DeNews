const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  uname: {
    type: String,
    required: true,
    trim: true
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },
  validatedArticles: {
    type: [Schema.Types.ObjectId],
    ref: 'Article',
    default: []
  },
  spammedArticles: {
    type: [Schema.Types.ObjectId],
    ref: 'Article',
    default: []
  },
  dntStake: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
