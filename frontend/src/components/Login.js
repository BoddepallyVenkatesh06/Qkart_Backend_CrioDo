import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      email: "",
      password: "",
    };
  }

  validateInput = () => {
    if (!this.state.email) {
      message.error("Email is a required field");
      return false;
    }
    if (!this.state.password) {
      message.error("Password is a required field");
      return false;
    }
    return true;
  };

  validateResponse = (errored, response) => {
    if (errored || (!response.tokens && !response.message)) {
      message.error(
        "Something went wrong. Check that the backend is running, reachable and returns valid JSON."
      );
      return false;
    }
    if (!response.tokens) {
      message.error(response.message);
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
      response = await (
        await fetch(`${config.endpoint}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
          }),
        })
      ).json();
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

  persistLogin = (token, email, balance, name, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("balance", balance);
    localStorage.setItem("username", name);
    localStorage.setItem("userId", userId);
  };

  login = async () => {
    // if (this.validateInput()) {
    const response = await this.performAPICall();
    if (response) {
      this.persistLogin(
        response.tokens.access.token,
        response.user.email,
        response.user.walletMoney,
        response.user.name,
        response.user._id
      );
      this.setState({
        email: "",
        password: "",
      });
      message.success("Logged in successfully");
      this.props.history.push("/products");
    }
  };

  render() {
    return (
      <>
        <Header history={this.props.history} />

        <div className="flex-container">
          <div className="login-container container">
            <h1>Login to QKart</h1>

            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="email"
              onChange={(e) => {
                this.setState({
                  email: e.target.value,
                });
              }}
            />

            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              onChange={(e) => {
                this.setState({
                  password: e.target.value,
                });
              }}
            />

            <Button
              loading={this.state.loading}
              type="primary"
              onClick={this.login}
            >
              Login
            </Button>
          </div>
        </div>

        <Footer></Footer>
      </>
    );
  }
}

// export default Login;

export default withRouter(Login);
