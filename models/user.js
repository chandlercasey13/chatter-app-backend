const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    profilePicture: { type: String },
    //   fullName: { type: String, required: true },
    
  //   chatlog: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
   },
  { timestamps: true } //created at, updated at
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});

module.exports = mongoose.model("User", userSchema);
