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
        .when('/scenic/info',{
            templateUrl: "template/scenic_info.html",
            controller: "scenicInfoCtrl"
        })
        .when('/article/curd',{
            templateUrl: "template/article_curd.html",
            controller: "articleCurdCtrl"
        })
        .otherwise({ redirectTo: "/user-index" });
    }]);
    