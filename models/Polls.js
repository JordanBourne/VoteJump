var mongoose = require('mongoose');

var PollSchema = new mongoose.Schema({
    question: String,
    answers: [String]
});

mongoose.model('Poll', PollSchema);