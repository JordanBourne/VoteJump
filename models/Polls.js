var mongoose = require('mongoose');

var PollSchema = new mongoose.Schema({
    question: String,
    answers: [{option: String, votes: Number}]
});

PollSchema.methods.upvote = function (vote, cb) {
    this.answers[vote].votes += 1;
    this.save(cb);
}

mongoose.model('Poll', PollSchema);