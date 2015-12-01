var app = angular.module('display', ['ui.router']);
    
app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: './home.html'
            })
        
            .state('polls', {
                url: '/polls',
                templateUrl: './polls.html',
                controller: 'PollListCtrl'
            })
        
            .state('newpoll', {
                url: '/newpoll',
                templateUrl: './newpoll.html',
                controller: 'NewPollCtrl'
            })
        
            .state('login', {
                url: '/login',
                templateUrl: './login.html'
            })
        
        
            .state('register', {
                url: '/register',
                templateUrl: './register.html'
            });
        
        $urlRouterProvider.otherwise('home');
    }
]);

app.factory('polls', [function () {
    var o = {
        polls: []
    };
    
    o.create = function (poll) {
        o.polls.push(poll);
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
            if (!$scope.ans1 || !$scope.ans2 || $scope.ans1 == '' || $scope.ans2 == '') {
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
        $scope.polls = [
            'poll 1',
            'poll 2',
            'poll 3'
        ];
    }
]);