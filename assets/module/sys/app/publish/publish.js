function Lay(layui){
    layui.use(['form', 'table', 'config', 'ppp'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        // 渲染表格
        var userTable = table.render({
            elem: '#user-table',
            toolbar: '#user-toolbar',
            url: config.serverUrl + 'publish/lists',
            request: config.request,
            parseData: config.parseData,
            response: config.response,
            headers: {Authorization: config.getToken()},
            page: true,
            cols: [
                    [
                        {type: 'numbers'},
                        {align: 'center', toolbar: '#publish-table-bar', title: '操作'},
                        {field: 'id', align: 'center', sort: true, title: '文章id'},
                        {field: 'title', align: 'center', sort: true, title: '标题'},
                        {field: 'cover_id', align: 'center', sort: true, title: '封面',templet:'#faceHtml1'},
                        {field: 'published', align: 'center', sort: true, title: '发布时间'},
                        {field: 'images', align: 'center', sort: true, title: '图片数'},
                        {field: 'abstract', align: 'center', sort: true, title: '摘要'},
                        {field: 'chars', align: 'center', sort: true, title: '字符数'},
                    ]
                ]
            ,done:function(res,curr,count){
                ppp.hoverOpenImg();
            }
        });

        // 表格操作列事件
        table.on('tool(user-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (layEvent === 'edit') {
                // 修改
                showEditModel(data);
            }else if(layEvent === 'publish-scheme-select'){
                console.error('版式选择--------->a');
                showSelectSchemeModel(data);
            }
        });
        //显示表单弹窗
        var showSelectSchemeModel = function (data) {
            console.error('版式选择--------->b');
            console.error(data);
            if (data) {
                ppp.putTempData('t_publish', data);
                ppp.multiplePopup({
                    count:1,
                    title: '选择版式',
                    path: 'components/views/app/publish/form.html',
                    finish: function () {
                        renderTable();
                    }
                });
            }
        };

        //显示表单弹窗
        var showEditModel = function (data) {
            if (data) {
               console.error(data);
               location.href  = '#/articleInfo/'+data.info_id+'/'+ppp.getTimestamp()+'.html';
            }
        };

        // 搜索按钮点击事件
        $('#publish-btn-search').click(function () {
            var objForm = $("#searchPublishForm");
            console.log(objForm)
            userTable.reload({page: {
                curr: 1 //重新从第 1 页开始
            },where: ppp.getSearchFormById(objForm)});
        });
        // 修改user状态
        form.on('switch(publish-tpl-status)', function (obj) {
            layer.load(2);
            ppp.post('publish/' + obj.elem.value + '/status',
                {data: {status: obj.elem.checked ? 0 : 1}}, function () {
                    layer.closeAll('loading');
                    layer.msg('发布状态更新成功', {icon: 1});
                });
        });
    });



}//Lay 方法结束