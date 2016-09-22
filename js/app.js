 var app = angular.module('adminApp', ['ngRoute'])
    //路由配置
    .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/user-index", {
        templateUrl: "template/test.html",
        controller: "userIndexCtrl"
        })
        .when('/com/verify', {
            templateUrl: "template/com_verify.html",
            controller: "comVerifyCtrl"
        })
        .when('/com/process', {
            templateUrl: "template/com_process.html",
            controller: "comProcessCtrl"
        })
        .otherwise({ redirectTo: "/user-index" });
    }]);
    