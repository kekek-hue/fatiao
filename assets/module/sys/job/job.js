
function Lay(layui){
 
 layui.use(['layedit','ppp','laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider','jquery','form','upload' ], function(){
    var laypage = layui.laypage //分页
    ,table = layui.table //表格
    ,jq = layui.jquery
    ,form = layui.form
    ,layedit = layui.layedit
    ,laydate = layui.laydate
    ,upload = layui.upload
    ,ppp = layui.ppp;
   
    //执行一个 table 实例
    table.render({
      elem: '#staff-table'
      ,url: '../../job/lists' //数据接口
      ,toolbar:'#articleTool'
      ,title: '职位列表'
      ,page: true //开启分页
      ,cols: [[ //表头
        {type: 'checkbox'}
        ,{field: 'id', title: 'ID',sort: true}
        ,{field: 'company_id', title: '单位id'}
        ,{field: 'company_name', title: '单位名称'}
        ,{field: 'name', title: '职位名称'}
        ,{field: 'grade', title: '层级'}
        ,{field: 'info', title: '备注'}
        ,{fixed: 'right',align:'center',title:'操作', toolbar: '#barDemo'}
      ]]
      ,done:function(res,curr,count){
        ppp.hoverOpenImg();
      }
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
      var info = jq('#info').val();
      //执行重载
      table.reload('article-table', {
        page: {
          curr: 1 //重新从第 1 页开始
        }
        ,where: {
          id: id,
          name: name,
          info: info
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
    table.on('tool(staff-table)', function(obj){
      var data = obj.data;
      switch(obj.event){
        case 'delete-attr':
          deleteJob(data);          
        break;
        case 'edit-attr':
          openEdit(data);          
        break;
      };
    });
    /*表格头控制按钮*/
    table.on('toolbar(staff-table)', function(obj){
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
        case 'addJob':
          openEdit();
        break;
      };
    });
   /*
   *编辑内容
   */
  var openEdit = function(data)
  {
    if (data) {
      ppp.putTempData('t_job_data', data);
    }
    ppp.popupCenter({
      title: data ? '修改职位详情' : '添加职位',
      path: 'components/views/company/job/form.html',
      finish: function () {
        renderTable();
      }
    });
    form.render();
  }
    //添加
    function postAddJob(layero,index)
    {
      var jobObj = {
        name:layero.find('#name').val(),
        info:layero.find('#info').val(),
        company_id:layero.find('#company_id').val(),
        grade:layero.find('#grade').val(),
      };
      console.log(jobObj);
      jq.post("../../job/addJob",jobObj,function(data) {
        if(data.code == 200) {
          layer.alert('操作成功',{icon:1,title:'提示'});
          layer.close(index); //关闭弹层
         // location.reload()
        } else {
          layer.msg(data.msg);
        }
       },"json");

    }
    //删除单位
    function deleteJob(data){
      console.error(data);
      let  obj = {
        id:data.id
      };
      jq.post("../../job/deleteJob",obj,function(data) {
            if(data.code == 200) {
              layer.alert('删除成功！',{icon:1,title:'提示'});
              location.reload()
            } else {
            }
        },"json");  
    }
    //删除文章
    function deleteCompanys(data){
     for(var j = 0,len = data.length; j < len; j++){
        var  companyId = data[j].id;
        var data = {
          'id':companyId
        };
        deleteCompany(data);

      }
    }
    /*
    *更新快捷方式
    */
    function openUpdate(data)
    {
      layer.open({
          type: 1,
          title:'快速属性操作',
          shade: 0.8,
          shadeClose: true, 
          moveType:1,
          content: jq('.form-dv').html(),
          success:function(layero,index){
            jq("input[name=type][value=1]").attr("checked", data.type == 1 ? true : false);
            jq("input[name=type][value=2]").attr("checked", data.type == 2 ? true : false);
            jq("input[name=type][value=3]").attr("checked", data.type == 3 ? true : false);
            jq("input[name=type][value=4]").attr("checked", data.type == 4 ? true : false);
            jq("input[name=type][value=7]").attr("checked", data.type > 4 ? true : false);
            jq("select[name='status']").val(data.status)
            layero.find('#title-news').val(data.title);  
            layero.find('#news-id').val(data.id);
            form.render();
          }
      });
    }
    /*
    *关闭当前窗口
    */
    function closeDialog(){
       var index = parent.layer.getFrameIndex(window.name);  
       parent.layer.close(index);
    }
    
  //上传图片
   jq(document).on('change', '#img', function(){
       var files = this.files; // 获取文件的数量
       console.log(files);
       readers(files[0])
   });

   function readers(fil){
       var reader = new FileReader();  // 异步读取存储在用户计算机上的文件
       reader.readAsDataURL(fil); // 开始读取指定的Blob对象或File对象中的内容
       console.log(reader.result);
       reader.onload = function(){
           document.getElementById("thumbail").innerHTML = "<img src='"+reader.result+"'>";  // 添加图片到指定容器中
       };
   }

  });
}
