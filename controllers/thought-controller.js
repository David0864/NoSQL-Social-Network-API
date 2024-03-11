const {
    User,
    Thought
} = require("../models");
module.exports = {
    async getAllThoughts(req, res) {
        try {
            const thoughts = await Thought.find().populate("reactions");
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getThoughtById(req, res) {
        try {
            const thought = await Thought.findOne({
                _id: req.params.thoughtId
            }).populate("thoughts").populate("reactions");
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, {
                new: true,
            });
            if (!thought) {
                res.status(404).json({
                    message: "Thought not found"
                });
            } else {
                res.json(thought);
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate({
                _id: req.params.thoughtId
            }, {
                $addToSet: {
                    reactions: req.body
                }
            }, {
                runValidators: true,
                new: true
            });
            thought ? res.json(thought) : res.status(404).json({
                message: notFound
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate({
                _id: req.params.thoughtId
            }, {
                $pull: {
                    reactions: {
                        reactionId: req.params.reactionId
                    }
                }
            }, {
                runValidators: true,
                new: true
            });

            thought ? res.json(thought) : res.status(404).json({
                message: notFound
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate({
                username: thought.username,
            }, {
                $push: {
                    thoughts: thought._id,
                },
            }, {
                new: true,
            });
            if (!user) {
                return res.status(404).json({
                    message: "No user with that username",
                });
            }
            res.json("Thought created");
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({
                _id: req.params.id
            });
            const user = await User.findOneAndUpdate({
                username: thought.username,
            }, {
                $pull: {
                    thoughts: thought._id,
                },
            }, {
                new: true,
            });
            if (!user) {
                return res.status(404).json({
                    message: "No user with that username",
                });
            }
            res.json("Thought deleted");
        } catch (error) {
            res.status(500).json(err);
        }
    },
};