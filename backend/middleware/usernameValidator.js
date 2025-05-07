/*The middleware will validate the email format using a regular expression and send an error response if the email is invalid. If the email is valid, it will simply call next() to proceed to the next middleware or route handler.
*/

const validateUsername = (req, res, next) =>{
  const { username } = req.body;

  //Check if username is provided(null check)
  if (!username) {
    return res.status(400).json({
      message: `username can not be null.`,
    });
  }
  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(username)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  next(); // Proceed to the next middleware or route handler
};

module.exports = validateUsername;