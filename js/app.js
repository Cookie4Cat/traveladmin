 var app = angular.module('adminApp', ['ngRoute'])
    //路由配置
    .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/user-index", {
        templateUrl: "template/test.html",
        controller: "userIndexCtrl"
    })
        .otherwise({ redirectTo: "/user-index" });
    }]);
    