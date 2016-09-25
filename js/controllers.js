//常量
app.constant('baseUrl', 'http://localhost:8088/v1/');
app.constant('pageSize', 4);
app.constant('baseImgUrl', 'http://localhost:8088/');

app.controller('userIndexCtrl', function ($scope) {
    $scope.test = '俺是测试，希望通过';
});

//投诉审核控制器
app.controller('comVerifyCtrl', function ($scope, $http, baseUrl, baseImgUrl, Pager, pageSize) {

    init();

    //初始化
    function init() {
        initTabs();
        getTypes();
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
                for (i in resp) {
                    $scope.typeMap[resp[i]['typeId']] = resp[i]['typeName'];
                }
            });
    }

    //获取待审核的投诉
    $scope.getHandlingComplaints = function (page) {
        $http.get(baseUrl + 'com/admin/complaints' + Pager.pageParams(page, pageSize))
            .success(function (resp) {
                $scope.handlingComList = resp['complaints'];
                //获取分页器
                $scope.pagination = Pager.getPagination(page, pageSize, resp['count']);
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };

    //获取第一页待审核投诉
    $scope.getHandlingComplaints(1);

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
        if (isPass) {
            comStatus.status = '处理中';
        } else {
            comStatus.status = '审核被驳';
        }
        $http.post(baseUrl + 'com/admin/complaints/' + $scope.theComplaint['id'], comStatus)
            .success(function (resp) {
                if (resp['status'] == 'success') {
                    swal("操作成功!", "完成审核!", "success");
                    getHandlingComplaints(1);
                } else {
                    swal("操作失败!", "系统发生错误!", "error");
                }
            }).error(function (resp) {
            swal("操作失败!", "系统发生错误!", "error");
        });
    }
});

app.controller('comProcessCtrl', function ($scope, $http, Pager, baseUrl, baseImgUrl, pageSize) {

    init();

    //初始化
    function init() {
        initTabs();
        getTypes();
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
                for (i in resp) {
                    $scope.typeMap[resp[i]['typeId']] = resp[i]['typeName'];
                }
            });
    }

    //获取处理中的投诉
    $scope.getHandlingComplaints = function (page) {
        $http.get(baseUrl + 'com/processor/complaints' + Pager.pageParams(page, pageSize))
            .success(function (resp) {
                $scope.handlingComList = resp['complaints'];
                //获取分页器
                $scope.pagination = Pager.getPagination(page, pageSize, resp['count']);
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };

    //获取第一页
    $scope.getHandlingComplaints(1);

    //查看处理对话
    $scope.viewComplaintInteraction = function (cid) {
        $http.get(baseUrl + 'com/processor/complaints/' + cid + '/interaction')
            .success(function (resp) {
                $scope.complaintInteraction = resp;
                //根据一来一回的原则判断是否显示回复按钮
                $scope.showSubmitBtn = $scope.complaintInteraction.length % 2 == 1;
                console.log(resp);
            })
    };

    //回复游客的投诉
    $scope.reply = function () {
        var replyId = $scope.complaintInteraction[$scope.complaintInteraction.length - 1]['id'];
        var formData = new FormData(document.forms.namedItem("myForm"));
        formData.append('userId', 2);
        $http({
            method: 'POST',
            url: baseUrl + 'com/processor/complaints/' + replyId + '/reply',
            data: formData,
            headers: {'Content-Type': undefined}
        }).success(function (data) {
            //上传成功
            swal("操作成功!", "完成回复!", "success");
        }).error(function (data, status) {
            //上传失败
            swal("操作失败!", "出现错误!", "success");
        });
    }

});

//景区信息模块控制器
app.controller('scenicInfoCtrl', function ($scope, $http, Pager, baseUrl, baseImgUrl, pageSize) {

    init();

    //初始化
    function init() {
        $scope.baseImgUrl = baseImgUrl;
    }

    //获取景区信息
    $scope.getScenic = function (page) {
        $http.get(baseUrl + 'scenic/admin/scenic' + Pager.pageParams(page, pageSize))
            .success(function (resp) {
                $scope.scenic = resp['scenicEntities'];
                //获取分页器
                $scope.pagination = Pager.getPagination(page, pageSize, resp['count']);
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };
    //获取第一页
    $scope.getScenic(1);

    //查看某个景区的信息
    $scope.viewScenic = function (id) {
        $http.get(baseUrl + 'scenic/admin/scenic/' + id)
            .success(function (resp) {
                $scope.theScenic = resp;
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };

    //添加景区信息
    $scope.addScenic = function () {
        var formData = new FormData(document.forms.namedItem("addForm"));
        $http({
            method: 'POST',
            url: baseUrl + 'scenic/admin/scenic',
            data: formData,
            headers: {'Content-Type': undefined}
        }).success(function (data) {
            //上传成功
            swal("操作成功!", "完成添加!", "success");
            $scope.getScenic($scope.pagination.current);
        }).error(function (data, status) {
            //上传失败
            swal("操作失败!", "出现错误!", "error");
        });
    };

    //获取待更新的景区信息
    $scope.viewUpdateScenic = function (id) {
        $http.get(baseUrl + 'scenic/admin/scenic/' + id)
            .success(function (resp) {
                $scope.updateScenic = resp;
                console.log(resp);
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };

    //删除景区信息
    $scope.deleteScenic = function (id) {
        swal({
            title: "您确定删除此项记录?",
            text: "此项记录将被永久删除",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "继续删除",
            cancelButtonText:"取消",
            closeOnConfirm: false
        }, function () {
            $http.post(baseUrl + 'scenic/admin/scenic/' + id + '/delete', null)
                .success(function (resp) {
                    swal("操作成功!", "成功删除!", "success");
                    $scope.getScenic($scope.pagination.current);
                }).error(function (resp) {
                swal("操作失败!", "出现错误!", "error");
            })
        });
    };

    //待删除的图片列表
    $scope.removeImgPool = [];

    //添加待删除图片
    $scope.addToRemovePool = function (id) {
        var emptyImg = {id: 0};
        $scope.removeImgPool.push(id);
        for (i in $scope.updateScenic['imgs']) {
            if ($scope.updateScenic['imgs'][i].id == id) {
                $scope.updateScenic['imgs'][i] = emptyImg;
            }
        }
    };

    //更新
    $scope.update = function () {
        //删除待删除图片
        for (i in $scope.removeImgPool) {
            removeImg($scope.removeImgPool[i]);
        }

        var formData = new FormData(document.forms.namedItem("updateForm"));
        $http({
            method: 'POST',
            url: baseUrl + 'scenic/admin/scenic/' + $scope.updateScenic['sid'],
            data: formData,
            headers: {'Content-Type': undefined}
        }).success(function (data) {
            //上传成功
            swal("操作成功!", "完成更新!", "success");
        }).error(function (data, status) {
            //上传失败
            swal("操作失败!", "出现错误!", "error");
        });

        $scope.removeImgPool = [];
    };

    //删除一个图片
    function removeImg(id) {
        console.log(id + '----------');
        $http.post(baseUrl + 'scenic/admin/image/' + id + '/delete', null)
            .success(function (resp) {
                //success
            }).error(function (resp) {
            //error
        })
    }

});
