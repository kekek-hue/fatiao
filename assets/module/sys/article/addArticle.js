var atlaseArray = new Array();
var globalId = 0;
var words_arr = new Array();
var is_filter = 0;
var filter_text = '';

function Lay(layui) {
    //atlases(layui)//图集上传
    layui.use(['layer', 'form', 'layedit', 'laydate', 'jquery', 'upload', 'element', 'ppp', 'config',"laypage"], function () {
        var layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate,
            form = layui.form,
            config = layui.config,
            $ = layui.jquery,
            upload = layui.upload,
            element = layui.element,
            ppp = layui.ppp,
            imgTxtContent = null,
            laypage = layui.laypage,
            imgTextEditor = UE.getEditor('editor');
        element.init(); //防止折叠面板失效
        ppp.get('article/generateGlobalId', {
            async: false
        }, function (data) {
            globalId = data.id;
            $("#globalId").val(globalId);
        });
        var articleData = ppp.getTempData('articleInfo');
        //这里以后优化---------->
        ///if(!articleData){
        var articleId = ppp.getTempData('articleId');
        // ppp.get('article/getArticleById/' + articleId + '/1', {async: false}, function (data) {
        //     articleData = data.newData;
        //     imgTxtContent = data.imgTxtContent;
        //     ppp.putTempData('articleInfo', articleData);
        // });
        //}//获得数据结束
        // if (articleData) {
        //     form.val('article-form', articleData);
        //     var imgPath = config.imgUrl + articleData.face_res_id;
        //     $("#lowSource").attr('src', imgPath);
        //     $("#facePath").val(imgPath);
        //     imgTextEditor.addListener('ready', function (editor) {
        //         imgTextEditor.setContent(imgTxtContent);
        //     })
        //     imgTextEditor.addListener("blur", function () {
        //         var texts = imgTextEditor.getContentTxt();
        //         alert(texts);
        //         check_words(texts);
        //     })
        //     form.render();
        // }
        var get_words = function () {
            $.get("sensitive_words/check_works", {
                words: ''
            }, function (data) {
                words_arr = data;
                // console.log(words_arr);
            }, "json");
        };
        get_words();

        imgTextEditor.addListener('ready', function (editor) {
            // imgTextEditor.setContent(imgTxtContent);
        });

        imgTextEditor.addListener("blur", function () {
            var texts = imgTextEditor.getContentTxt();
            check_words(texts);
        })
        //检查
        var check_words = function (words) {
            is_filter = 0;
            filter_text = '';
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
                layer.msg('该内容当中有敏感词，请注意删除');
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
        //发布
        laydate.render({
            elem: '#publish-btn',
            type: 'datetime',
            theme: '#1E9FFF',
            value: new Date()
        });
        //全文搜索功能
        form.on('select(tag-search)', function (data) {});

        //分类属性
        function getTypes() {
            $.get("../../scheme/lists?article_id=" + globalId, function (data) {
                var data = data.result;
                data.forEach(function (value, i) {
                    //动态添加分类
                    //if(type_id == value.id){
                    //var html = '<input type="radio" name="type_id" value='+value.id+' checked title="'+value.name+'" lay-skin="primary">';
                    //}else{
                    var html = '<input type="radio" name="type_id" value=' + value.id + '  title="' + value.name + '" lay-skin="primary">';
                    //}
                    $("#types-div").append(html);
                    //动态添加父级分类
                    var optionHmtl = ' <option  data-grade=' + value.grade + ' value="' + value.id + '">' + value.name + '</option>';
                    $("#add-type-parent_id").append(optionHmtl);

                })
                form.render();
            }, "json");
        }


        //获取系统标签
        function getTags() {
            var re = {
                type: 0,
                limit: 20
            };
            $.post("../../tags/lists", re, function (data) {
                // laypage.render({
                //     elem: 'pagebox',
                //     count: data.total //数据总数，从服务端得到
                //         ,
                //     limit: data.pageSize,
                //     curr: curr,
                //     layout: ['prev', 'page', 'next', 'skip'],
                //     jump: function (obj, first) {
                //         if (!first) {
                //             var curr = obj.curr;
                //             getTags(curr);
                //         }
                //     }
                // });
                var data = data.data;
                data.forEach(function (value, i) {
                    var html = '<input type="checkbox" name="tagId[]" value=' + value.id + '  title="' + value.name + '" lay-skin="primary">';
                    $("#add_tag_div").append(html);
                })
                form.render();
            }, 'JSON');
        }
        getTags();

        //添加新分类
        $("#add_type_btn").on('click', function () {
            let selectObj = $("#add-type-parent_id  option:selected");
            let pid = selectObj.val();
            let top_id = selectObj.val();
            let name = $("#add_type_name").val();
            let grade = selectObj.attr("data-grade") + 1;
            let typeObj = {
                pid: pid,
                top_id: top_id,
                grade: grade,
                name: name,
            };
            $.post("../../news/type/add", typeObj, function (data) {
                if (data.code == 200) {
                    //动态添加分类
                    var html = '<input type="checkbox" name="types" value=' + data.data + ' title="' + name + '" lay-skin="primary">';
                    $("#types-div").append(html);
                    layer.msg('添加成功');
                    form.render();
                } else {
                    layer.msg(data.msg);
                }
            }, "json");
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
            content: function () {
                alert(layedit.getContent(routineInformationEdit)); //获取编辑器内容
            },
            text: function () {
                alert(layedit.getText(routineInformationEdit)); //获取编辑器纯文本内容
            },
            selection: function () {
                alert(layedit.getSelection(routineInformationEdit));
            }
        };
        //编辑属性弹出层
        $('.edit-attr').on('click', function () {
            layer.open({
                type: 1,
                title: '快速属性操作',
                shade: 0.8,
                shadeClose: true, //点击遮罩关闭
                content: $('.form-dv').html()
            });
        });
        //更新时间
        laydate.render({
            elem: '#date',
            theme: '#1E9FFF'
        });
        form.on('radio(article-type)', function (data) {
            //判断单选框的选中值
            if (data.value == 1) {
                $(".imageTxt").removeClass('layui-hide');
                $(".atlases-div").addClass('layui-hide');
            } else if (data.value == 2) {
                $(".imageTxt").addClass('layui-hide');
                $(".atlases-div").removeClass('layui-hide');
            }
        });
        /*常规信息添加
          监听提交
        */
        form.on('submit(routineInformation)', function (data) {

            var editContent = imgTextEditor.getContent();
            var data = data.field;
            var likes = Array();
            $("input:checkbox[name='like']:checked").each(function (i) {
                likes[i] = $(this).val();
            });
            var atlasesData = new Array();
            for (var value of atlaseArray) {
                atlasesData.push(value);
                // console.log(value);
            }
            if (editContent == '') {
                layer.msg('内容不能为空');
                return false;
            }
            // console.error(paramData);
            if (is_filter > 0) {
                layer.msg('该内容当中有敏感词，请删除');
                return false;
            }
            let tags = [];
            $(".tags-val-two").each(function (i, n) {
                var val = $(this).val();
                tags.push(val);
            });
            var tagString = tags.join(',');
            data["tagString"] = tagString;

            $.post("/article/add/1", data, function (data) {
                console.log("11111")
                layer.msg(data.msg);
                // if (data.code == 200) {
                //     layer.msg('添加成功');
                //     location.href = '#!auditList.html';
                // } else {
                //     layer.msg('添加失败');
                // }
            }, "json");
            return false;
        });
        //缩略图片上传
        var uploadInst = upload.render({
            elem: '#thumbnail',
            url: 'article/imgUpload/' + globalId,
            field: 'file',
            before: function (obj) {
                obj.preview(function (index, file, result) {
                    $('#lowSource').attr('src', result); //图片链接（base64）
                });
            },
            done: function (res) {
                //如果上传失败
                if (res.code > 0) {
                    return layer.msg('上传失败');
                }
                //上传成功
                $("#cover_id").val(res.data.id);
                console.error(res.data);
                //$('#facePath').val(config.imgUrl+res.data.src[0][0]);
            },
            error: function () {
                //演示失败状态，并实现重传
                var demoText = $('#failText');
                demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                demoText.find('.demo-reload').on('click', function () {
                    uploadInst.upload();
                });
            }
        });

        /*高级参数添加
         */
        form.on('submit(advancedParameter)', function (data) {
            var advPara = {
                "advPara": JSON.stringify(data.field)
            };
            console.log(advPara);
            $.post("advParam", advPara, function (data) {
                if (data.code == 200) {

                } else {

                }
            }, "json");
            return false;
        });
        form.render();

        form.render();

        //添加标签 文章隐性标签
        $("#add_tag_btn").on('click', function () {
            let name = $("#add_tag").val();
            // let nameText = $("#add_tag").find("option:selected").text();
            //动态添加标签
            let tag_html = `<span class="layui-btn layui-btn-sm layui-btn-radius" style="margin-left: -5px;">
                                <span><span>${name}</span></span>
                                <input type="hidden" class="tags-val-two" name="tags[]" value="${name}">
                                <button type="button"  class="layui-btn layui-btn-xs layui-btn-radius  delete_article_tag">
                                <i class="layui-icon">&#xe640;</i>
                                </button>
                            </span>`;
            $("#add_tag_div").append(tag_html);
            $("#add_tag").val('');
            form.render();
        });

        //删除标签
        $(document).on('click', '.delete_article_tag', function () {
            $(this).parent('span').remove();
            form.render();
        });



    });
}