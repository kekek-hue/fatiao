function Lay(layui){
    layui.use(['form', 'table', 'config', 'ppp'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        // 渲染表格
        var userTable = table.render({
            elem: '#db_bak-table',
            toolbar: '#db-bak-toolbar',
            url: config.serverUrl + 'db/dbbak',
            request: config.request,
            parseData: config.parseData,
            response: config.response,
            headers: {Authorization: config.getToken()},
            page: true,
            cols: [
                    [
                        {type: 'checkbox'},
                        {type: 'numbers'},
                        {field: 'Name', align: 'center', sort: true, title: '数据库表'},
                        {field: 'Rows', align: 'center', sort: true, title: '记录条数',templet: '#scheme-tpl-type'},
                        {field: 'Data_length', align: 'center', sort: true, title: '占用空间'},
                        {field: 'Collation', align: 'center', sort: true, title: '编码'},
                        {field: 'Comment', align: 'center', sort: true, title: '说明'},
                    ]
                ]
        });
        // 表格操作列事件
        table.on('toolbar(db_bak-table)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id),
                data = checkStatus.data;
            switch(obj.event){
              case 'dbbak':
                    if(data.length == 0){
                        layer.msg('请选择一行');
                        return false;
                    }
                    showEditModel(data);          
              break;
            };
        });


        //显示表单弹窗
        var showEditModel = function (data) {
            var caldata = {
                name:getArray(data)
            };
            console.error(caldata)
            ppp.post('db/act/bak', {data:caldata}, function () {
                layer.closeAll('loading');
                layer.msg('备份成功！', {icon: 1});
                ppp.finishPopupCenter();
            }); 
        };

        var getArray = function(data){
            //要ajax的json数据
            var jsonData = new Array;
            for(var j = 0,len = data.length; j < len; j++){
                jsonData[j] = data[j].Name;
            }
            return jsonData;
        }

    });



}//Lay 方法结束