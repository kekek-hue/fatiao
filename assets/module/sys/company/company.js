
function Lay(layui){
 
 layui.use(['layedit','laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider','jquery','form','upload' ], function(){
    var laypage = layui.laypage //分页
    ,table = layui.table //表格
    ,jq = layui.jquery
    ,form = layui.form
    ,layedit = layui.layedit
    ,laydate = layui.laydate
    ,upload = layui.upload;
   
    //执行一个 table 实例
    table.render({
      elem: '#article-table'
      ,url: '../../company/lists' //数据接口
      ,toolbar:'#articleTool'
      ,title: '文章列表'
      ,page: true //开启分页
      ,cols: [[ //表头
        {type: 'checkbox'}
        ,{field: 'id', title: 'ID',sort: true}
        ,{field: 'type', title: '单位性质',templet:function(d){
          let name = null;
          if(d.type == 1){
            name = '央企';
          }
          
          if(d.type == 2){
            name = '国企';
          }
          
          if(d.type == 3){
            name = '民企';
          }
          
          if(d.type == 4){
            name = '组织';
          }

          return name;

        }}
        ,{field: 'name', title: '单位名称'}
        ,{field: 'simple', title: '单位简称'}
        ,{field: 'people', title: '法人代表'}
        ,{field: 'register_address', title: '注册地址'}
        ,{field: 'work_address', title: ' 办公地址'}
        ,{field: 'status', title: '状态'}
        ,{field: 'create_time', title: '创建时间'}
        ,{field: 'user_id', title: '创建者'}
        //,{field: 'logo', title: 'logo' ,templet:'<div><img style="height:50px" data-img="/img/{{d.face_res_id}}" src="/article/showFace/{{ d.face}}"></div>'}
        ,{field: 'check_id', title: '审核人'}
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
    table.on('tool(company-table)', function(obj){
      var data = obj.data;
      switch(obj.event){
        case 'delete-attr':
          deleteCompany(data);          
        break;
        case 'edit-attr':
          openEdit(data);          
        break;
      };
    });
    /*表格头控制按钮*/
    table.on('toolbar(company-table)', function(obj){
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
        case 'addCompany':
          upenAddForm();
        break;
      };
    });
    //添加数据弹窗
    function upenAddForm()
    {
      layer.open({
          type: 1
          ,title: '添加单位'
          ,content:jq('#add-form').html() 
          ,btn: ['确定', '取消']
          ,success:function(){
            laydate.render({
              elem: '#create_time'
              ,type: 'datetime',
              value: new Date()
            });
            //缩略图片上传
              var uploadInst = upload.render({
                elem: '#thumbnail'
                ,url: '../../article/imgUpload',
                    field:'file[]' 
                ,before: function(obj){
                  obj.preview(function(index, file, result){
                    $('#lowSource').attr('src', result); //图片链接（base64）
                  });
                }
                ,done: function(res){
                  //如果上传失败
                  if(res.code > 0){
                    return layer.msg('上传失败');
                  }
                  //上传成功
                  $(".thumbnailPath").val(res.data.src);
                  $('#facePath').val(showPath+res.data.src[0][0]);

                }
                ,error: function(){
                  //演示失败状态，并实现重传
                  var demoText = $('#failText');
                  demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                  demoText.find('.demo-reload').on('click', function(){
                    uploadInst.upload();
                  });
                }
              });
              form.render();
          }
          ,yes: function(index, layero){
            postAddCompany(layero,index);
          }
        }); 
     
      form.render();
        //创建时间渲染
      
    }
    //添加
    function postAddCompany(layero,index)
    {
      var companyObj = {
        name:layero.find('#name').val(),
        type:layero.find('#type').val(),
        simple:layero.find('#simple').val(),
        people:layero.find('#people').val(),
        register_address:layero.find('#register_address').val(),
        work_address:layero.find('#work_address').val(),
        create_time:layero.find('#create_time').val(),
      };
      console.log(companyObj);
      jq.post("../../company/addCompany",companyObj,function(data) {
        if(data.code == 200) {
          layer.alert('修改成功',{icon:1,title:'提示'});
          layer.close(index); //关闭弹层
          location.reload()
        } else {
          layer.msg(data.msg);
        }
       },"json");

    }
    //删除单位
    function deleteCompany(data){
      console.error(data);
      let  obj = {
        id:data.id
      };
      jq.post("../../company/deleteCompany",obj,function(data) {
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
    *编辑内容
    */
    function openEdit(data)
    {

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
