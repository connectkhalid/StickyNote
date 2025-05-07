const mongoose = require("mongoose");

const isValidId = (req, res, next) =>{
      const { id } = req.params;
      if(!id){
            return res.status(400).json({message: `Id is required`});
      }
      if(!mongoose.isValidObjectId(id))
            return res.status(400).json({ message: `Id is not valid!`});
      next();
}

module.exports = {isValidId};