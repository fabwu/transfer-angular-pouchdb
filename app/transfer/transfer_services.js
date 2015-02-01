var transferServices = angular.module('myApp.transferServices', []);

transferServices.factory('myPouch', function () {
    var db = new PouchDB('ng-pouch');
    PouchDB.replicate('ng-pouch', 'http://127.0.0.1:5984/ng-db', {continuous: true});
    PouchDB.replicate('http://127.0.0.1:5984/ng-db', 'ng-pouch', {continuous: true});
    return db;
});

transferServices.factory('pouchWrapper', ['$q', '$rootScope', 'myPouch', function ($q, $rootScope, myPouch) {

    return {
        add: function (transfer) {
            var deferred = $q.defer();
            myPouch.post(transfer, function (err, res) {
                $rootScope.$apply(function () {
                    if (err) {
                        deferred.reject(err)
                    } else {
                        deferred.resolve(res)
                    }
                });
            });
            return deferred.promise;
        },
        remove: function (id) {
            var deferred = $q.defer();
            myPouch.get(id, function (err, doc) {
                $rootScope.$apply(function () {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        myPouch.remove(doc, function (err, res) {
                            $rootScope.$apply(function () {
                                if (err) {
                                    deferred.reject(err)
                                } else {
                                    deferred.resolve(res)
                                }
                            });
                        });
                    }
                });
            });
            return deferred.promise;
        }
    }
}]);

transferServices.factory('listener', ['$rootScope', 'myPouch', function ($rootScope, myPouch) {

    myPouch.changes({
        continuous: true,
        onChange: function (change) {
            if (!change.deleted) {
                $rootScope.$apply(function () {
                    myPouch.get(change.id, function (err, doc) {
                        $rootScope.$apply(function () {
                            if (err) console.log(err);
                            $rootScope.$broadcast('newTodo', doc);
                        })
                    });
                })
            } else {
                $rootScope.$apply(function () {
                    $rootScope.$broadcast('delTodo', change.id);
                });
            }
        }
    })
}]);