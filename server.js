/*express is the framework to develop web and mobile application. Supports Middlewire, routing, template engine, REST API support, DB integration, Error Handling*/
const express = require("express"); 
const app = express(); /* instantiates Express and assigns app variable to it. */

const path = require("path");
const PORT = process.env.PORT || 8080;
const { logger } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser")
const cors = require("cors"); // Cross-Origin Resource Sharing
const corsOptions = require("./config/corsOption");

app.use(logger); // Custom middleware for logging requests
app.use(express.json()); // for parsing application/json (Middleware)(built-in middleware)
app.use(cookieParser()); // for parsing cookies (Middleware)(3rd party middleware)
app.use(cors(corsOptions)); // Enable CORS for pre-defined routes (Middleware)(3rd party middleware)

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
