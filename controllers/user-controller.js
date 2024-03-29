const { User, Thought } = require('../models');
module.exports = {
    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getUserById(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.id }).populate("thoughts").populate("friends");
            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
              }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
               return res.status(404).json({ message: "No user with that ID"});
            }

            res.json("User deleted");
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, 
                { $set: req.body },
                { runValidators: true, new: true },
                );
                if (!user) {
                    return res.status(404).json("User not found");
                }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async addFriend(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.userId, 
                { $push: {friends: req.params.friendId} },
                { runValidators: true, new: true },
                );
                if (!user) {
                    return res.status(404).json("User not found");
                }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async removeFriend(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.userId, 
                { $pull: {friends: req.params.friendId} },
                { runValidators: true, new: true },
                );
                if (!user) {
                    return res.status(404).json("User not found");
                }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    }



};
