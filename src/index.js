const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");

let server;

mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    console.log("Connection with mongoDB established");
    app.listen(config.port, () =>
      console.log("App started at PORT", config.port)
    );
  })
  .catch((error) => {
    console.log("Connection with mongoDB failed");
  });
