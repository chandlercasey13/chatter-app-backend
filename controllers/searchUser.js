const userSchema = require('../models/user')

const searchUser = async (req, res) => {
    try {
const { search } = req.body
const query = new RegExp( search, "i", "g" )
const user = await userSchema.find({
    "$or": [
        {username : query}
    ]
})
return res.json({
    message : 'All Users',
    data : user,
    success : true
})
    } catch (error) {
res.status(500).json(error);
    }
}

module.exports = searchUser;