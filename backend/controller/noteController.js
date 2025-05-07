const note = require("../models/Note");
const user = require("../models/User");
const asyncHandler = require("express-async-handler");
//express-async-handler catch error form async functions and pass tehm to express's error handling middleware.
const mongoose = require("mongoose");

//@desc Get All Notes
//@route /notes GET
//@access private
const getAllNotes = asyncHandler(async (req, res) => {
  const noteList = await note.find().lean();
  if (!noteList?.length) return res.json("No Notes are available.");
  res.status(200).json(noteList);
});

//@desc Create Note
//@route /notes POST
//@access private
const createNewNote = asyncHandler(async (req, res) => {
  const { userId, title, text } = req.body;

  // Validate request data
  if (!userId || !title || !text) {
    return res.status(400).json("Invalid data");
  }
  // Validate userId format
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid userId format" });
  }

  // Check whether user is present or not
  const targetUser = await user.findById(userId).lean();
  if (!targetUser) {
    return res.status(404).json(`No user found having userid ${userId}`);
  }

  // Create note object and save to DB
  const noteObj = {
    user: targetUser._id, // Use the user's ID
    title,
    text,
  };
  const createdNote = await note.create(noteObj);

  if (createdNote) {
    res
      .status(201)
      .json({ message: `Note created with note id ${createdNote._id}` });
  } else {
    res.status(400).json({ message: "Invalid note data received" });
  }
});

//@desc Get Note Details
//@route /notes GET
//@access private
const getNoteDetails = asyncHandler(async (req, res) => {
      const { id } = req.params;
      if(!id || id<500 ) {
            res.json("Invalid note data");
      }
      //Check if note exiests
      const targetNote = await note.findById(id).lean();
      if(!targetNote){
            return res.status(400).json(`No note found with given id: ${id}`);
      }
      res.status(200).json(targetNote);
});

//@desc Update Note
//@route /notes PATCH
//@access private
const updateNote = asyncHandler(async (req, res) => {
  const { userId, title, text, isCompleted } = req.body;
  const { id } = req.params;

  //Null check
  if (
    !userId ||
    !title ||
    !text ||
    !isCompleted ||
    typeof isCompleted != "boolean"
  ) {
    return res.status(400).json("Invalid note data.");
  }

  //Check user present with given userId
  const targetUser = await user.findById(userId).lean();
  if (!targetUser) {
    return res.status(404).json(`No user found having userid ${userId}`);
  }

  //Check and update if note present
  const noteObject = {
      id,
      user: targetUser,
      title,
      text,
      isCompleted
  };

  const updatedNote = await note.findByIdAndUpdate(id, noteObject).lean();
  if(updatedNote){
      res.status(200).json({message: `Note data with noteId ${id} updated.`});
  }else {
      res.status(400).json({message: `Invalid note data received.`});
  }
});

//@desc Delete Note
//@route /notes DELETE
//@access private
const deleteNote = asyncHandler(async (req, res) => {
      const { id } = req.params;
      if(!id || id<500)
            return res.status(400).json({message: `Invalid note id`});

      const deletedNote = await note.findByIdAndDelete(id).lean();
      if(deletedNote)
            res.status(200).json({message: `Note with id ${id} is deleted`});
      else res.status(400).json({message: `Note not found.`});
});

module.exports = {
  getAllNotes,
  createNewNote,
  getNoteDetails,
  updateNote,
  deleteNote,
};
