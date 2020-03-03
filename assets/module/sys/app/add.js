function Lay(){
 layui.use(['layer', 'ppp', 'form', 'iconPicker'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var iconPicker = layui.iconPicker;
        var schemeSkuData = ppp.getTempData('t_scheme_sku');
        if(schemeSkuData){
            var articleType = schemeSkuData.article_type;
            console.error(schemeSkuData);
            form.val('scheme-sku-form', schemeSkuData);
        }
        var articleData = ppp.getTempData('articleInfo');
        console.log("kkk")
         //分类属性
        function getTypes()
        {
          $.get("type/getTypes",function(data) {
              data.forEach(function(value,i){
                if(articleType == value.id){
                    var optionHmtl = ' <option  selected data-grade='+value.grade+' value="'+value.id+'">'+value.name+'</option>';
                }else{
                    var optionHmtl = ' <option  data-grade='+value.grade+' value="'+value.id+'">'+value.name+'</option>';
                }
                $("#article_type").append(optionHmtl);
              })
              form.render();
          },"json");
          form.val('category-form', articleData);
          form.render();
        }
        getTypes();
        ppp.get('resources/resources', {async: false}, function (data) {
            
        });
        // 表单提交事件
        form.on('submit(scheme-form-submit)', function (data) {
            layer.load(2);
            if (data.field.id) {
                ppp.post('scheme/edit/' + data.field.id, {data: data.field}, function () {
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