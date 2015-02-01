'use strict';

angular.module('myApp', [
    'ngRoute',
    'myApp.transfer',
    'myApp.transferServices'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/transfer'});
    }]);
