const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    user: {
      type: Number,
      default: 2001,
    },
    admin: Number,
  },
  refreshToken: String,
  firstName: String,
  lastName: String,
  isEmailVerified: Boolean,
  billingAddress: {
    country: String,
    province: String,
    city: String,
    address1: String,
    address2: String,
    zipCode: String,
  },
  shippingAddress: {
    country: String,
    province: String,
    city: String,
    address1: String,
    address2: String,
    zipCode: String,
  },
});

const UserModel = mongoose.model('User', User);
module.exports = UserModel;
