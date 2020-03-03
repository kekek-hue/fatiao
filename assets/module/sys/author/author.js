function Lay(l){
       l.use(['layer','form','table','jquery','ppp','config'],function(){
           /////////////////////////////////////////////////////////方法体start
           var $=l.jquery,table=l.table,layer = l.layer,form=l.form,config=l.config,ppp=l.ppp;
           $('#add').on('click', function(){
               layer.open({
                   type: 1,
                   title:'添加作者',
                    // area: ['600px', '360px'],
                   shade: 0.8,
                   shadeClose: true, //点击遮罩关闭
                   content: $('#add-window').html()
                   ,btn: ['确定', '取消']
                   ,yes: function(index, layero){
                       var form_data = new FormData($('#ppp')[0]), url = '/news/author/add';

                       $.ajax({
                           url : url,
                           type : 'POST',
                           data : form_data,
                           // 告诉jQuery不要去处理发送的数据
                           processData : false,
                            // 告诉jQuery不要去设置Content-Type请求头
                           contentType : false,
                           beforeSend:function(){
                               console.log("正在进行，请稍候");
                           },
                           success : function(data) {
                                layer.msg('添加成功！');
                                location.reload()
                               //console.log("成功"+responseStr);
                           },
                           error : function(responseStr) {
                               console.log("error");
                           }
                       });
                   }
                   ,btn2: function(index, layero){
                   }
               });
               form.render();
           });
             // 渲染表格
        var userTable = table.render({
            elem: '#author-table',
            url: config.serverUrl + 'news/author/list',
            request: config.request,
            parseData: config.parseData,
            response: config.response,
            headers: {Authorization: config.getToken()},
            page: true,
            cols: [[
                {field: 'id', width: 60, title: 'ID'},
                {field: 'name', align: 'center', sort: true, title: '账号'},
                {field: 'nickname', align: 'center', sort: true, title: '用户名'},
                {field: 'phone', align: 'center', sort: true, title: '手机号'},
                {field: 'email', align: 'center', sort: true, title: '邮箱'},
                {field: 'create_time', align: 'center', sort: true, title: '创建时间'},
                {field: 'status', align: 'center', sort: true, templet: '#user-tpl-status', title: '状态'}
            ]]
        });
        // 搜索按钮点击事件
        $('#author-btn-search').click(function () {
            userTable.reload({where: ppp.getSearchForm()});
        });
//        上传图片
           $(document).on('change', '#img', function(){
               var files = this.files; // 获取文件的数量
               for(var i=0;i<files.length;i++){
                   readers(files[i])
               }
           });

           function readers(fil){
               var reader = new FileReader();  // 异步读取存储在用户计算机上的文件
               reader.readAsDataURL(fil); // 开始读取指定的Blob对象或File对象中的内容
               reader.onload = function(){
                   document.getElementById("thumbail").innerHTML = "<img src='"+reader.result+"'>";  // 添加图片到指定容器中
               };
           }


           /////////////////////////////////////////////////////////////////////////////////
       });
}