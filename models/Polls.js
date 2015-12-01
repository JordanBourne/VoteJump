var mongoose = require('mongoose');

var PollSchema = new mongoose.Schema({
    title: String,
    author: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
});

PollSchema.methods.upvote = function (cb) {
    this.upvotes += 1;
    this.save(cb);
};

PollSchema.methods.downvote = function (cb) {
    this.upvotes -= 1;
    this.save(cb);
};

mongoose.model('Poll', PollSchema);