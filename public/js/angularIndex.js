var app = angular.module('display', ['ui.router']);
    
app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html'
            })
        
            .state('polls', {
                url: '/polls',
                templateUrl: '/polls.html',
                controller: 'PollListCtrl',
                resolve: {
                    postPromise: ['polls', function (polls) {
                        return polls.getAll();
                    }]
                }
            })
        
            .state('thePoll', {
                url: '/polls/{id}',
                templateUrl: '/thePoll.html',
                controller: 'thePollCtrl',
                resolve: {
                    poll: ['$stateParams', 'polls', function ($stateParams, polls) {
                        return polls.get($stateParams.id);
                    }]
                }
            })
        
            .state('pollResults', {
                url: '/polls/{id}/results',
                templateUrl: '/results.html',
                controller: 'resultsCtrl',
                resolve: {
                    poll: ['$stateParams', 'polls', function ($stateParams, polls) {
                        return polls.get($stateParams.id);
                    }]
                }
            })
        
            .state('newpoll', {
                url: '/newpoll',
                templateUrl: '/newpoll.html',
                controller: 'NewPollCtrl'
            })
        
            .state('login', {
                url: '/login',
                templateUrl: '/login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
            
        
            .state('register', {
                url: '/register',
                templateUrl: '/register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'auth', function($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }]
            })
        
        $urlRouterProvider.otherwise('home');
    }
]);

app.factory('auth', ['$http', '$window', function($http, $window) {
    var auth = {};
    
    auth.saveToken = function(token) {
        $window.localStorage['vote-token'] = token;
    };
    
    auth.getToken = function() {
        return $window.localStorage['vote-token'];
    };
    
    auth.isLoggedIn = function() {
        var token = auth.getToken();
        
        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };
    
    auth.currentUser = function() {
        if (auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            
            return payload.username;
        }
    };
    
    auth.register = function(user) {
        return $http.post('/register', user).success(function(data) {
            auth.saveToken(data.token);
        });
    };
    
    auth.logIn = function(user) {
        return $http.post('/login', user).success(function(data) {
            auth.saveToken(data.token);
        });
    };
    
    auth.logOut = function() {
            console.log("logout");
        $window.localStorage.removeItem('vote-token');
    };
    
    return auth;
}])

app.factory('polls', ['$http', function ($http) {
    var o = {
        polls: []
    };
    
    
    o.getAll = function () {
        return $http.get('/polls').success(function (data) {
            angular.copy(data, o.polls);
        });
    };
    
    o.create = function (poll) {
        return $http.post('/polls', poll).success(function (data) {
            o.polls.push(data);
            
            window.location.href = "#/polls/" + data._id;
        });
    };
    
    o.get = function (id) {
        return $http.get('/polls/' + id).then(function (res) {
            return res.data;
        });
    };
    
    o.voteFor = function(post, val) {
        return $http.put('/polls/' + post._id + '/' + val).success(function(data){
            post.answers[val].votes += 1;
        });
    };
    
    return o;
}]);

app.controller('NewPollCtrl', [
    '$scope',
    'polls',
    function ($scope, polls) {
        $scope.polls = polls.polls;
        
        $scope.addPoll = function () {
            if (!$scope.question || $scope.question === '') {
                $scope.error = "You didn't ask a question!";
                return;
            }
            if (!$scope.ans1 || !$scope.ans2 || $scope.ans1 === '' || $scope.ans2 === '') {
                $scope.error = 'One or more answers are blank.';
                return;
            }
            
            polls.create({
                question: $scope.question,
                answers: [
                    {option: $scope.ans1, votes: 0},
                    {option: $scope.ans2, votes: 0}
            ]});
                
            $scope.error = '';
        };
    }
]);

app.controller('PollListCtrl', [
    '$scope',
    'polls',
    function ($scope, polls) {
        $scope.polls = polls.polls;
    }
]);

app.controller('thePollCtrl', [
    '$scope',
    'polls',
    'poll',
    function ($scope, polls, poll) {
        $scope.poll = poll;
        $scope.answers = poll.answers;
        
        $scope.vote = function() {
            var val = $scope.radioValue;
            
            polls.voteFor(poll, val);
            
            window.location.href = "#/polls/" + poll._id + "/results";
        }
    }
]);

app.controller('resultsCtrl', [
    '$scope',
    'polls',
    'poll',
    function ($scope, polls, poll) {
        $scope.poll = poll;
        $scope.answers = poll.answers;
    }
]);

app.controller('AuthCtrl', [
    '$scope',
    '$state',
    'auth',
    function($scope, $state, auth){
        $scope.user = {};

        $scope.register = function(){
            auth.register($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('home');
            });
        };

        $scope.logIn = function(){
            auth.logIn($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('home');
            });
        };
}])

app.controller('NavCtrl', [
    '$scope',
    'auth',
    function($scope, auth){
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
    }
]);