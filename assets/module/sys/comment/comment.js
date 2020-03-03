function Lay(layui){

  layui.use(['form', 'table', 'config', 'ppp', 'jquery', 'setter'], function () {
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        var setter = layui.setter;
        var $ = layui.jquery;
        $('#resource-toolbar').vm({
            refreshShow: ppp.hasPerm("sys:resource:refresh")
        });
        // 渲染表格
        var w=$(parent.window).width()-200;//获取浏览器的宽，减去侧边栏的宽度
        var pageData = [];
        var resourceTable = table.render({
            elem: '#comment-table',
            url: setter.serverUrl+'comment',
            // request: config.request,
            parseData: function(res){ //res 即为原始返回的数据
                console.log(res);
                pageData = res.result;
                return {
                    "code": 0, //解析接口状态
                    "count": res.count, //解析数据长度
                    "data": res.data //解析数据列表
                };
            },
            // response: config.response,
            // headers: {Authorization: config.getToken()},
            page:true,

            // width:w,
            cols: [[
                {type: 'numbers'},
                {field: 'id', title: 'ID'},
                // {field: 'allStatus', title: 'all_id'},
                {field: 'title', align: 'center', sort: true, title: '标题'},
                {field: 'user_id', align: 'center', sort: true, title: '用户'},
                {field: 'content', align: 'center', sort: true, title: '评论内容'},
                {field: 'destination_id', align: 'center', sort: true, title: '目标id'},
                {field: 'status', align: 'center', sort: true, title: '状态',templet:"#comment-tpl-status"},
                // {field: 'ip', align: 'center', sort: true, title: '评论ip'},
                {field: 'create_time', align: 'center', sort: true, title: '时间'},
                {field: 'type', align: 'center', sort: true, title: '评论类型',templet:"#comment-tpl-type"},
                // {field: 'is_del', align: 'center', sort: true, title: '是否删除',templet:"#comment-tpl-del"},
                {fixed: 'right',align:'center',title:'操作', toolbar:'#commentTool',width:230}
            ]]
        });

      // 表格顶部操作列
        table.on('toolbar(resource-table)', function (obj) {
            if (obj.event === 'refresh') {
                ppp.put('/resources', {}, function () {
                    layer.msg('刷新成功', {icon: 1});
                    resourceTable.reload('resource-table', {});
                });
            }
        });
        table.on('tool(comment-table)', function(obj){
            var data = obj.data;
            if (obj.event === 'updateStatus') { //修改
                openUpdate(data);
            } else if (obj.event === 'del') { //删除
                doDelete(obj);
            }
        });
        var openUpdate = function(data){
            ppp.putTempData('t_comment', data);
            ppp.popupCenter({
                title: '修改状态',
                path: 'components/views/comment/form.html',
                finish: function () {
                    resourceTable.reload();
                }
            });
        }
        // 删除
        var doDelete = function (obj) {
          layer.confirm('确定要删除吗？', function (i) {
              layer.close(i);
              layer.load(2);
              ppp.delete('comment/del/' + obj.data.id, {}, function () {
                  layer.closeAll('loading');
                  layer.msg('删除成功', {icon: 1});
                  obj.del();
                  resourceTable.reload();
              });
          });
        };
        // 搜索按钮点击事件
        $('#comment-btn-search').click(function () {
            if($(".title").val().trim()=="" || $(".content").val().trim()==""){
                return layer.msg("搜索内容不能为空")
            }
            resourceTable.reload({page: {
                curr: 1 //重新从第 1 页开始
            },where: ppp.getSearchForm()});
        });
        // 搜索按钮点击事件
        $('#repair-btn').click(function () {
           if(pageData.length<1){
               layer.alert('数据尚未加载完成');
               return false;
           }else{
               //评论
               var idArr = [];
               for(var i in pageData){
                   idArr.push({id:pageData[i]['id']});
               }
               $.post(setter.serverUrl+'repair/all/id/type',{table:'comment',type:'type',data:idArr}, function(d){
                   resourceTable.reload({where: ppp.getSearchForm()})
               }, 'json');
           }
        });
    });

}//lay方法结束