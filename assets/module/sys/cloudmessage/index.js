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
            , url: config.serverApiUrl + 'nim/server/list' //数据接口
            , toolbar: '#commune-add-toolbar'
            , request: {
                //页码的参数名称，默认：page
                pageName: 'page',
                //每页数据量的参数名，默认：limit
                limitName: 'size'
            }
            , parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "count": parseInt(res.count),
                    "data": res.result //解析数据列表
                };
            }
            , title: '文章列表'
            , page: true //开启分页
            ,limit: 15 //每页默认显示的数量
            ,limits:[15,30,45]
            , cols: [[ //表头
                {type: 'checkbox'}
                , {field: 'id', title: '注册id', sort: true}
                , {field: 'name', title: '姓名'}
                , {field: 'token', title: 'TOKEN'}
            ]]
        });

    });
}
   