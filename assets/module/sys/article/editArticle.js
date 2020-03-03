function Lay(layui) {
    layui.use(['layer', 'form', 'layedit', 'laydate', 'jquery', 'upload', 'element', 'ppp', 'config', 'setter', "laypage"], function () {
        var layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate,
            form = layui.form,
            config = layui.config,
            $ = layui.jquery,
            upload = layui.upload,
            element = layui.element,
            ppp = layui.ppp,
            laypage = layui.laypage,
            imgTextEditor = UE.getEditor('editor'),
            setter = layui.setter;
        var is_filter = 0;
        element.init(); //防止折叠面板失效

        var articleId = ppp.getTempData('articleId');
        var role = config.getRole();
        // alert(role);

        //获取文章信息
        function articleInfo() {
            return new Promise((resolve, reject) => {
                ppp.get('article/getArticleById/' + articleId + '/1', {
                    async: false
                }, function (info) {
                    resolve(info);
                });
            });
        }

        //获取所有标签
        function allTag(curr) {
            return new Promise((resolve, reject) => {
                $.post(setter.serverUrl + 'tags/lists', {
                    type: 0,
                    limit: 20,
                    page: curr
                }, function (data) {
                    resolve(JSON.parse(data));
                });
            });
        }
        //获取所有来源
        function allSource(curr) {
            return new Promise((resolve, reject) => {
                $.post(setter.serverUrl + 'article/source/list', {}, function (data) {
                    resolve(JSON.parse(data));
                });
            });
        }

        //获取所有分类
        function getCategory() {
            return new Promise((resolve, reject) => {
                ppp.get('category/getList', {
                    async: true
                }, function (d) {
                    if (d.status == 200) {
                        resolve(d.result);
                    } else {
                        reject('category error');
                    }
                });
            })
        }


        /***
         * @des 获取敏感词
         */
        function get_words() {
            return new Promise((resolve, reject) => {
                $.get("sensitive_words/check_works", {
                    words: ''
                }, function (data) {
                    resolve(data);
                }, "json");
            });
        }

        //检查
        var check_words = function (words, words_arr) {
            if (words.length < 1) {
                return false;
            } else {

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
        $('.ppp-back').on('click', function () {
            if(role==226){
                location.replace("./#!imageText.html")
            }else{
            location.href = '#!auditList';
            }
        });
        var likes = Array();
        var checkedTxt = '';

        //处理数据
        async function dealData(curr) {
            try {
                //文章信息

                var info = await articleInfo();

                //渲染来源article/source/list
                var sourceList = await await allSource();
                //分类
                var category = await getCategory();
                //敏感词
                var words = await get_words();

                var category_id = 0;

                if (info !== undefined && info.imgTxtContent && info.imgTxtContent.data !== '') {
                    //当info存在,newData也存在的时候才这么做
                    category_id = info.newData.category_id;

                    //设置文章内容的编辑器
                    var imgTxtContent = info.imgTxtContent.data;
                    imgTextEditor.setContent(imgTxtContent);
                   

                    //检查敏感词
                    check_words(imgTxtContent, words);

                    //渲染文章数据到form表单中
                    var articleData = info.newData;
                    $("#lowSource").attr("src", articleData.coverPath);
                    $("#cover_id").val(articleData.cover_id);
                    $("#cover_ext").val(articleData.image_ext);
                    form.val('article-form', articleData);
                } else {

                }

                //渲染分类
                category.forEach(function (value, i) {
                    var checked;
                    if (value.id == category_id) {
                        checked = 'checked';
                    } else {
                        checked = '';
                    }

                    //外在形象的提升,内在品质的改善
                    var radioHtml = `<input type="radio" name="category_id" value="${value.id}" ${checked} title="${value.name}" lay-skin="primary">`;
                    $("#category-id").append(radioHtml);
                });

                if (sourceList !== null) {
                    for (var i = 0; i < sourceList.length; i++) {
                        $("#source_type_id").append("<option value='" + sourceList[i].id + "'>" + sourceList[i].name + "</option>");
                    }
                }
                //渲染文章数据到form表单中
                var articleData = info.newData;
                form.val('article-form', articleData);
                form.render();

            } catch (e) {
                console.error('错了:');
                console.log(e);
            }
        }
        var tagArr = [];

        async function tagall(curr) {
            $("#add_tag_div").html("")
            //文章信息
            var info = await articleInfo();
            //标签
            var tag = await allTag(curr);
            if (tag && tag.data.length > 0) {
                //文章已经有的标签
                var labels = info.tags;
                //渲染标签
                tag.data.forEach(function (value, i) {
                    for (let l in labels) {
                        var v = labels[l].tag_id;
                        if (v === value.id) {
                            tagArr.push(v)
                        }
                    }
                    //已有的标签为选中状态
                    laypage.render({
                        elem: 'pagebox',
                        count: tag.total //数据总数，从服务端得到
                            ,
                        limit: tag.pageSize,
                        curr: curr,
                        layout: ['prev', 'page', 'next', 'skip'],
                        jump: function (obj, first) {
                            if (!first) {
                                var curr = obj.curr;
                                tagcheck(curr);
                            }
                        }
                    });
                    var checkedTxt = ""
                    for (let l in tagArr) {
                        var v = tagArr[l];
                        if (v === value.id) {
                            checkedTxt = 'checked';
                        }
                    }
                    //动态添加分类
                    var html = '<input type="checkbox" ' + checkedTxt + ' name="checktagId" value=' + value.id + '  title="' + value.name + '" lay-skin="primary" lay-filter="yuan">';
                    $("#add_tag_div").append(html);


                })
            }
            form.render();

        };
        async function tagcheck(curr) {
            //标签
            var tag = await allTag(curr);
            $("#add_tag_div").html("");
            if (tag && tag.data.length > 0) {
                //渲染标签
                tag.data.forEach(function (value, i) {
                    //已有的标签为选中状态
                    var checkedTxt = '';
                    for (let l in tagArr) {
                        var v = tagArr[l];
                        if (v == value.id) {
                            checkedTxt = 'checked';
                        }
                    }
                    //动态添加分类
                    var html = '<input type="checkbox" ' + checkedTxt + ' name="tagId" value=' + value.id + '  title="' + value.name + '" lay-skin="primary" lay-filter="yuan">';
                    $("#add_tag_div").append(html);
                })
            }
            form.render();

        };
        tagall()
        form.on('checkbox(yuan)', function (data) {
            console.log(data.elem.checked)
            var islike = 1;
            var spliceNum;
            if (tagArr.length == 0) {
                tagArr.push(data.value)
            }
            for (let l in tagArr) {
                var v = tagArr[l];
                if (v != data.value) {
                    islike = 2
                } else {
                    spliceNum = l;
                    islike = 1
                }
            }
            console.log(spliceNum)
            if (spliceNum) {
                if (data.elem.checked == false) {
                    tagArr.splice(spliceNum, 1)
                }
            } else {
                if (islike == 2) {
                    tagArr.push(data.value)
                } else {}

            }

            console.log(tagArr)
        });
        //提交文章的编辑
        /*常规信息添加
            监听提交
        */
        var token;

        function getToken() {
            return new Promise((resolve, reject) => {
                $.get("get/token", {

                }, function (data) {
                    resolve(data);
                }, "json");
            });
        }
        async function getTokenfun() {
            var tokenStr = await getToken();
            token = tokenStr.token;
        }
        getTokenfun()
        var commit = 1
        form.on('submit(article-form)', function (d) {
            if (commit == 2) {
                return
            }
            commit = 2
            //数据库字段
            var data = d.field;
            data.file = $("#cover_id").val();
            data.subToken = token;
            var editContent = imgTextEditor.getContent();
            data.editContent = editContent;

            var tagString = tagArr.join(',');;
            data.tags = tagString;
            if (is_filter > 0) {
                layer.msg('该内容当中有敏感词，请删除');
                return false;
            }
            //添加文章
            var url = 'article/add/1';
            if (articleId) {
                //编辑文章
                url = "article/save";
            }
            $.post(setter.serverUrl + url, data, function (a) {
                if (a.code == 200) {
                    if(role==226){
                        location.replace("./#!imageText.html")
                    }else{
                    layer.msg('成功');
                    //  ppp.putTempData('articleInfo', data.id);
                    location.href = '#/preview/id=' + a.id + '/type=1/' + ppp.getTimestamp() + '.html';
                    }
                } else {
                    getTokenfun();
                    layer.msg(a.msg);
                }
                commit = 1
            }, "json");



            return false;
        });


        dealData();
        var aly = window.sessionStorage.getItem("aly");
        console.log(aly)
        var url
        if (aly == 1) {
            url = '/aly/upload/'
        } else {
            url = 'article/imgUpload/' + globalId
        }

        //缩略图片上传
        var uploadInst = upload.render({
            elem: '#thumbnail',
            url: url,
            field: 'file',
            data: {
                dir: "article"
            },
            before: function (obj) {
                layer.load();
                obj.preview(function (index, file, result) {
                    $('#lowSource').attr('src', result); //图片链接（base64）
                });
            },
            done: function (res) {
                //如果上传失败
                console.log(res.code != 200 || (res.code != 0))
                if (res.code == 200 || (res.code == 0) ) {
                    $("#cover_id").val(res.data.id);
                    $("#cover_ext").val(res.data.ext);
                }else{
                    return layer.msg('上传失败');
                }
                layer.closeAll();
                //上传成功
               
                //$('#facePath').val(config.imgUrl+res.data.src[0][0]);
            },
            error: function () {
                //演示失败状态，并实现重传
                var demoText = $('#failText');
                demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                demoText.find('.demo-reload').on('click', function () {
                    uploadInst.upload();
                });
                layer.closeAll();
            }
        });
    });
}