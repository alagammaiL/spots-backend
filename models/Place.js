const mongoose = require("mongoose");
const PlaceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is mandatory"],
  },
  description: {
    type: String,
    required: [true, "description is mandatory"],
  },
  imageUrl: {
    type: String,
    required: [true, "image is mandatory"],
  },
  address: {
    type: String,
    required: [true, "Address is mandatory"],
  },
  location: {
    lat: {
      type: Number,
      required: [true, "Latitude is mandatory"],
    },
    lng: {
      type: Number,
      required: [true, "Longitude is mandatory"],
    },
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "userModal",
  },
});
PlaceSchema.pre(/^find/, function (next) {
  this.populate("creator");
  next();
});
const PlaceModel = mongoose.model("PlaceModel", PlaceSchema);
module.exports = PlaceModel;
