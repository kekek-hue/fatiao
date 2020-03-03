layui.use(['setter', 'layer', 'form', 'layedit', 'laydate', 'jquery', 'upload', 'element', 'ppp', 'config',"laypage"], function () {
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
        laypage = layui.laypage,
        imgTxtContent = null;
    //普通图片上传
    
    

    /***
     * @des 获取敏感词
     */
    function get_words () {
        return new Promise((resolve, reject)=>{
            $.get("sensitive_words/check_works", {words: ''}, function (data) {
                resolve(data);
            }, "json");
        });
    }

    //检查
    var check_words = function (words, words_arr) {
        if(words.length<1){
            return false;
        }else{

        }

        var arr = [];
        for (var i = 0; i < words_arr.length; i++) {
            var r = new RegExp(words_arr[i], "ig");
            var k1 = r.exec(words);
            if (k1 != null) {
                // filter_text=filter_text+k1+',';
                // filter_text = filter_text.replace(filter_text, "");
                if (!arr.hasOwnProperty(k1[0])) {
                    arr.push(k1[0]);
                }
                is_filter = is_filter + 1;
            }
        }
        filter_text = uniques(arr);
        if (is_filter > 0) {
            $('#filter_text').show();
            $('#filter_text').find('.text').html(filter_text);
            layer.msg('该内容当中有敏感词，请注意');
        } else {
            $('#filter_text').hide();
            $('#filter_text').find('.text').html('');
        }
    };


    //去除重复并转换成字符串
    function uniques(arr) {
        var hash = [];
        for (var i = 0; i < arr.length; i++) {
            if (hash.indexOf(arr[i]) == -1) {
                hash.push(arr[i]);
            }
        }
        return hash.join(',');
    }

    //点击返回
    $('.ppp-back').on('click', function(){
        location.href = '#!imageText.html';
    });
    
     //获取文章信息
     function articleInfo() {
        return new Promise((resolve, reject) => {
            ppp.get('basis/info', {async: false}, function (info) {
                resolve(info);
            });
        });
    }

dealData()
    //处理数据
    async function dealData() { 
        try {
            //文章信息
            var info = await articleInfo();

            //渲染文章数据到form表单中
         
            form.val('article-form', info[0]);
            form.render();

        } catch (e) {
            console.error('错了:');
            console.log(e);
        }
    }
   

    // init();

    $(document).on('click', '.del-img', function(){
       $(this).parent().remove();
    });

    //初始化数据
    function init(){
        $.post(setter.serverUrl+'article/pic/get/'+articleId,{}, function(d){
            if(d.code === 500){
                layer.alert('登录失效,情冲才能登录');
                location.href='';
                return;
            }
            // console.error(d)
            let allCategory = d.allCategory;

            //所有分类
            for(let v of allCategory){
                $('#category').append(`<option  value="${v.id}">${v.name}</option>`)
            }

            form.val('article-form', d);

            //图片
            var imageArr = d.imageArr;
            $('#demo2').html('');
            for(let i in imageArr){
                $('#demo2').append(`<div class="value-image" data-val="${imageArr[i].id}">
<img style="width: 192px;height: 108px" src="${imageArr[i].url}" alt="${imageArr[i].id}" class="layui-upload-img">
<input type="hidden" name="images_ids[]" value="${imageArr[i].id}"/>
<label for="image-${imageArr[i].id}">描述:</label>
<input type="text" id="image-${imageArr[i].id}" name="alt[${imageArr[i].id}]" value="${imageArr[i].alt}">
<input type="hidden" name="ext[${imageArr[i].id}]" value="${imageArr[i].ext}">
<span style="cursor: pointer;" class="del-img">删除</span>
</div>`);
            }

            //封面
            $('#demo1').attr('src', d.cover_url);

            //标签
            let tagArr = d.tagArr;
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

    form.on('submit(form-reset)', function (data) {
       init();
    });

    form.on('submit(form-submit)', function (data) {
        var reqData = data.field;
        // delete reqData.add_tag;
        // delete reqData.file;
        // if(reqData.cover_id === ''){
        //     layer.alert('请上传封面');
        //     return false;
        // }

        // //标签
        // let images = [];
        // $('.value-image').each(function(i,n){
        //     var val = $(n).attr('data-val');
        //     images.push(val);
        // });

        // var imageString = images.join(',');

        // reqData['imageString'] = imageString;
        $.post('basis/update',reqData,function(d){
            if(d.code===200){
                layer.open({
                    content: '修改成功',
                    yes: function(index, layero){
                        // location.href = '#!atlases.html';
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                    }
                });
            }else{
                layer.alert(d.msg)
            }
        },'json');
    });
});


