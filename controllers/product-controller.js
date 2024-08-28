const {
  pathCreator,
  handleDeleteFile,
  formatToServerDir,
} = require('../helper/file-handler');
const ProductModel = require('../models/Product');

exports.handleGetProduct = async (req, res, next) => {
  // get the id of the product
  const id = req.params.id;
  // if there is no id return error 400
  if (!id) res.status(400).json({ message: 'Id Product is necessary' });
  try {
    // find the product first
    const product = await ProductModel.findById(id).exec();
    // if no product found return 404
    if (!product)
      res.status(404).json({ message: 'Product with provided id not found' });
    // if found return 200 with product data
    else res.status(200).json({ message: 'Product found', data: product });
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
  const thumbnail = req.files.thumbnail[0];
  const images = req.files.images;

  const thumbnailPath = `${process.env.SERVER}/${pathCreator(thumbnail.path)}`;
  const imagesPath = images.map(
    (image) => `${process.env.SERVER}/${pathCreator(image.path)}`
  );

  try {
    // Create the product object
    const product = {
      title,
      description,
      categories: categories.map((cat) => cat.toLowerCase()),
      skus,
      thumbnail: thumbnailPath,
      images: [...imagesPath],
      slug: title.replaceAll(' ', '-').toLowerCase(),
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
  let newImagesPath, newThumbnailPath;
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
    if (req.files.thumbnail) {
      const currentPath = product.thumbnail;
      const dir = formatToServerDir(currentPath);
      // delete the  directory contain product image
      await handleDeleteFile(dir);

      // get the new image path
      const thumbnail = req.files.thumbnail[0];
      // create the path to save db
      newThumbnailPath = `${process.env.SERVER}/${pathCreator(thumbnail.path)}`;
    }

    if (req.files.images) {
      const imagesPath = product.images;
      const dirs = imagesPath.map((image) => formatToServerDir(image));
      // delete the  directory contain product image
      dirs.forEach(async (dir) => await handleDeleteFile(dir));
      // get the new image path
      const images = req.files.images;
      // create the path to save db
      newImagesPath = images?.map(
        (image) => `${process.env.SERVER}/${pathCreator(image.path)}`
      );
    }

    // get the body props minus the id
    const body = { ...req.body };
    delete body.id;
    const { categories } = body;
    const mappedCategories = categories.map((cat) => cat.toLowerCase());

    // create new object with updated value
    const newProduct = {
      ...product.doc,
      ...body,
      categories: mappedCategories || product.categories,
      thumbnail: newThumbnailPath || product.thumbnail,
      images: newImagesPath || product.images,
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
    const dir = formatToServerDir(currentPath);
    // delete the  directory contain product image
    await handleDeleteFile(dir);
    // delete the product based on provided id
    await ProductModel.findByIdAndDelete(id);
    // return 204 status
    res.status(204).json({ message: 'Product has been deleted' });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.handleGetProducts = async (req, res, next) => {
  let DEFAULT_LIMIT = 10;
  let DEFAULT_PAGE = 1;
  // get the page, limit, and search
  const { limit, page, search } = req.body;

  if (!limit || !page)
    res.status(400).json({ message: 'Please provide limit and page value' });

  try {
    // find products with limit, page, and search
    let pageToPass = parseInt(page) || DEFAULT_PAGE;
    let limitToPass = parseInt(limit) || DEFAULT_LIMIT;

    const result = await ProductModel.find({
      $or: [{ title: search }, { categories: { $in: [search] } }],
    })
      .skip((pageToPass - 1) * limitToPass)
      .limit(limitToPass);
    // count all document with the filter
    const count = await ProductModel.where({
      $or: [{ title: search }, { categories: { $in: [search] } }],
    }).countDocuments();

    // return the products data
    res.status(200).json({
      message: 'Success Find Data!',
      data: result,
      page: pageToPass,
      pages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// test git
