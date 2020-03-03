function Lay(){
    layui.use(['layer', 'ppp', 'form', 'iconPicker'], function () {
      var layer = layui.layer;
      var ppp = layui.ppp;
      var form = layui.form;
      var $ = layui.jquery;
      var iconPicker = layui.iconPicker;
      var noticeData = ppp.getTempData('t_notice_edit_data');
      
      //公社列表
      ppp.get('commune/allLists', {async: false}, function (data) {
          if(data.code == 0){
              var communeData = data.data;
              communeData.forEach(function(value,i){
                  let opt ="<option value="+value.id+">"+value.name+"</option>";
                  $("#commune_id").append(opt);
              });
          }
      });

      if(noticeData){
         form.val('notice-form', noticeData);
         form.render();
      }

    
     // 表单提交事件
     form.on('submit(commune-form-submit)', function (data) {
         layer.load(2);
         if (data.field.id) {
             ppp.post('project/notice/edit', {data: data.field}, function () {
                 layer.closeAll('loading');
                 layer.msg('修改成功', {icon: 1});
                 ppp.finishPopupCenter();
             });
         } else {
             ppp.post('project/notice/add', {data: data.field}, function () {
                 layer.closeAll('loading');
                 layer.msg('添加成功', {icon: 1});
                 ppp.finishPopupCenter();
             });
         }
         location.reload();
         return false;
     });
     iconPicker.render({
         // 选择器，推荐使用input
         elem: '#iconPicker',
         // 数据类型：fontClass/unicode，推荐使用fontClass
         type: 'fontClass',
         // 是否开启搜索：true/false
         search: true,
         // 是否开启分页
         page: true,
         // 每页显示数量，默认12
         limit: 12,
         // 点击回调
         click: function (data) {
             $("#iconPicker").val(data.icon);
         }
     });
     form.render();
   });
   
}//函数结束