import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  }

  validateInput = () => {
    if (!this.state.username) {
      message.error("Username is a required field");
      return false;
    }
    if (this.state.username.length < 6) {
      message.error("Username must be at least 6 characters");
      return false;
    }
    if (this.state.username.length > 32) {
      message.error("Username must be at most 32 characters");
      return false;
    }
    if (!this.state.password) {
      message.error("Password is a required field");
      return false;
    }
    if (this.state.password.length < 6) {
      message.error("Password must be at least 8 characters");
      return false;
    }
    if (this.state.password.length > 32) {
      message.error("Password must be at most 32 characters");
      return false;
    }
    if (this.state.password !== this.state.confirmPassword) {
      message.error("Passwords do not match");
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
        await fetch(`${config.endpoint}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: this.state.username,
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

  register = async () => {
    // if (this.validateInput()) {
    const response = await this.performAPICall();
    if (response) {
      this.setState({
        username: "",
        password: "",
        confirmPassword: "",
      });
      message.success("Registered successfully");
      this.props.history.push("/login");
    }
    // }
  };

  render() {
    return (
      <>
        {/* Display Header */}
        <Header history={this.props.history} />

        <div className="flex-container">
          <div className="register-container container">
            <h1>Make an account</h1>

            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              onChange={(e) => {
                this.setState({
                  username: e.target.value,
                });
              }}
            />
            <Input
              className="input-field"
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
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

            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm Password"
              onChange={(e) => {
                this.setState({
                  confirmPassword: e.target.value,
                });
              }}
            />

            <Button
              loading={this.state.loading}
              type="primary"
              onClick={this.register}
            >
              Register
            </Button>
          </div>
        </div>

        <Footer></Footer>
      </>
    );
  }
}

// export default Register;

export default withRouter(Register);
