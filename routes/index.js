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

router.param('poll', function(req, res, next, id) {
  var query = Poll.findById(id);

  query.exec(function (err, poll){
    if (err) { return next(err); }
    if (!poll) { return next(new Error('can\'t find poll')); }

    req.poll = poll;
    return next();
  });
});

router.get('/polls/:poll', function(req, res) {
    res.json(req.poll);
});

//router.put('/polls/:poll/' + val, )

module.exports = router;
