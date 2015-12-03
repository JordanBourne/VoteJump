var mongoose = require('mongoose');

var PollSchema = new mongoose.Schema({
    question: String,
    answers: [{option: String, votes: Number}]
});

mongoose.model('Poll', PollSchema);