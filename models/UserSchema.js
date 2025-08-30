const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is mandatory"],
  },
  email: {
    type: String,
    required: [true, "email is mandatory"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is mandatory"],
    minlength: [6, "passsword minimum length to be 6"],
  },
  image: {
    type: String,
    required: [true, "image is mandatory"],
  },
  place: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "PlaceModel",
    },
  ],
});
// userSchema.pre(/^find/, function (next) {
//   this.populate({});
//   next();
// });
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.bcrypthashMethod = async function (loginPassword) {
  return await bcrypt.compare(loginPassword, this.password);
};
const userModal = mongoose.model("userModal", userSchema);
module.exports = userModal;
