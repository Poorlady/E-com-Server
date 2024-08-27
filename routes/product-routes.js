const express = require('express');
const upload = require('../middleware/upload');
const {
  handleAddProduct,
  handleEditProduct,
  handleGetProduct,
  handleDeleteProduct,
  handleGetProducts,
} = require('../controllers/product-controller');
const handleDirname = require('../middleware/fileName');
const router = express.Router();

router.post(
  '/product/add',
  handleDirname,
  upload.single('photos'),
  handleAddProduct
);

router.post('/product/get-products', upload.none(), handleGetProducts);

router.route('/product/:id').get(handleGetProduct).delete(handleDeleteProduct);

router.put(
  '/product/edit',
  handleDirname,
  upload.single('photos'),
  handleEditProduct
);

module.exports = router;
