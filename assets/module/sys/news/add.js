function Lay(layui){
     atlases(layui)//图集上传
    layui.use(['layer','form','layedit','laydate','jquery','upload','element'], function(){
         var  layer = layui.layer,
              layedit=layui.layedit,
              laydate = layui.laydate,
              form=layui.form,
              $ = layui.jquery,
              upload = layui.upload,
              element = layui.element;
              element.init();//防止折叠面板失效

          //发布
          laydate.render({
            elem: '#publish-btn'
            ,type: 'datetime',
            theme: '#1E9FFF',
            value: new Date()
          }); 
          //全文搜索功能
          form.on('select(tag-search)',function(data){
          });   
        //分类属性
        function getTypes()
        {
          $.get("../../type/getTypes?article_id="+globalId,function(data) {
              data.forEach(function(value,i){
                  //动态添加分类
                  if(type_id == value.id){
                    var html = '<input type="radio" name="type_id" value='+value.id+' checked title="'+value.name+'" lay-skin="primary">';
                  }else{
                    var html = '<input type="radio" name="type_id" value='+value.id+'  title="'+value.name+'" lay-skin="primary">';
                  }
                  $("#types-div").append(html);
                  //动态添加父级分类
                  var optionHmtl = ' <option  data-grade='+value.grade+' value="'+value.id+'">'+value.name+'</option>';
                  $("#add-type-parent_id").append(optionHmtl);

              })
              form.render();
          },"json");
        }
        //添加标签
        $("#add_tag_btn").on('click',function(){
          let name = $("#add_tag").val();
          let nameText = $("#add_tag").find("option:selected").text();
          let tagObj = {
            name:name,
            article_id:globalId
          };
          console.log(tagObj);
          $.post("../../tags/addArticleTag",tagObj,function(data) {
              if(data.code == 200) {
                //动态添加标签
                let tag_html = ' <span class="layui-btn layui-btn-sm layui-btn-radius" style="margin-left: -5px;"><span><span>'+name+'</span></span> <button type="button" data-tag-id='+data.data+' class="layui-btn layui-btn-xs layui-btn-radius  delete_article_tag"><i class="layui-icon">&#xe640;</i></button></span> ';
                $("#add_tag_div").prepend(tag_html);
                $("#add_tag").val('');
                form.render();
              } else {
                layer.msg(data.msg);
              }
          },"json");

        });
        //删除标签delete_article_tag--->事件委托
        $('body').on('click','.delete_article_tag',function(){
          var obj = $(this);
          let tagId = obj.attr('data-tag-id');
          let tagObj = {
            tag_id:tagId,
            article_id:globalId
          };
          $.post("../../tags/deleteArticleTag",tagObj,function(data) {
              if(data.code == 200) {
                //动态删除文章标签
                obj.parent().remove();
                form.render();
              } else {
                layer.msg(data.msg);
              }
          },"json");
        });
       
        //添加新分类
        $("#add_type_btn").on('click', function(){
          let selectObj = $("#add-type-parent_id  option:selected");
          let pid = selectObj.val();
          let top_id = selectObj.val();
          let name = $("#add_type_name").val();
          let grade = selectObj.attr("data-grade")+1;
          let typeObj  = {
            pid:  pid,
            top_id: top_id,
            grade: grade,
            name: name,
          };
          $.post("../../news/type/add",typeObj,function(data) {
              if(data.code == 200) {
                //动态添加分类
                var html = '<input type="checkbox" name="types" value='+data.data+' title="'+name+'" lay-skin="primary">' ;
                $("#types-div").append(html);
                layer.msg('添加成功');
                form.render();
              } else {
                layer.msg(data.msg);
              }
          },"json");
        });
        getTypes();
        layui.use('form', function () {
            var form = layui.form;
            form.render('checkbox');
            form.render('select');
        });

        var routineInformationEdit = '';

        //var routineInformationEdit = layedit.build('LAY_demo1');
        //编辑器外部操作
        var active = {
            content: function(){
                alert(layedit.getContent(routineInformationEdit)); //获取编辑器内容
            }
            ,text: function(){
                alert(layedit.getText(routineInformationEdit)); //获取编辑器纯文本内容
            }
            ,selection: function(){
                alert(layedit.getSelection(routineInformationEdit));
            }
        };
        //编辑属性弹出层
        $('.edit-attr').on('click', function(){
            layer.open({
                type: 1,
                title:'快速属性操作',
                shade: 0.8,
                shadeClose: true, //点击遮罩关闭
                content: $('.form-dv').html()
            });
        });
        //更新时间
        laydate.render({
            elem: '#date',
            theme:'#1E9FFF'
        });
        form.on('radio(article-type)', function (data) {
          console.log('ok---------');
        
          //判断单选框的选中值
          if(data.value == 1){
            $(".imageTxt").removeClass('layui-hide');
            $(".atlases-div").addClass('layui-hide');
          }else if(data.value == 2){
            $(".imageTxt").addClass('layui-hide');
            $(".atlases-div").removeClass('layui-hide');
          }
        });
        /*常规信息添加
          监听提交
        */
        form.on('submit(routineInformation)', function(data){
            var editContent =  UE.getEditor('editor').getContent();
            var data = JSON.stringify(data.field);
            var likes = Array();
            $("input:checkbox[name='like']:checked").each(function(i){
                likes[i] = $(this).val();
            });
            var atlasesData = new Array();
            for (var value of atlaseArray) {
              atlasesData.push(value);
              console.log(value);
            }
            var paramData = {
            	"addData":data,
            	"editContent":editContent,
            	"likes":likes,
              'atlases':atlasesData
            };
           // console.error(paramData);
            $.post("../../article/add/4",paramData,function(data) {
	            if(data.code == 200) {
                    layer.msg('添加成功');
                    if(type == 1){
                      location.href = '../../article/index';
                    }else{
                      location.href = '../../atlases/index';
                    }
	            } else {

	            }
        	},"json");
            return false;
        });
       	//缩略图片上传
		  var uploadInst = upload.render({
		    elem: '#thumbnail'
		    ,url: '../../article/imgUpload/'+globalId,
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

		/*高级参数添加
	    */
	    form.on('submit(advancedParameter)', function(data){
	        var advPara = {
	        	"advPara":JSON.stringify(data.field)
	        };
	        console.log(advPara);
	        $.post("advParam",advPara,function(data) {
	            if(data.code == 200){
	            	
	            }else{
	            
	            }
	    	},"json");
	        return false;
	    });
      form.render();
    
             form.render();

    });
}
//使用百度编辑器构建编辑器
var ue = UE.getEditor('editor');


