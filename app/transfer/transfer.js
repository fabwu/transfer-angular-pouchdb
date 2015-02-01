'use strict';

angular.module('myApp.transfer', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/transfer', {
            templateUrl: 'transfer/transfer.html',
            controller: 'TransferCtrl'
        });
    }])

    .controller('TransferCtrl', ['$scope', 'listener', 'pouchWrapper', function ($scope, listener, pouchWrapper) {

        $scope.submit = function (transfer) {
            pouchWrapper.add(transfer).then(function (res) {
                $scope.transfer = null;
            }, function (reason) {
                console.log(reason);
            })
        };

        $scope.remove = function (id) {
            pouchWrapper.remove(id).then(function (res) {
            }, function (reason) {
                console.log(reason);
            })
        };

        $scope.transfers = [];

        $scope.$on('newTodo', function (event, transfer) {
            $scope.transfers.push(transfer);
        });

        $scope.$on('delTodo', function (event, id) {
            for (var i = 0; i < $scope.transfers.length; i++) {
                if ($scope.transfers[i]._id === id) {
                    $scope.transfers.splice(i, 1);
                }
            }
        });
    }]);