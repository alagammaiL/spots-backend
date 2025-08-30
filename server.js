const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");

const db = process.env.MONGODBCONNECTION.replace(
  "<db_password>",
  process.env.MONGODBPASSWORD
);

mongoose
  .connect(db)
  .then(() => console.log("conneted successfully"))
  .catch((err) => console.log("error", err));
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log("listening");
});

process.on("uncaughtException", (err) => {
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  server.close(() => {
    process.exit(1);
  });
});
