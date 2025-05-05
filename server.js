require("dotenv").config(); // Load environment variables from .env file
/*express is the framework to develop web and mobile application. Supports Middlewire, routing, template engine, REST API support, DB integration, Error Handling*/
const express = require("express");
const app =
  express(); /* instantiates Express and assigns app variable to it. */

const path = require("path");
const PORT = process.env.PORT || 8080;
const { logger } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // Cross-Origin Resource Sharing
const corsOptions = require("./config/corsOption");
//For database connection
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnection");
connectDB();// Connect to MongoDB
console.log("Environment Variable DATABASE_URI:", process.env.DATABASE_URI);

const logEvent = require("./middleware/logger");

app.use(logger); // Custom middleware for logging requests
app.use(express.json()); // for parsing application/json (Middleware)(built-in middleware)
app.use(cookieParser()); // for parsing cookies (Middleware)(3rd party middleware)
app.use(cors(corsOptions)); // Enable CORS for pre-defined routes (Middleware)(3rd party middleware)

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/users", require("./routes/userRoutes"));

// app.all("*", (req, res) => {
//   res.status(404);
//   if (req.accepts("html")) {
//     res.sendFile(path.join(__dirname, "views", "404.html"));
//   } else if (req.accepts("json")) {
//     res.json({ message: "404 Not Found" });
//   } else {
//     res.type("txt").send("404 Not Found");
//   }
// });
app.use(errorHandler); // Custom error handler middleware

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
mongoose.connection.on("error", (err) => {
  console.error(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
