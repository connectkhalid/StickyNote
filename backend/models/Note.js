const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose); // For auto-incrementing the ID field

const noteSchema = new mongoose.Schema(
      {
            user: {
                  type: mongoose.Schema.Types.ObjectId,
                  required : true,
                  ref: 'User'
                  },
            title: {
                  type: String,
                  required : true
                  },
            text: {
                  type: String,
                  required : true
                  },
            isCompleted: {
                  type: Boolean,
                  default : false
                  }
      },
      {
            timestamps: true // Automatically add createdAt and updatedAt fields managed by Mongodb
      }
)
// Add auto-increment plugin to the schema
noteSchema.plugin(autoIncrement, 
      {
            inc_field: 'ticket',
            id: 'ticketNums',
            start_seq: 500 // Starting value for the auto-incrementing field
      })

module.exports = mongoose.model('Note', noteSchema);