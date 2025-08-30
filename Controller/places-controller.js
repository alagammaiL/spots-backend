const AppError = require("../Apperror");
const catchasync = require("../catchasync");
const getCoordinateesFromAddress = require("../util/location");
const PlaceModel = require("../models/Place");
const fs = require("fs");
const path = require("path");
const UserModal = require("../models/UserSchema");

// const { v4: uuidv4 } = require("uuid");
// const getCoordinateesFromAddress = require("../util/location");
// let dummy_places = [
//   {
//     id: "p1",
//     title: "Empire state building",
//     description: "One of the most famous sky scraper in the world",
//     imageUrl:
//       "https://media.architecturaldigest.com/photos/66b397865c4b67e0f3a7d9ac/16:9/w_1920,c_limit/GettyImages-584714362.jpg",
//     address: "20 W 34th St., New York, NY 10001, United States",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9882393,
//     },
//     creator: "u1",
//   },

exports.createPlace = catchasync(async (req, res, next) => {
  let coordinates;
  // const hardcodedUserId = "68a84d6f13f72073bf036361";
  console.log(req.body.address);
  try {
    coordinates = await getCoordinateesFromAddress(req.body.address);
    console.log(coordinates);
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 404));
  }
  req.body.location = coordinates;
  req.body.imageUrl = `/images/places/${req.file.filename}`;

  const place = await PlaceModel.create(req.body);

  await UserModal.findByIdAndUpdate(req.body.creator, {
    $push: { place: place._id },
  });
  await res.status(201).json({
    status: "success",
    data: {
      place,
    },
  });
});
exports.getPlaceById = catchasync(async (req, res, next) => {
  const place = await PlaceModel.findById(req.params.pid);
  if (!place) {
    return next(new AppError("Invalid id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      place,
    },
  });
});
exports.getplacebyUserId = catchasync(async (req, res, next) => {
  const user = req.params.uid;

  const place = await PlaceModel.find({ creator: user });
  if (!place || place.length === 0) {
    return next(new AppError("Could not find places for given userId", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      place,
    },
  });
});
exports.updatePlace = catchasync(async (req, res, next) => {
  const place = await PlaceModel.findByIdAndUpdate(req.params.pid, req.body, {
    new: true,
    runValidators: true,
  });
  if (!place) {
    return next(new AppError("Invalid id", 404));
  }
  if (place.creator.toString() !== req.userdata.id) {
    return next(new AppError("you are not allowed to update", 403));
  }
  res.status(200).json({
    status: "success",
    data: {
      place,
    },
  });
});
exports.deletePlace = catchasync(async (req, res, next) => {
  console.log("hello");
  // const hardcodedUserId = "68a84d6f13f72073bf036361";
  const place = await PlaceModel.findById(req.params.pid);
  console.log("place", place);
  // const user =
  console.log(path.join(__dirname, "..", place.imageUrl));
  const imagePath = path.join(__dirname, "..", place.imageUrl);
  await UserModal.findByIdAndUpdate(place.creator, {
    $pull: { place: req.params.pid },
  });

  if (imagePath) {
    fs.unlink(imagePath, (err) => {
      if (err) console.log("Failed to delete image:", err.message);
    });
  }

  if (place.creator._id.toString() !== req.userdata.id) {
    return next(new AppError("you are not allowed to delete", 403));
  }
  await PlaceModel.findByIdAndDelete(req.params.pid);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
