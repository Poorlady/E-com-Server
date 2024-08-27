const mongoose = require('mongoose');
const { Schema } = mongoose;

const Product = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
    },
    skus: [
      {
        sku: {
          type: String,
          required: true,
        },
        feature: { type: Array },
        price: {
          type: String,
          required: true,
        },
      },
    ],
    images: {
      type: String,
    },
    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model('Product', Product);
module.exports = ProductModel;
