/**
*图集上传
*/
//统计已有图片数
var atlaseCount = atlaseArray.length;
//console.error(atlaseCount+'------>');
 //图集对象
function atlases(layui){
  layui.use(['layer','form','layedit','laydate','jquery','upload','table'], function(){
  var  layer = layui.layer,
    layedit=layui.layedit,
    laydate = layui.laydate,
    form=layui.form,
    $ = layui.jquery,
    upload = layui.upload,
    table = layui.table;
    var imgId = 0 ;
    //监听单元格编辑
    var demoListView = $('#demoList')
    ,uploadListIns = upload.render({
      elem: '#testList'
      ,url: '/article/manyImgUpload/'+globalId
      ,field:'atlases[]'
      ,multiple: true
      ,auto: false
      ,headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        }
      ,bindAction: '#testListAction'
      ,choose: function(obj){   
        var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
        //读取本地文件
        obj.preview(function(index, file, result){
          atlaseCount++;
          var tr = $(['<tr id="upload-'+ index +'">'
            ,'<td class="index">'+ atlaseCount +'</td>'
            ,'<td>'+ file.name +'</td>'
            ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
            ,'<td>等待上传</td>'
            ,'<td>说明</td>'
            ,'<td>预览</td>'
            ,'<td>'
              ,'<button class="layui-btn layui-btn-mini demo-reload layui-hide">重传</button>'
              ,'<button class="layui-btn layui-btn-mini layui-btn-danger demo-delete">删除</button>'
            ,'</td>'
          ,'</tr>'].join(''));

          //单个重传
          tr.find('.demo-reload').on('click', function(){
            obj.upload(index, file);
          });
          //删除
          tr.find('.demo-delete').on('click', function(){
            delete files[index]; //删除对应的文件
            tr.remove();
            uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
          });
          demoListView.append(tr);
        });
      }
      ,done: function(res, index, upload){
        var atlaseObj = new Object();//创建图集对象
        if(res.code == 0){ //上传成功
          //console.log(res.data);
          var imgPath = res.data.src[0][0];
          atlaseObj.image_id = res.data.src[0][1];
          atlaseObj.image_res_id = res.data.src[0][0];
          atlaseObj.sort = atlaseCount;
          /*$('#demo2').append('<img src="'+showPath+ imgPath +'" alt="'+ showPath+ imgPath +'" class="layui-upload-img">')
          */    
          var tr = demoListView.find('tr#upload-'+ index)
          ,tds = tr.children();
          tds.eq(0).attr('data-image-id',res.data.src[0][1]);
          tds.eq(3).html('<span style="color: #5FB878;">上传成功</span>');
          tds.eq(5).html('<img src="'+showPath+ imgPath +'" alt="'+ showPath+ imgPath +'" class="layui-upload-img">');
          tds.eq(6).html('<button class="layui-btn layui-btn-mini layui-btn-danger edit-title">编辑</button>'); //清空操作
          tds.eq(6).find('.edit-title').on('click',function(){
          layer.prompt({formType: 0,value: '',title: '请输入图片信息'},
            function(val, index){
              tds.eq(4).html(val);
              //存入图集信息
              atlaseObj.info = val;
              layer.close(index);
            });
            return false;
          });
          //console.log(index);
          atlaseArray[imgId] = atlaseObj;
          imgId++;
          return delete this.files[index]; //删除文件队列已经上传成功的文件
        }
        this.error(index, upload);
      }
      ,error: function(index, upload){
        var tr = demoListView.find('tr#upload-'+ index)
        ,tds = tr.children();
        tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
        tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
      }
    });
    //上传图集结束


  //编辑已存在的图集
  $('body').on('click','.edit-title',function(){
    var btn_this = $(this);
    var dataKey = $(btn_this).attr('data-key');
    layer.prompt({formType: 0,value: '',title: '请输入图片信息'},
      function(val, index){
        var tr = $(btn_this).parent().parent()
          ,tds = tr.children();
          tds.eq(4).html(val);//修改表格
          //修改图集数组data-key
          atlaseArray[dataKey].info = val;
          layer.close(index);
      }
      );
      return false;
    })
    //图片编辑结束
    //atlase-delete 图集删除
    //atlase-delete 图集删除
   $('body').on('click','.atlase-delete',function(){
        var thisObj = $(this);
        var  id = $(thisObj).attr('data-id');
        layer.confirm('确定删除吗？', function(index) {
              var obj = {id:id};
              $.post("../../atlase/delImg",obj,function(data) {
                  layer.msg('已删除');
              },"json");
            $(thisObj).parent().parent().remove();    
            layer.close(index);
        });
        return false;
    })//


  }); //layui over
}//function over



//------------------------表格排序
  $(document).ready(function(){
      var fixHelperModified = function(e, tr) {
        var $originals = tr.children();
        var $helper = tr.clone();
        $helper.children().each(function(index) {
            $(this).width($originals.eq(index).width())
        });
        return $helper;
      },
      updateIndex = function(e, ui) {
         // console.error(e);
         // console.error(ui);
         // console.error('------------------------>');
         
          $('td.index', ui.item.parent()).each(function (i) {
              let index = i+1,
                  image_id = $(this).attr('data-image-id');     
              $(this).html(index);
              sortData(image_id,index);
              console.log(atlaseArray);
          });
      };
      $("#atlases_table tbody").sortable({
          helper: fixHelperModified,
          stop: updateIndex
      }).disableSelection();
      //遍历数组重新排序
      function sortData(image_id,sort)
      {
        $.each(atlaseArray,function(index,value){
          if(atlaseArray[index].image_id == image_id){
            atlaseArray[index].sort = sort;
            console.log(sort+'------'+image_id);
          }
        });
        console.log('重新排序后');
        console.log(atlaseArray);          
      }



  });
  //