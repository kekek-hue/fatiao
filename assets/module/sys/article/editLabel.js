layui.use(['setter', 'layer', 'form', 'layedit', 'laydate', 'jquery', 'upload', 'element', 'ppp', 'config'], function () {
    var layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate,
        form = layui.form,
        config = layui.config,
        $ = layui.jquery,
        upload = layui.upload,
        element = layui.element,
        ppp = layui.ppp,
        setter = layui.setter,
        imgTxtContent = null;
    //添加标签
    $("#add_tag_btn").on('click', function () {
        let name = $("#add_tag").val();
        $.post(setter.serverUrl+'article/label/add', {label:name, material_id:articleId}, function(d){
            if(d.result === 'ok'){
                //动态添加标签
                let tag_html = `<span data-val="${d.id}" class="value-tag layui-btn layui-btn-sm layui-btn-radius" style="margin-left: -5px;">
                            <span><span>${name}</span></span>
                            <button type="button"  class="layui-btn layui-btn-xs layui-btn-radius  delete_article_tag">
                            <i class="layui-icon">&#xe640;</i>
                            </button>
                        </span>`;
                $("#add_tag_div").prepend(tag_html);
                $("#add_tag").val('');
                form.render();
            }else{
                layer.alert('添加失败请稍后重试');
            }
        },'json');
    });

    //返回
    $('#back').on('click',function(){
       location.href='#!topic.html'
    });

    //删除标签
    $(document).on('click', '.delete_article_tag', function () {
        var targetId = $('#material-id').val();
        var parentObj = $(this).parent('span');
        var labelId = parentObj.attr('data-val');
        $.post(setter.serverUrl+'article/label/del',{targetId:targetId, labelId:labelId}, function(d){
            debugger;
            if(d.result === 'ok'){
                parentObj.remove();
                form.render();
            }else{
                layer.alert('删除失败,请稍后重试');
            }
        },'json')
    });
    var articleId = ppp.getTempData('articleId');

    init();

    $(document).on('click', '.del-img', function(){
       $(this).parent().remove();
    });

    //初始化数据
    function init(){
        $.post(setter.serverUrl+'article/get/label/'+articleId,{}, function(d){
            if(d.code === 500){
                layer.alert('登录失效,情重新登录');
                location.href='';
                return;
            }

            $('#article-title').html(d.title);

            //标签
            let tagArr = d.label;
            $("#add_tag_div").html('');
            for(let i in tagArr){
                //动态添加标签
                let tag_html = `<span data-val="${tagArr[i].id}" class="value-tag layui-btn layui-btn-sm layui-btn-radius" style="margin-left: -5px;">
                            <span><span>${tagArr[i].label}</span></span>
                            <button type="button"  class="layui-btn layui-btn-xs layui-btn-radius  delete_article_tag">
                            <i class="layui-icon">&#xe640;</i>
                            </button>
                        </span>`;
                $("#add_tag_div").append(tag_html);
            }
            form.render();
        },'json');
    }

    form.on('submit(form-reset)', function () {
       init();
    });
});


