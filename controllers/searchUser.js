const userSchema = require("../models/user");

const searchUser = async (req, res) => {
  try {
    const search = req.body;
    console.log(search.username.toLowerCase());
    const allUsers = await userSchema.find();
    const filteredUsers = allUsers.filter((user) => {
      return user.username
        .toLowerCase()
        .includes(search.username.toLowerCase());
    });
    console.log(filteredUsers);

    return res.json({
      message: "All Users",
      data: filteredUsers,
      success: true,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = searchUser;
