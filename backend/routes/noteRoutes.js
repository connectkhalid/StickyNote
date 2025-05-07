const express = require("express");
const router = express.Router();

const noteController = require("../controller/noteController");
const { isValidId } = require("../middleware/idValidator");

router
  .route("/")
  .get(noteController.getAllNotes)
  .post(noteController.createNewNote);
router
  .route("/:id")
  .get(isValidId, noteController.getNoteDetails)
  .put(isValidId, noteController.updateNote)
  .delete(isValidId, noteController.deleteNote);

module.exports = router;
