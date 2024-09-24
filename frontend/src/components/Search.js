import { Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { config } from "../App";

import Cart from "./Cart";

import Header from "./Header";
import Product from "./Product";
import { Row, Col } from "antd";
import Footer from "./Footer";
import "./Search.css";

class Search extends React.Component {
  constructor() {
    super();

    this.cartRef = React.createRef();

    this.debounceTimeout = 0;
    this.products = [];
    this.state = {
      loading: false,
      loggedIn: false,
      filteredProducts: [],
    };
  }

  validateResponse = (errored, response) => {
    if (errored || (!response.length && !response.message)) {
      message.error(
        "Could not fetch products. Check that the backend is running, reachable and returns valid JSON."
      );
      return false;
    }

    if (!response.length) {
      message.error(response.message || "No products found in database");
      return false;
    }

    return true;
  };

  performAPICall = async () => {
    let response = {};
    let errored = false;

    this.setState({
      loading: true,
    });

    try {
      response = await (await fetch(`${config.endpoint}/products`)).json();
    } catch (e) {
      errored = true;
    }

    this.setState({
      loading: false,
    });

    if (this.validateResponse(errored, response)) {
      return response;
    }
  };

  debounceSearch = (event) => {
    const value = event.target.value;

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      this.search(value);
    }, 300);
  };

  search = (text) => {
    this.setState({
      filteredProducts: this.products.filter(
        (product) =>
          product.name.toUpperCase().includes(text.toUpperCase()) ||
          product.category.toUpperCase().includes(text.toUpperCase())
      ),
    });
  };

  getProducts = async () => {
    const response = await this.performAPICall();

    if (response) {
      this.products = response;
      this.setState({
        filteredProducts: this.products.slice(),
      });
    }
  };

  componentDidMount() {
    this.getProducts();

    if (localStorage.getItem("email") && localStorage.getItem("token")) {
      this.setState({
        loggedIn: true,
      });
    }
  }

  getProductElement = (product) => {
    return (
      <Col xs={24} sm={12} xl={6} key={product._id}>
        <Product
          product={product}
          addToCart={() => {
            if (this.state.loggedIn) {
              this.cartRef.current.postToCart(product._id, 1, true);
            } else {
              this.props.history.push("/login");
            }
          }}
        />
      </Col>
    );
  };

  render() {
    return (
      <>
        {/* Display Header with Search bar */}
        <Header history={this.props.history}>
          <Input.Search
            placeholder="Search"
            onSearch={this.search}
            onChange={this.debounceSearch}
            enterButton={true}
          />
        </Header>

        {/* Use Antd Row/Col components to display products and cart as columns in the same row*/}
        <Row>
          {/* Display products */}
          <Col
            xs={{ span: 24 }}
            md={{ span: this.state.loggedIn && this.products.length ? 18 : 24 }}
          >
            <div className="search-container ">
              {/* Display each product item wrapped in a Col component */}
              <Row>
                {this.products.length !== 0 ? (
                  this.state.filteredProducts.map((product) =>
                    this.getProductElement(product)
                  )
                ) : this.state.loading ? (
                  <div className="loading-text">Loading products...</div>
                ) : (
                  <div className="loading-text">No products to list</div>
                )}
              </Row>
            </div>
          </Col>

          {/* Display cart */}

          {this.state.loggedIn && this.products.length && (
            <Col xs={{ span: 24 }} md={{ span: 6 }} className="search-cart">
              <div>
                <Cart
                  ref={this.cartRef}
                  products={this.products}
                  history={this.props.history}
                  token={localStorage.getItem("token")}
                />
              </div>
            </Col>
          )}
        </Row>

        {/* Display the footer */}
        <Footer></Footer>
      </>
    );
  }
}

export default withRouter(Search);
