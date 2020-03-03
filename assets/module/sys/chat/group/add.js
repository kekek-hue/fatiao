function Lay(){
    layui.use(['layer', 'ppp', 'form', 'iconPicker'], function () {
           var layer = layui.layer;
           var ppp = layui.ppp;
           var form = layui.form;
           var $ = layui.jquery;
           var iconPicker = layui.iconPicker;
           var groupData = ppp.getTempData('t_chat_group_data');
           if(groupData){
               form.val('group-form', groupData);
           }
           // 表单提交事件
           form.on('submit(scheme-form-submit)', function (data) {
               layer.load(2);
               if (data.field.id) {
                   ppp.post('group/edit', {data: data.field}, function () {
                       layer.closeAll('loading');
                       layer.msg('修改成功', {icon: 1});
                       ppp.finishPopupCenter();
                   });
               } else {
                   ppp.post('scheme/add', {data: data.field}, function () {
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