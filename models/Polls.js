var mongoose = require('mongoose');

var PollSchema = new mongoose.Schema({
    question: String,
    author: String,
    answers: [{option: String, votes: {type: Number, default: 0}}]
});

PollSchema.methods.upvote = function (vote, cb) {
    this.answers[vote].votes += 1;
    this.save(cb);
}

mongoose.model('Poll', PollSchema);