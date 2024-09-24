
const httpStatus = require("http-status");
const { Cart, Product, User } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");
const productService = require("../services/product.service");

const getCartByUser = async (user) => {
  const cart = await Cart.findOne({ email: user.email });

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }

  return cart;
};

const addProductToCart = async (user, productId, quantity) => {
  let userCart = await Cart.findOne({ email: user.email });
  if (!userCart) {
    try {
      userCart = await Cart.create({
        email: user.email,
        cartItems: [],
      });
      await userCart.save();
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong while creating cart"
      );
    }
  }
  if (!userCart.cartItems.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bad Request");
  }
  const exist = userCart.cartItems.some((item) =>
    item.product._id.equals(productId)
  );
  if (exist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product already in cart");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist in DB");
  }
  userCart.cartItems.push({
    product: product,
    quantity: quantity,
  });
  userCart.save();
  return await userCart;
};

const updateProductInCart = async (user, productId, quantity) => {
  try {
    const cart = await Cart.findOne({ email: user.email });

    if (!cart) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "User does not have a cart. Use POST to create cart and add a product"
      );
    }

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Product doesn't exist in database"
      );
    }

    const productIndex = cart.cartItems.findIndex(
      (item) => item.product._id == productId
    );

    if (productIndex === -1) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
    }

    cart.cartItems[productIndex].quantity = quantity;
    await cart.save();

    return cart;
  } catch (error) {
    throw error;
  }
};

const deleteProductFromCart = async (user, productId) => {
  try {
    const cart = await Cart.findOne({ email: user.email });

    if (!cart) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart");
    }

    const productIndex = cart.cartItems.findIndex(
      (item) => item.product._id == productId
    );

    if (productIndex === -1) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
    }

    cart.cartItems.splice(productIndex, 1);

    await cart.save();
  } catch (error) {
    throw error;
  }
};

const checkout = async (user) => {
  // since we are already using catchAsyc in the checkout Controller function, hence no need to  use try/catch here
  // try {
    const cart = await Cart.findOne({ email: user.email });
    if (cart === null) {
      throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
    }
    if (cart.cartItems.length === 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Cart does not have any products"
      );
    }
    const hasSetNonDefaultAddress = await user.hasSetNonDefaultAddress();
    if (!hasSetNonDefaultAddress) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Address is not set");
    }
    const total = cart.cartItems.reduce((acc, item) => {
      acc = acc + item.product.cost * item.quantity;
      return acc;
    }, 0);

    if (total > user.walletMoney) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User does not have sufficient balance");
    }
    user.walletMoney -= total;
    await user.save();
    cart.cartItems = [];
    await cart.save();
  // } catch (error) {
  //   throw error;
  // }
};

module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout,
};
