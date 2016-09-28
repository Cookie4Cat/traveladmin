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
            comStatus.status = '投诉被驳';
        }
        $http.post(baseUrl + 'com/admin/complaints/' + $scope.theComplaint['id'], comStatus)
            .success(function (resp) {
                if (resp['status'] == 'success') {
                    swal("操作成功!", "完成审核!", "success");
                    $scope.getHandlingComplaints($scope.pagination.current);
                    console.log('update');
                } else {
                    swal("操作失败!", "系统发生错误!", "error");
                }
            }).error(function (resp) {
            swal("操作失败!", "系统发生错误!", "error");
        });
    }
});

//投诉处理控制器
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
            cancelButtonText: "取消",
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
            document.getElementsByName("updateForm")[0].reset();
            $scope.getScenic($scope.pagination.current);
        }).error(function (data, status) {
            //上传失败
            swal("操作失败!", "出现错误!", "error");
        });

        $scope.removeImgPool = [];
    };

    //删除一个图片
    function removeImg(id) {
        $http.post(baseUrl + 'images/' + id + '/delete', null)
            .success(function (resp) {
                //success
            }).error(function (resp) {
            //error
        })
    }
});

//游记控制器
app.controller('articleCurdCtrl', function ($scope, $http, Pager, baseUrl, baseImgUrl, pageSize) {
    init();

    //初始化
    function init() {
        $scope.baseImgUrl = baseImgUrl;
    }

    //获取文章信息
    $scope.getArticles = function (page) {
        $http.get(baseUrl + 'article/admin/articles' + Pager.pageParams(page, pageSize))
            .success(function (resp) {
                $scope.articles = resp['articles'];
                //获取分页器
                $scope.pagination = Pager.getPagination(page, pageSize, resp['count']);
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };
    //获取第一页
    $scope.getArticles(1);

    //查看某个游记的信息
    $scope.viewArticle = function (id) {
        $http.get(baseUrl + 'article/admin/articles/' + id)
            .success(function (resp) {
                $scope.theArticle = resp;
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };

    //增加游记
    $scope.addArticle = function () {
        var formData = new FormData(document.forms.namedItem("addForm"));
        $http({
            method: 'POST',
            url: baseUrl + 'article/admin/articles',
            data: formData,
            headers: {'Content-Type': undefined}
        }).success(function (data) {
            //上传成功
            swal("操作成功!", "完成添加!", "success");
            $scope.getArticles($scope.pagination.current);
        }).error(function (data, status) {
            //上传失败
            swal("操作失败!", "出现错误!", "error");
        });
    };

    //查看待更新的游记
    $scope.viewUpdateArticle = function (id) {
        $http.get(baseUrl + 'article/admin/articles/' + id)
            .success(function (resp) {
                $scope.updateArticle = resp;
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };

    //更新游记
    $scope.update = function (id) {
        var formData = new FormData(document.forms.namedItem("updateForm"));
        $http({
            method: 'POST',
            url: baseUrl + 'article/admin/articles/' + id,
            data: formData,
            headers: {'Content-Type': undefined}
        }).success(function (data) {
            //上传成功
            swal("操作成功!", "完成添加!", "success");
            document.getElementsByName("updateForm")[0].reset();
        }).error(function (data, status) {
            //上传失败
            swal("操作失败!", "出现错误!", "error");
        });
    };

    //删除游记
    $scope.deleteArticle = function (id) {
        swal({
            title: "您确定删除此项记录?",
            text: "此项记录将被永久删除",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "继续删除",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $http.post(baseUrl + 'article/admin/articles/' + id + '/delete', null)
                .success(function (resp) {
                    swal("操作成功!", "成功删除!", "success");
                    $scope.getArticles($scope.pagination.current);
                }).error(function (resp) {
                swal("操作失败!", "出现错误!", "error");
            })
        });
    };
});

//酒店信息管理模块
app.controller('hotelCurdCtrl', function ($scope, $http, Pager, baseUrl, baseImgUrl, pageSize) {
    init();

    //初始化
    function init() {
        $scope.baseImgUrl = baseImgUrl;
        getScenicInfo();
    }

    //获取景区LOV
    function getScenicInfo() {
        $http.get(baseUrl + 'scenic/admin/scenic' + Pager.pageParams(1, 10))
            .success(function (resp) {
                $scope.scenicLOV = {};
                var scenicList = resp['scenicEntities'];
                for (i in scenicList) {
                    $scope.scenicLOV[scenicList[i]['sid']] = scenicList[i]['scenicName'];
                }
            }).error(function (resp) {
            alert('数据加载出错');
        })
    }

    //获取酒店信息
    $scope.getHotels = function (page) {
        $http.get(baseUrl + 'hotel/admin/hotels' + Pager.pageParams(page, pageSize))
            .success(function (resp) {
                $scope.hotels = resp['hotels'];
                //获取分页器
                $scope.pagination = Pager.getPagination(page, pageSize, resp['count']);
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };
    //获取第一页
    $scope.getHotels(1);

    //查看某个酒店的信息
    $scope.viewHotel = function (id) {
        $http.get(baseUrl + 'hotel/admin/hotels/' + id)
            .success(function (resp) {
                $scope.theHotel = resp;
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };

    //添加酒店信息
    $scope.addHotel = function () {
        var formData = new FormData(document.forms.namedItem("addForm"));
        $http({
            method: 'POST',
            url: baseUrl + 'hotel/admin/hotels',
            data: formData,
            headers: {'Content-Type': undefined}
        }).success(function (data) {
            //上传成功
            swal("操作成功!", "完成添加!", "success");
            $scope.getHotels($scope.pagination.current);
        }).error(function (data, status) {
            //上传失败
            swal("操作失败!", "出现错误!", "error");
        });
    };

    //获取待更新的酒店信息
    $scope.viewUpdateHotel = function (id) {
        $http.get(baseUrl + 'hotel/admin/hotels/' + id)
            .success(function (resp) {
                $scope.updateHotel = resp;
                console.log(resp);
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };

    //删除酒店信息
    $scope.deleteHotel = function (id) {
        swal({
            title: "您确定删除此项记录?",
            text: "此项记录将被永久删除",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "继续删除",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $http.post(baseUrl + 'hotel/admin/hotels/' + id + '/delete', null)
                .success(function (resp) {
                    swal("操作成功!", "成功删除!", "success");
                    $scope.getHotels($scope.pagination.current);
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
        for (i in $scope.updateHotel['imgs']) {
            if ($scope.updateHotel['imgs'][i].id == id) {
                $scope.updateHotel['imgs'][i] = emptyImg;
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
            url: baseUrl + 'hotel/admin/hotels/' + $scope.updateHotel['id'],
            data: formData,
            headers: {'Content-Type': undefined}
        }).success(function (data) {
            //上传成功
            swal("操作成功!", "完成更新!", "success");
            document.getElementsByName("updateForm")[0].reset();
        }).error(function (data, status) {
            //上传失败
            swal("操作失败!", "出现错误!", "error");
        });

        $scope.removeImgPool = [];
    };

    //删除一个图片
    function removeImg(id) {
        $http.post(baseUrl + 'images/' + id + '/delete', null)
            .success(function (resp) {
                //success
            }).error(function (resp) {
            //error
        })
    }
});

//演出信息控制器
app.controller('performanceCurdCtrl', function ($scope, $http, Pager, baseUrl, baseImgUrl, pageSize) {
    init();

    //初始化
    function init() {
        $scope.baseImgUrl = baseImgUrl;
        getScenicInfo();
    }

    //获取景区LOV
    function getScenicInfo() {
        $http.get(baseUrl + 'scenic/admin/scenic' + Pager.pageParams(1, 10))
            .success(function (resp) {
                $scope.scenicLOV = {};
                var scenicList = resp['scenicEntities'];
                for (i in scenicList) {
                    $scope.scenicLOV[scenicList[i]['sid']] = scenicList[i]['scenicName'];
                }
            }).error(function (resp) {
            alert('数据加载出错');
        })
    }

    //获取演出信息
    $scope.getPerformances = function (page) {
        $http.get(baseUrl + 'ent/admin/performances' + Pager.pageParams(page, pageSize))
            .success(function (resp) {
                $scope.performances = resp['performs'];
                //获取分页器
                $scope.pagination = Pager.getPagination(page, pageSize, resp['count']);
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };
    //获取第一页
    $scope.getPerformances(1);

    //查看某个演出的信息
    $scope.viewPerformance = function (id) {
        $http.get(baseUrl + 'ent/admin/performances/' + id)
            .success(function (resp) {
                $scope.thePerformance = resp;
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };

    //添加演出信息
    $scope.addPerformance = function () {
        var formData = new FormData(document.forms.namedItem("addForm"));
        $http({
            method: 'POST',
            url: baseUrl + 'ent/admin/performances',
            data: formData,
            headers: {'Content-Type': undefined}
        }).success(function (data) {
            //上传成功
            swal("操作成功!", "完成添加!", "success");
            $scope.getPerformances($scope.pagination.current);
        }).error(function (data, status) {
            //上传失败
            swal("操作失败!", "出现错误!", "error");
        });
    };

    //获取待更新的演出信息
    $scope.viewUpdatePerformance = function (id) {
        $http.get(baseUrl + 'ent/admin/performances/' + id)
            .success(function (resp) {
                $scope.updatePerformance = resp;
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };

    //删除演出信息
    $scope.deletePerformance = function (id) {
        swal({
            title: "您确定删除此项记录?",
            text: "此项记录将被永久删除",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "继续删除",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $http.post(baseUrl + 'ent/admin/performances/' + id + '/delete', null)
                .success(function (resp) {
                    swal("操作成功!", "成功删除!", "success");
                    $scope.getPerformances($scope.pagination.current);
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
        for (i in $scope.updatePerformance['images']) {
            if ($scope.updatePerformance['images'][i].id == id) {
                $scope.updatePerformance['images'][i] = emptyImg;
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
            url: baseUrl + 'ent/admin/performances/' + $scope.updatePerformance['id'],
            data: formData,
            headers: {'Content-Type': undefined}
        }).success(function (data) {
            //上传成功
            swal("操作成功!", "完成更新!", "success");
            document.getElementsByName("updateForm")[0].reset();
            $scope.getPerformances($scope.pagination.current);
        }).error(function (data, status) {
            //上传失败
            swal("操作失败!", "出现错误!", "error");
        });

        $scope.removeImgPool = [];
    };

    //删除一个图片
    function removeImg(id) {
        $http.post(baseUrl + 'images/' + id + '/delete', null)
            .success(function (resp) {
                //success
            }).error(function (resp) {
            //error
        })
    }
});

//餐饮信息控制器
app.controller('canteenCurdCtrl', function ($scope, $http, Pager, baseUrl, baseImgUrl, pageSize) {
    init();

    //初始化
    function init() {
        $scope.baseImgUrl = baseImgUrl;
        getScenicInfo();
    }

    //获取景区LOV
    function getScenicInfo() {
        $http.get(baseUrl + 'scenic/admin/scenic' + Pager.pageParams(1, 10))
            .success(function (resp) {
                $scope.scenicLOV = {};
                var scenicList = resp['scenicEntities'];
                for (i in scenicList) {
                    $scope.scenicLOV[scenicList[i]['sid']] = scenicList[i]['scenicName'];
                }
            }).error(function (resp) {
            alert('数据加载出错');
        })
    }

    //获取餐饮信息
    $scope.getCanteens = function (page) {
        $http.get(baseUrl + 'cant/admin/canteens' + Pager.pageParams(page, pageSize))
            .success(function (resp) {
                $scope.canteens = resp['canteens'];
                //获取分页器
                $scope.pagination = Pager.getPagination(page, pageSize, resp['count']);
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };
    //获取第一页
    $scope.getCanteens(1);

    //查看某个餐饮信息
    $scope.viewCanteen = function (id) {
        $http.get(baseUrl + 'cant/admin/canteens/' + id)
            .success(function (resp) {
                $scope.theCanteen = resp;
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };

    //添加餐饮信息
    $scope.addCanteen = function () {
        var formData = new FormData(document.forms.namedItem("addForm"));
        $http({
            method: 'POST',
            url: baseUrl + 'cant/admin/canteens',
            data: formData,
            headers: {'Content-Type': undefined}
        }).success(function (data) {
            //上传成功
            swal("操作成功!", "完成添加!", "success");
            $scope.getCanteens($scope.pagination.current);
        }).error(function (data, status) {
            //上传失败
            swal("操作失败!", "出现错误!", "error");
        });
    };

    //获取待更新的餐饮信息
    $scope.viewUpdateCanteen = function (id) {
        $http.get(baseUrl + 'cant/admin/canteens/' + id)
            .success(function (resp) {
                $scope.updateCanteen = resp;
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };

    //删除餐饮信息
    $scope.deleteCanteen = function (id) {
        swal({
            title: "您确定删除此项记录?",
            text: "此项记录将被永久删除",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "继续删除",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $http.post(baseUrl + 'cant/admin/canteens/' + id + '/delete', null)
                .success(function (resp) {
                    swal("操作成功!", "成功删除!", "success");
                    $scope.getCanteens($scope.pagination.current);
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
        for (i in $scope.updateCanteen['imgs']) {
            if ($scope.updateCanteen['imgs'][i].id == id) {
                $scope.updateCanteen['imgs'][i] = emptyImg;
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
            url: baseUrl + 'cant/admin/canteens/' + $scope.updateCanteen['id'],
            data: formData,
            headers: {'Content-Type': undefined}
        }).success(function (data) {
            //上传成功
            swal("操作成功!", "完成更新!", "success");
            document.getElementsByName("updateForm")[0].reset();
            $scope.getCanteens($scope.pagination.current);
        }).error(function (data, status) {
            //上传失败
            swal("操作失败!", "出现错误!", "error");
        });

        $scope.removeImgPool = [];
    };

    //删除一个图片
    function removeImg(id) {
        $http.post(baseUrl + 'images/' + id + '/delete', null)
            .success(function (resp) {
                //success
            }).error(function (resp) {
            //error
        })
    }
});

//应急信息控制器
app.controller('emergencyCurdCtrl', function ($scope, $http, Pager, baseUrl, baseImgUrl, pageSize) {
    init();

    //初始化
    function init() {
        $scope.baseImgUrl = baseImgUrl;
        getScenicInfo();
    }

    //获取景区LOV
    function getScenicInfo() {
        $http.get(baseUrl + 'scenic/admin/scenic' + Pager.pageParams(1, 10))
            .success(function (resp) {
                $scope.scenicLOV = {};
                var scenicList = resp['scenicEntities'];
                for (i in scenicList) {
                    $scope.scenicLOV[scenicList[i]['sid']] = scenicList[i]['scenicName'];
                }
                console.log($scope.scenicLOV);
            }).error(function (resp) {
            alert('数据加载出错');
        })
    }

    //获取文章信息
    $scope.getEmergencies = function (page) {
        $http.get(baseUrl + 'emgy/admin/emergencies' + Pager.pageParams(page, pageSize))
            .success(function (resp) {
                $scope.emergencies = resp['emergencyEntities'];
                //获取分页器
                $scope.pagination = Pager.getPagination(page, pageSize, resp['count']);
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };
    //获取第一页
    $scope.getEmergencies(1);

    //查看某个游记的信息
    $scope.viewEmergency = function (id) {
        $http.get(baseUrl + 'emgy/admin/emergencies/' + id)
            .success(function (resp) {
                $scope.theEmergency = resp;
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };

    //增加游记
    $scope.addEmergency = function () {
        $http.post(baseUrl + 'emgy/admin/emergencies', $scope['newEmergency'])
            .success(function (data) {
                //上传成功
                swal("操作成功!", "完成添加!", "success");
                $scope.getEmergencies($scope.pagination.current);
                $scope['newEmergency'] = {};
            }).error(function (data, status) {
            //上传失败
            swal("操作失败!", "出现错误!", "error");
        });
    };

    //查看待更新的游记
    $scope.viewUpdateEmergency = function (id) {
        $http.get(baseUrl + 'emgy/admin/emergencies/' + id)
            .success(function (resp) {
                $scope.updateEmergency = resp;
            }).error(function (resp) {
            alert('数据加载失败');
        })
    };

    //更新游记
    $scope.update = function (id) {
        $http.post(baseUrl + 'emgy/admin/emergencies/' + id, $scope['updateEmergency'])
            .success(function (data) {
                //上传成功
                $scope.getEmergencies($scope.pagination.current);
                $scope['updateEmergency'] = {};
                swal("操作成功!", "完成添加!", "success");
            }).error(function (data, status) {
            //上传失败
            swal("操作失败!", "出现错误!", "error");
        });
    };

    //删除游记
    $scope.deleteEmergency = function (id) {
        swal({
            title: "您确定删除此项记录?",
            text: "此项记录将被永久删除",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "继续删除",
            cancelButtonText: "取消",
            closeOnConfirm: false
        }, function () {
            $http.post(baseUrl + 'emgy/admin/emergencies/' + id + '/delete', null)
                .success(function (resp) {
                    swal("操作成功!", "成功删除!", "success");
                    $scope.getEmergencies($scope.pagination.current);
                }).error(function (resp) {
                swal("操作失败!", "出现错误!", "error");
            })
        });
    };
});

//菜单控制器
app.controller('menuCurdCtrl',function () {
    
});

//角色控制器
app.controller('roleCurdCtrl',function () {

});