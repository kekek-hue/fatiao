function Lay(layui) {

    layui.use(['layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form', 'upload', 'config', 'ppp'], function () {
        var laypage = layui.laypage //分页
            , table = layui.table //表格
            , form = layui.form
            , layedit = layui.layedit
            , laydate = layui.laydate
            , upload = layui.upload
            , config = layui.config
            , ppp = layui.ppp;

        var $ = layui.jquery;

        //执行一个 table 实例
        table.render({
            elem: '#person-area-table'
            , url: config.serverApiUrl + 'integral/list' //数据接口
            , toolbar: '#commune-add-toolbar'
            , request: {
                //页码的参数名称，默认：page
                pageName: 'page',
                //每页数据量的参数名，默认：limit
                limitName: 'size'
            }
            , page: true //开启分页

            , parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "count": res.result.length,
                    "data": res.result //解析数据列表
                };
            }
            , title: '文章列表'
            , cols: [[ //表头
                 {field: 'id', title: 'ID', sort: true}
                , {field: 'name', title: '名称'}
                , {
                    field: 'max_num',
                    title: '最大次数',
                }
                , {field: 'add_num', title: '增加分数'}
                , {field: 'increase_num', title: '最高增加次数'}
                , {fixed: 'right', align: 'center', title: '操作', toolbar: '#barDemo'}
            ]]
            , done: function (res, curr, count) {
                ppp.hoverOpenImg();
            }
        });

        //分页
        laypage.render({
            elem: 'pageDemo' //分页容器的id
            , count: 100 //总页数
            , skin: '#1E9FFF' //自定义选中色值
            //,skip: true //开启跳页
            , layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
            , jump: function (obj, first) {
                if (!first) {
                    layer.msg('第' + obj.curr + '页', {offset: 'b'});
                }
            }
        });

        /*
        *关闭当前窗口
        */
        function closeDialog() {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }

        table.on('tool(person-area-table)', function (obj) {
            var data = obj.data;
            var type = $("#edit").data("edit-type");
            var pppTitle = $("#edit").data("edit-title");
            switch (obj.event) {
                case 'delete-attr':
                    deleteData(data);
                    break;
                case 'edit-attr':
                    openEdit(data, type, pppTitle);
                    break;

            }
        });

        let deleteData = function (data) {
            let formData = new FormData();
            formData.append("id", data.id);
            $.ajax({
                url: config.serverApiUrl + 'occupation/del',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                success: function (data) {
                    if (data.result == "ok") {
                        layer.msg('删除成功', {icon: 1});
                        location.reload();
                    } else {
                        layer.msg('修改失败', {icon: 2});
                    }
                },
                error: function (responseStr) {
                    console.log("error");
                }
            });
        };

                /*
        *编辑内容
        */
       let openEdit = function (data, type, title) {
        if (data) {
            ppp.putTempData('person-form', data);
        }

        ppp.putTempData('person-type', type);

        ppp.popupCenter({
            title: data ? '修改' + title + '详情' : '添加' + title,
            path: 'components/views/integral/form.html',
            finish: function () {
                table.reload('person-area-table');
            }
        });
    };

    });
}
   