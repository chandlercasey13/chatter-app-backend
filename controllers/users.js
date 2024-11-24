const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const util = require('util');

const unlinkFile= util.promisify(fs.unlink)


const SALT_LENGTH = 12;


const multer = require('multer')

const storage = multer.memoryStorage();
const upload = multer({ dest: "uploads/" });



const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY


const { uploadFile, getFileStream } = require('../s3')









router.post("/signup", async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.json({ error: "Username already taken." });
    }
    const user = await User.create({
      username: req.body.username,
      hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH),
      // fullName: req.body.fullName
    });
    const token = jwt.sign(
      { username: user.username, _id: user._id },
      process.env.JWT_SECRET
    );
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
   
    if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
      const token = jwt.sign(
        { username: user.username, _id: user._id },
        process.env.JWT_SECRET
      );

      
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Invalid username or password." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  
});



router.get('/:userId/images', async (req, res) => {
 

  const user = await User.findById(req.params.userId);


  res.set("Access-Control-Allow-Origin", "http://localhost:5173");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (!user || !user.profilePicture) {
    return res.status(404).json({ error: "Profile picture not found" });
  }


 const readStream = getFileStream(user.profilePicture);

  readStream.pipe(res)
})


router.put("/:userId", upload.single('image'), async (req, res) => {
  try {
    const file = req.file
    console.log(file)

    
    
    

    // await chatlog.save();
    
    const result = await uploadFile(file)
 

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { profilePicture: result.Key }, // Assuming 'profilePicture' is the field
      { new: true } // Return the updated user document
    );


    await unlinkFile(file.path)
   
    const description = req.body.description
    
     res.send({imagePath: `${result.Key}`})
  } catch (error) {

    console.log(error);
  }
});




module.exports = router;
