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
                    poll: ['$stateParams', 'polls', function($stateParams, polls) {
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
                templateUrl: '/login.html'
            })
        
        
            .state('register', {
                url: '/register',
                templateUrl: '/register.html'
            });
        
        $urlRouterProvider.otherwise('home');
    }
]);

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
        });
    };
    
    o.get = function(id) {
        return $http.get('/polls/' + id).then(function (res) {
            poll = res.data;
            console.log(res.data);
            return poll;
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
                    $scope.ans1,
                    $scope.ans2]
            });
            $scope.question = '';
            $scope.ans1 = '';
            $scope.ans2 = '';
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
    '$stateParams',
    'polls',
    'post',
    function ($scope, $stateParams, polls, post) {
    }
]);