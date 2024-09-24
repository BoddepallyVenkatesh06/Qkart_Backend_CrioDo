const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { cartService } = require("../services");

const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCartByUser(req.user);
  res.send(cart);
});

const addProductToCart = catchAsync(async (req, res) => {
  const cart = await cartService.addProductToCart(
    req.user,
    req.body.productId,
    req.body.quantity
  );

  res.status(httpStatus.CREATED).send(cart);
});

const updateProductInCart = catchAsync(async (req, res) => {
  // try {
  //   const { productId, quantity } = req.body;
  //   if (quantity === 0) {
  //     await cartService.deleteProductFromCart(req.user, productId);
  //     return res.status(httpStatus.NO_CONTENT).send();
  //   }
  //   const cart = await cartService.updateProductInCart(req.user, productId, quantity);
  //   res.status(httpStatus.OK).send(cart);
  // } catch (error) {
  //   console.error("Error updating product in cart:", error);
  //   res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Internal Server Error" });
  // }
  const { productId, quantity } = req.body;
  if (quantity === 0) {
    await cartService.deleteProductFromCart(req.user, productId);
    return res.status(httpStatus.NO_CONTENT).send();
  }
  const cart = await cartService.updateProductInCart(
    req.user,
    productId,
    quantity
  );
  res.status(httpStatus.OK).send(cart);
});


 const checkout = catchAsync(async (req, res) => {
  await cartService.checkout(req.user);
 return res.status(httpStatus.NO_CONTENT).send()
});
module.exports = {
  getCart,
  addProductToCart,
  updateProductInCart,
  checkout,
};
