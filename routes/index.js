var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var auth = jwt({secret: 'SECRET', userProperty: 'payload'})

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var passport = require('passport');
var Poll = mongoose.model('Poll');
var User = mongoose.model('User');

router.get('/polls', function (req, res, next) {
    Poll.find(function (err, polls) {
        if (err) { next(err) }
        
        res.json(polls);
    });
});

router.post('/polls', function (req, res, next) {
    var poll = new Poll(req.body);
    
    poll.save(function (err, poll) {
        if (err) { return next(err) }
        
        res.json(poll);
    });
});

module.exports = router;
