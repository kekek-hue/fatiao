
layui.use(['layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form', 'upload', 'config', 'ppp'], function () {
    var laypage = layui.laypage //分页
        , table = layui.table //表格
        , jq = layui.jquery
        , form = layui.form
        , layedit = layui.layedit
        , laydate = layui.laydate
        , upload = layui.upload
        , config = layui.config
        , ppp = layui.ppp;

    //执行一个 table 实例
    var demoTable = table.render({
        elem: '#demo-table'
        , url: config.serverUrl+'found/list' //数据接口
        , toolbar: '#demoTool'
        , title: '小视频列表'
        , page: true //开启分页
        , defaultToolbar: ['filter']//'filter', 'print', 'exports'
        , cols: [[ //表头
            // {type: 'checkbox'}
            {field: 'row', title: 'row',  width:70}
            , {field: 'content', title: '内容', width:400}
            , {field: 'create_time', title: '发布时间',width:250}
            , {
                field: 'style',
                // field: 'statusData',
                title: '审核状态',
                templet: '#newState',
                width:150
            }
            // , {field: 'cover_id', title: '封面id', width:180}
            , {fixed: 'right', title: '操作', toolbar: '#barDemo', width:250}
        ]]
        , parseData: function (res) { //res 即为原始返回的数据
            var count = res.pageCount;
            var total = res.total;
            var list = res.data;
            return {
                "code": 0, //解析接口状态
                "count": total,
                "data": list //解析数据列表
            };
        }
        , done: function (res, curr, count) {
            ppp.hoverOpenImg();
        }
    });

    // 搜索条件
    laydate.render({
        elem: '#start_time'
        ,type:'datetime'
    });

    // 搜索条件
    laydate.render({
        elem: '#end_time'
        ,type:'datetime'
    });

    function renderTable(){
        demoTable.reload()
    }

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

    //查询开始
    form.on('submit(demo-form-submit)', function (data) {
        demoTable.reload({
            where: data.field
        });
    });
    //查询结束
    //监听提交
    form.on('submit(newsUpdateForm)', function (data) {
        form.render();
        jq.post("../article/update", data.field, function (data) {
            if (data.code == 200) {
                layer.alert('修改成功', {icon: 1, title: '提示'});
                location.reload()
            } else {

            }
        }, "json");
        return false;
    });

    /*控制按钮*/
    table.on('tool(demo-table)', function (obj) {
        var data = obj.data;
        switch (obj.event) {
            case 'op-pass':
                // alert('del')
              communeAskSet(data)
                break;
            case 'edit':
                // alert('edit')
                openEdit(data, 2);
                break;
        }
    });

    var openEdit = function (data) {
        if (data) {    
            location.href = '#/foundInfo/id=' + data.id + '/.html';
        }

    }
    var communeAskSet = function (data, type) {
      var titl;
        if (data.status == 2) {
            titl = '确定审核不通过吗？';
        }
        layer.confirm(titl, function (index) {
            jq.post("/found/audit", {
                id: data.id,
            }, function (data) {
                // console.log(data);
                table.reload('demo-table');
                layer.msg(data.msg);
            }, "json");
        });
    }


  
  





   

    /*
    *关闭当前窗口
    */
    function closeDialog() {
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    }

   

});