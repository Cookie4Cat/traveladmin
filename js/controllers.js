//常量
app.constant('baseUrl', 'http://localhost:8088/v1/');
app.constant('pageSize', 2);
app.constant('baseImgUrl','http://localhost:8088/');

app.controller('userIndexCtrl', function ($scope) {
    $scope.test = '俺是测试，希望通过';
});

//投诉审核控制器
app.controller('comVerifyCtrl', function ($scope, $http, baseUrl, baseImgUrl,Pager, pageSize) {

    init();

    //初始化
    function init() {
        initTabs();
        getTypes();
        getHandlingComplaints(1);
        $scope.baseImgUrl = baseImgUrl;
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
    function getHandlingComplaints(page) {
        $http.get(baseUrl + 'com/admin/complaints' + Pager.pageParams(page,pageSize))
            .success(function (resp) {
                $scope.handlingComList = resp['complaints'];
            }).error(function (resp) {
                alert('数据加载失败');
            })
    }

    //查看待审核投诉
    $scope.viewComplaint = function (cid) {
        $http.get(baseUrl + 'com/admin/complaints/' + cid)
            .success(function (resp) {
                $scope.theComplaint = resp;
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };
    
    //审核
    $scope.verifyComplaint = function verifyComplaint(isPass) {
        var comStatus = {};
        if(isPass){
            comStatus.status = '处理中';
        }else{
            comStatus.status = '审核被驳';
        }
        $http.post(baseUrl + 'com/admin/complaints/' + $scope.theComplaint['id'], comStatus)
            .success(function (resp) {
               if(resp['status'] == 'success'){
                   swal("操作成功!", "完成审核!", "success");
                   getHandlingComplaints(1);
               }else{
                   swal("操作失败!", "系统发生错误!", "error");
               }
            }).error(function (resp) {
            swal("操作失败!", "系统发生错误!", "error");
        });
    }
});

app.controller('comProcessCtrl',function ($scope, $http, Pager, baseUrl, baseImgUrl, pageSize) {

    init();

    //初始化
    function init() {
        initTabs();
        getTypes();
        getHandlingComplaints(1);
        $scope.baseImgUrl = baseImgUrl;
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

    //获取处理中的投诉
    function getHandlingComplaints(page) {
        $http.get(baseUrl + 'com/processor/complaints' + Pager.pageParams(page,pageSize))
            .success(function (resp) {
                $scope.handlingComList = resp['complaints'];
            }).error(function (resp) {
            alert('数据加载失败');
        })
    }

    //查看处理对话
    $scope.viewComplaintInteraction = function (cid) {
        $http.get(baseUrl + 'com/processor/complaints/' + cid + '/interaction')
            .success(function (resp) {
                $scope.complaintInteraction = resp;
                console.log(resp);
            })
    }
});

//景区信息模块控制器
app.controller('scenicInfoCtrl',function ($scope, $http, Pager, baseUrl, baseImgUrl, pageSize) {

    init();

    //初始化
    function init() {
        getScenic(1);
    }
    $scope.getScenic = getScenic;

    //获取景区信息
    function getScenic(page) {
        $http.get(baseUrl + 'scenic/admin/scenic' + Pager.pageParams(page,pageSize))
            .success(function (resp) {
                $scope.scenic = resp;
            }).error(function (resp) {
            alert('数据加载失败');
        })
    }

    //查看某个景区的信息
    $scope.viewScenic = function (id) {
        $http.get(baseUrl + 'scenic/admin/scenic/' + id)
            .success(function (resp) {
                $scope.theScenic = resp;
            }).error(function (resp) {
            alert('数据加载失败');
        })
    }
});
