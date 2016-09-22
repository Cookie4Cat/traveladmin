app.service('Pager', function () {
    this.pageParams = function (page,size) {
        return '?page=' + page + '&size=' + size;
    }
});
