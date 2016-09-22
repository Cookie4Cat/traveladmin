//常量
app.constant('baseUrl', 'http://113.55.17.17:8088/v1/');
app.constant('pageSize', 2);

app.controller('userIndexCtrl', function ($scope) {
    $scope.test = '俺是测试，希望通过';
});

//投诉审核控制器
app.controller('comVerifyCtrl', function ($scope, $http, baseUrl, Pager, pageSize) {


    init();

    function init() {
        initTabs();
        getTypes();
        getHandingComplaints(1);
    }

    //初始化页卡
    function initTabs() {
        $scope.tabIndex = 0;
        $scope.changeTab = function (tabIndex) {
            $scope.tabIndex = tabIndex;
        };
    }

    //获取投诉类型
    function getTypes() {
        $http.get(baseUrl + 'com/traveller/complaints/types')
            .success(function (resp) {
                $scope.typeMap = {};
                for(i in resp){
                    $scope.typeMap[resp[i]['typeId']] = resp[i]['typeName'];
                }
            });
    }

    //获取待审核的投诉
    function getHandingComplaints(page) {
        $http.get(baseUrl + 'com/admin/complaints' + Pager.pageParams(page,pageSize))
            .success(function (resp) {
                $scope.handlingComList = resp['complaints'];
            }).error(function (resp) {
                alert('数据加载失败');
            })
    }
});
