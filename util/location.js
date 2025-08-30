const axios = require("axios");
const AppError = require("../Apperror");
const API_KEY = "AIzaSyAlkVTtRfGD1otL67UYAWAbHHf0HMMCEbI";
async function getCoordinateesFromAddress(address) {
  // return {
  //   lat: 40.7484405,
  //   lng: -73.9882393,
  // };
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  // console.log(response);
  const data = response.data;
  if (!data || data.status === "ZERO_RESULTS") {
    throw new Error("Cannot found latitude and longitude for given location");
    // return next(
    //   new AppError(
    //     "Cannot found latitude and longitude for given location",
    //     404
    //   )
    // );
  }
  const coordinates = data.results[0].geometry.location;
  return coordinates;
}
module.exports = getCoordinateesFromAddress;
