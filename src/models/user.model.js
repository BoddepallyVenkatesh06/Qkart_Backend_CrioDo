const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const config = require("../config/config");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase:true,
      validate(value)
      {
        if(!validator.isEmail(value))
        {
          throw new Error("Invalid Email")
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minength:8,
    }, 
    password: {
      type: String,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    walletMoney: {
      type: Number,
      required: true,
      default:config.default_wallet_money
    },
    address: {
      type: String,
      default: config.default_address,
    },
  },
  // Create createdAt and updatedAt fields automatically
  {
    timestamps: true,
  }
);

userSchema.statics.isEmailTaken = async function (email) {
  const result = await this.findOne({ email: email });
  // console.log(result);   
  return result;
};


userSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};


userSchema.methods.hasSetNonDefaultAddress = async function () {
  const user = this;
  //  return user.address === config.default_address;
   return user.address !== config.default_address;
};

 const User=mongoose.model("user",userSchema);  
 module.exports ={User}
