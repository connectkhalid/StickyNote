const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
      {
            firstName: {
                  type: String,
                  required : true
                  },
            lastName: {
                  type: String,
                  required : false
                  },
            username: {
                  type: String,
                  required : true
                  },
            password: {
                  type: String,
                  required : true
                  },
            roles: [{
                  type: String,
                  default : "Employee",
                  }],
            isActive: {
                  type: Boolean,
                  default : true
                  }
      }
)

module.exports = mongoose.model('User', userSchema);