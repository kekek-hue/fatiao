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
            elem: '#shop'
            , url: config.serverApiUrl + 'integral/shop/admin/list' //数据接口
            , toolbar: '#add-toolbar'
            , request: {
                //页码的参数名称，默认：page
                pageName: 'page',
                //每页数据量的参数名，默认：limit
                limitName: 'count',
            }
            , page: true //开启分页

            , parseData: function (res) { //res 即为原始返回的数据
                var count = res.count;
                var min = res.result.min_id;
                var max = res.result.max_id;
                var total = res.result.total;
                var list = res.result.data;
                delete list.min_id;
                delete list.max_id;
                delete list.total;
                delete list.count;
                return {
                    "code": 0, //解析接口状态
                    "count": res.count,
                    "data": list //解析数据列表
                };
            }
            , title: '商品列表'
            , cols: [[ //表头
                {type: 'checkbox'}
                , {field: 'shop_id', title: 'ID', sort: true}
                ,{field: 'image_url', title: '封面' ,templet:'#faceHtml'}
                , {field: 'name', title: '名称'}
                , {
                    field: 'integral',
                    title: '所需积分',
                }
                , {field: 'content', title: '礼品描述'}
                , {field: 'number', title: '库存'}
                , {field: 'created', title: '创建时间'}
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

        table.on('tool(shop)', function (obj) {
            var data = obj.data;
            var type = $("#edit").data("edit-type");
            var pppTitle = $("#edit").data("edit-title");
            switch (obj.event) {
                case 'del-attr':
                    deleteData(data.shop_id);
                    break;
                case 'edit-attr':
                    openEdit(data.shop_id);
                    break;

            }
        });

        table.on('toolbar(shop)', function (obj) {
            var data = obj.data;
            var type = $("#edit").data("edit-type");
            var pppTitle = $("#edit").data("edit-title");
            switch (obj.event) {
                case 'add-attr':
                    location.href = '#!addShop';
                    break;
                case 'del-attr':
                    var checkStatus = table.checkStatus('shop')
                        ,data = checkStatus.data;
                    if(data.length === 0){
                        layer.alert('你至少选择一条记录');
                    }else{
                        var id = (data.map((v)=>{ return v.shop_id; }).join(','));
                        deleteData(id);
                    }
                    break;
            }
        });

        let deleteData = function (id) {
            let formData = new FormData();
            formData.append("id", id);
            formData.append("is_del", 1);
            $.ajax({
                url: config.serverApiUrl + 'integral/shop/del',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                success: function (data) {
                    if (data.result == "ok") {
                        layer.msg('删除成功', {icon: 1});
                        table.reload('shop');
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
       let openEdit = function (id) {
           localStorage.setItem('id', id);
            location.href = '#!setShop';
        };

    });
}
   