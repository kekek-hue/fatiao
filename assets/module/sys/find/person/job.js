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
        var pppTable =table.render({
            elem: '#person-area-table'
            , url: config.serverUrl + 'occupation/list' //数据接口
            , toolbar: '#commune-add-toolbar'
            , parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "data": res.data, //解析数据列表
                    "count":res.dataCount
                };
            }
            , where: {
                type: '5',
            }
            , title: '文章列表'
            , cols: [[ //表头
                {type: 'checkbox'}
                , {field: 'id', title: 'ID', sort: true}
                , {field: 'name', title: '职务'}
                , {fixed: 'right', align: 'center', title: '操作', toolbar: '#barDemo'}
            ]]
            , done: function (res, curr, count) {
                ppp.hoverOpenImg();
            }
        });

        // 表格操作列事件
        table.on('toolbar(person-area-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            var type = $("#edit").data("edit-type");
            var pppTitle = $("#edit").data("edit-title");
            switch (layEvent) {
                case 'add':
                    openEdit(data, 'addJob', '职务');
                    break;
            };
        });

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
                path: 'components/views/find/form.html',
                finish: function () {
                    pppTable.reload();
                }
            });
        };

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
        *关闭当前窗口
        */
        function closeDialog() {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }
    });
}
   