 var app = angular.module('adminApp', ['ngRoute'])
    //路由配置
    .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/index", {
        templateUrl: "template/home.html",
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
        .when('/hotel/curd',{
            templateUrl: "template/hotel_curd.html",
            controller: "hotelCurdCtrl"
        })
        .when('/performance/curd',{
            templateUrl: "template/performance_curd.html",
            controller: "performanceCurdCtrl"
        })
        .when('/canteen/curd',{
            templateUrl: "template/canteen_curd.html",
            controller: "canteenCurdCtrl"
        })
        .when('/emergency/curd',{
            templateUrl: "template/emergency_curd.html",
            controller: "emergencyCurdCtrl"
        })
        .when('/menu/curd',{
            templateUrl: "template/menu_curd.html",
            controller: "menuCurdCtrl"
        })
        .when('/role/curd',{
            templateUrl: "template/role_curd.html",
            controller: "roleCurdCtrl"
        })
        .when('/user/operation',{
            templateUrl: "template/user_operation.html",
            controller: "userOperationCurdCtrl"
        })
        .otherwise({ redirectTo: "/index" });
    }]);

    