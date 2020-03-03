
function Lay(layui){
    layui.use(['layedit','laydate', 'laypage', 'layer', 'table', 'ppp', 'upload', 'element', 'slider','jquery','form','upload' ], function(){
       var laypage = layui.laypage //分页
       ,table = layui.table //表格
       ,jq = layui.jquery
       ,form = layui.form
       ,layedit = layui.layedit
       ,laydate = layui.laydate
       ,upload = layui.upload
       ,config = layui.config
       ,ppp = layui.ppp;
       //执行一个 table 实例
       table.render({
         elem: '#chart-group-table'
         ,url:config.serverUrl+ 'project/notice/lists' //数据接口
         ,toolbar:'#articleTool'
         ,title: '项目列表'
         ,page: true //开启分页
         ,cols: [
            [ 
                {type: 'checkbox'}
                ,{field: 'id', title: 'ID',sort: true}
                ,{field: 'title', title: '标题'}
                ,{field: 'info_id', title: '文章id'}
                ,{field: 'user_id', title: '创建用户id'}
                ,{field: 'publish_time', title: '发布时间'}
                ,{field: 'author_id', title: '公社名称'}
                ,{fixed: 'right',align:'center',title:'操作', toolbar: '#barDemo'}
            ]
        ]
       });
       //分页
       laypage.render({
         elem: 'pageDemo' //分页容器的id
         ,count: 100 //总页数
         ,skin: '#1E9FFF' //自定义选中色值
         //,skip: true //开启跳页
         ,layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
         ,jump: function(obj, first){
           if(!first){
             layer.msg('第'+ obj.curr +'页', {offset: 'b'});
           }
         }
       });
       //查询开始
       jq('.reload-btn').on('click', function(){
         var id = jq('#id').val();
         var title = jq('#title').val();
         //执行重载
         table.reload('chart-group-table', {
           page: {
             curr: 1 //重新从第 1 页开始
           }
           ,where: {
             id: id,
             title: title,
           }
         });
       });
       //查询结束
       //监听提交
       form.on('submit(newsUpdateForm)', function(data) {
           form.render();
           jq.post("../article/update",data.field,function(data) {
               if(data.code == 200) {
                 layer.alert('修改成功',{icon:1,title:'提示'});
                 location.reload()
               } else {
               }
           },"json");
           return false;
       });
       /*控制按钮*/
       table.on('tool(chart-group-table)', function(obj){
         var data = obj.data;
         switch(obj.event){
           case 'project-info-attr':
                let articleId = data['c_article_id'];
                location.href = "#/articleInfo/"+articleId+"/1551258898000.html"
                //showGroupMember(data);          
           break;
           case 'edit-attr':
             showEditModel(data);          
           break;
         };
       });
       /*表格头控制按钮*/
       table.on('toolbar(chart-group-table)', function(obj){
         var checkStatus = table.checkStatus(obj.config.id),
           data = checkStatus.data;
         switch(obj.event){
           case 'getCheckData':
             if(data.length == 0){
               layer.msg('请选择一行');
               return false;
             }
             var company = data;  
             layer.confirm('确定删除吗？', function(index) {
                 deleteCompanys(company);  
                 layer.close(index);      
             });       
           break;
           case 'addNotice':
             showEditModel();
           break;
         };
       });

     //删除文章
     var deleteCompanys = function(data){
      for(var j = 0,len = data.length; j < len; j++){
         var  companyId = data[j].id;
         var data = {
           'id':companyId
         };
         deleteCompany(data);
       }
     }
    //删除单位
    var deleteCompany  = function(data){
      console.error(data);
      let  obj = {
        id:data.id
      };
      jq.post("project/notice/delete",obj,function(data) {
            if(data.code == 200) {
              layer.alert('删除成功！',{icon:1,title:'提示'});
              location.reload()
            } else {
            }
        },"json");  
    }

    //显示表单弹窗
    var showEditModel = function (data) {
      if (data) {
          ppp.putTempData('t_notice_edit_data', data);
      }
      ppp.popupCenter({
          title: data ? '修改公告' : '添加公告',
          path: 'components/views/project/notice/form.html',
          finish: function () {
              renderTable();
          }
      });

  };
   //显示表单弹窗
    var showGroupMember = function (data) {
      if (data) {
        /* ppp.get('app/scheme/' + data.id, {async: false}, function (data) {
              ppp.putTempData('t_scheme_sku', data.result);
          });
          }else{*/
          ppp.putTempData('t_chat_group_data', data);
      }
      ppp.popupCenter({
        title: '群组成员列表',
        area: '1000px',
        path: 'components/views/chat/group/member.html',
        finish: function () {
            renderTable();
        }
    });
      
  };
    
     

   
       

     });
   }
   