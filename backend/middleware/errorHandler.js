const { request } = require("express");
const { logEvents } = require("./logger");

// const errorHandler = (err, req, res, next) => {
//   logEvents(
//     `${err.name}: ${err.message} \t ${req.method} \t ${req.url} \t ${req.haders.origin}`,
//     "errLog.log"
//   );
//   console.log(err.stack);
//   const status = res.statusCode ? res.statusCode : 500; // Internal server error

//   res.status(err.status || 500).json({
//     message: err.message || "Internal Server Error",
//     origin: req.headers?.origin || "Unknown origin", // Add a fallback
//   });
// };
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  console.log("Request Headers:", req.headers); // Debugging headers

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    origin: req.headers?.origin || "Unknown origin",
  });
};

module.exports = { errorHandler };
