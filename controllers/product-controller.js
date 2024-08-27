const { pathCreator, handleDeleteDir } = require('../helper/file-handler');
const ProductModel = require('../models/Product');

exports.handleGetProduct = async (req, res, next) => {
  // get the id of the product
  const id = req.params.id;
  // if there is no id return error 400
  if (!id) res.status(400).json({ message: 'Id Product is necessary' });
  try {
    // find the product with specified id
    const product = await ProductModel.findById(id).exec();
    // if not product found return 404 error
    if (!product) res.status(404).json({ message: 'No Product Found' });
    // if found return 200 with product data
    res.status(200).json({ message: 'Product found', data: product });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.handleAddProduct = async (req, res, next) => {
  // get the title, description
  const { title, description, skus, categories } = req.body;
  //  if not exist return error
  if (!title || !description || skus.length === 0)
    res.status(400).json({ message: 'title and description is required' });
  // get the unique file name defined on multer
  const filePath = req.file.path;

  const pathToDB = pathCreator(filePath);

  try {
    // Create the product object
    const product = {
      title,
      description,
      categories,
      skus,
      images: `${process.env.SERVER}/${pathToDB}`,
      slug: title.replace(' ', '-').toLowerCase(),
    };

    // // save it to mongo
    const savedProduct = await ProductModel.create(product);

    res.status(200).json({ message: 'Success create product', savedProduct });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.handleEditProduct = async (req, res, next) => {
  // check id
  const { id } = req.body;
  // if no id found return 400 error
  if (!id) res.status(400).json({ message: 'Product id cannot be empty' });
  try {
    // find product by id
    const product = await ProductModel.findById(id).exec();
    // if no product found reutrn error not found
    if (!product) res.status(404).json({ message: 'Product not found!' });

    // get the directory of the current image of the product
    const currentPath = product.images;
    const dir = currentPath.split('/')[4];
    // delete the  directory contain product image
    await handleDeleteDir(dir);

    // get the body props minus the id
    const body = { ...req.body };
    delete body.id;

    // get the new image path
    const filePath = req.file.path;
    // create the path to save db
    const pathToDB = pathCreator(filePath);
    // create new object with updated value
    const newProduct = {
      ...product.doc,
      ...body,
      images: pathToDB || product.images,
    };
    // update the product with new value
    const result = await ProductModel.findByIdAndUpdate(id, newProduct);
    // return the updated product
    res
      .status(200)
      .json({ message: 'Success update product', product: result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.handleDeleteProduct = async (req, res, next) => {
  // get the id
  const id = req.params.id;
  // if no id return 400 error
  if (!id) res.status(400).json({ message: 'Product id cannot be empty' });

  try {
    // find the product first
    const product = await ProductModel.findById(id).exec();
    // if no product found return 404
    if (!product)
      res.status(404).json({ message: 'Product with provided id not found' });
    // get the directory of the current image of the product
    const currentPath = product.images;
    const dir = currentPath.split('/')[4];
    // delete the  directory contain product image
    await handleDeleteDir(dir);
    // delete the product based on provided id
    await ProductModel.findByIdAndDelete(id);
    // return 204 status
    res.status(204).json({ message: 'Product has been deleted' });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
