function Lay(layui){
    layui.use(['form', 'table', 'config', 'ppp'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        var schemeSkuData = ppp.getTempData('t_scheme_sku');
        var schemeSkuId = schemeSkuData.id; 
        console.error(schemeSkuData);
        // 渲染表格
        var userTable = table.render({
            elem: '#scheme-article-table',
            url: config.serverUrl + 'schemeArticle/lists/'+schemeSkuId,
            toolbar:'#add-publish-article-toolbar',
            request: config.request,
            parseData: config.parseData,
            response: config.response,
            headers: {Authorization: config.getToken()},
            page: true,
            cols: [
                    [
                        {type: 'numbers'},
                        {field: 'title', align: 'center', sort: true, title: '标题'},
                        {field: 'cover_id', align: 'center', sort: true, title: '封面',templet:'#faceArticle'},
                        {field: 'date', align: 'center', sort: true, title: '时间'},
                        {field: 'style', align: 'center',templet: '#type-tpl-type', sort: true, title: '轮播类型'},
                        {align: 'center', toolbar: '#scheme-article-table-bar', title: '操作'}
                    ]
                ]
        });
        // 工具条点击事件
        table.on('tool(scheme-article-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            if (obj.event === 'delete') {
                layer.confirm('确定删除吗？', function(index) {
                    deletePublishArticle(data);  
                    layer.close(index);      
                }); 
            }else if(obj.event === 'addPublishArticle'){
               // showPublishModel   
            }
        });
        //表格头工具条点击事件
        table.on('toolbar(scheme-article-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            switch(layEvent){
              case 'addPublishArticle':
               // ppp.finishPopupCenter();
                selectPublishModel(data);
              break;
            };
        });
        //显示发布文章弹窗
        var selectPublishModel = function (data) {
            //console.error('showPublishModel--------->');
            //console.error(schemeSkuData);
            ppp.multiplePopup({
                title: '发布文章列表',
                area: '1400px',
                path: 'components/views/app/publish/index.html',
                finish: function () {
                    renderTable();
                }
            });
        };

        //删除版式发布文章
        var deletePublishArticle = function(data){
            ppp.post('schemeArticle/delete', {data:data}, function () {
                layer.closeAll('loading');
                userTable.reload();
            });
        }
        // 搜索按钮点击事件
        $('#scheme-article-btn-search').click(function () {
            userTable.reload({where: ppp.getSearchForm()});
        });



        // 修改栏目轮播类型
        form.on('switch(type-tpl-type)', function (obj) {
            layer.load(2);
            ppp.post('schemeArticle/' + obj.elem.value + '/style',
                {data: {status: obj.elem.checked ? 2 : 1}}, function () {
                    layer.closeAll('loading');
                    layer.msg('轮播类型更新成功', {icon: 1});
                });
        });

    });



}//Lay 方法结束