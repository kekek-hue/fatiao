function Lay(layui){
    layui.use(['form', 'table', 'config', 'ppp'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        // 渲染表格
        var renderTable = function(){
            table.render({
                elem: '#db-res-table',
                toolbar: '#db-res-toolbar',
                url: config.serverUrl + 'db/dbres',
                request: config.request,
                parseData: config.parseData,
                response: config.response,
                headers: {Authorization: config.getToken()},
                page: true,
                cols: [
                        [
                            {fixed: 'status',align:'center',title:'操作', toolbar: '#db-res-db-bar'},
                            {type: 'checkbox'},
                            {field: 'name', align: 'center', sort: true, title: '文件名'},
                            {field: 'size', align: 'center', sort: true, title: '使用空间(KB)'},
                            {field: 'time', align: 'center', sort: true, title: '备份时间'},
                        ]
                    ]
            });
        }
        renderTable();
        // 表格操作列事件
        table.on('toolbar(db-res-table)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id),
                data = checkStatus.data;
                if(data.length == 0){
                    layer.msg('请选择一行');
                    return false;
                }
            switch(obj.event){
              case 'resAct'://还原
                    resAct(data);
              break;
              case 'downloadPack'://打包下载
                    downloadPack(data);
              break;
              case 'localUpload'://本地导入
                    //showEditModel(data);          
              break;
              case 'delete'://批量删除
                    //showEditModel(data);          
              break;
            };
        });
           // 工具条点击事件
        table.on('tool(db-res-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            switch(obj.event){
              case 'delete':
                layer.confirm('确定删除该记录吗？', function () {
                   /* ppp.delete('/menus/' + data.id, {}, function () {
                        layer.closeAll('loading');
                        layer.msg('删除成功', {icon: 1});
                    }, false);*/
                    renderTable();
                });        
              break;
            };
        });
        //打包下载
        var  downloadPack = function(data){
            var caldata = {
                name:getArray(data)
            };
            var msg = '打包下载';
            var ok = formSubmit("resForm","db/download/pack",caldata);
            window.confirm(msg,ok);

            //window.location.href = "db/download/pack?name="+caldata;
           /*  ppp.post('db/download/pack', {data:caldata}, function () {
                layer.closeAll('loading');
                layer.msg('打包下载成功', {icon: 1});
                ppp.finishPopupCenter();
            }); */           
        }
        //模拟表单提交
        function formSubmit(formName,url,data)
        {
            var resForm = $('form[name="'+formName+'"]');
            for(var j = 0,len = data.name.length; j < len; j++){
                var input = "<input type='hidden' name ='name[]' value = '"+data.name[j]+"'>";
                resForm.append(input);   
            }
            if(url)
            {
                resForm.attr('action',url);
            }
            resForm.submit();
        }
        //还原
        var  resAct = function(data){
            var caldata = {
                name:getArray(data)
            };
            ppp.post('db/resAct', {data:caldata}, function () {
                layer.closeAll('loading');
                layer.msg('还原成功！', {icon: 1});
                ppp.finishPopupCenter();
            });            
        }

        var getArray = function(data){
            //要ajax的json数据
            var jsonData = new Array;
            for(var j = 0,len = data.length; j < len; j++){
                jsonData[j] = data[j].name;
            }
            return jsonData;
        }
    });



}//Lay 方法结束