app.service('Pager', function () {
    this.pageParams = function (page,size) {
        return '?page=' + page + '&size=' + size;
    };
    this.getPagination = function (page, pageSize, count) {
        var pagination = {};
        //计算页数
        var pageNum = parseInt(count / pageSize) + 1;
        //是否显示
        pagination.show = pageNum > 1;

        //生成页码列表
        if(pageNum > 1){
            pagination.pages = [];
            for(var i=0;i<pageNum;i++){
                pagination.pages.push(i+1);
            }
        }

        //当前页码
        pagination.current = page;

        //上一页和下一页
        if(page == 1){
            pagination.last = 1;
        }else{
            pagination.last = page - 1;
        }
        if(page == pageNum){
            pagination.next = pageNum;
        }else{
            pagination.next = page + 1;
        }
        return pagination;
    };
});
