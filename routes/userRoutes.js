const express = require("express");
const router = express.Router();
const userController = require("../controller/userController")
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createNewUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
  
router.route("/:id").get(userController.getUserDetails);// As we have multiple get methods, we need to specify the route with id to get user details.
module.exports = router;