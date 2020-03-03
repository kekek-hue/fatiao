function Lay() {
    layui.use(['layer', 'ppp', 'form', 'iconPicker', 'config', 'jquery', 'upload', 'layedit'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var config = layui.config;
        var jq = layui.jquery;
        var data = ppp.getTempData('t_commune_data');
        var imgTextEditor = UE.getEditor('editor');
        var upload = layui.upload;
        var demoListView = $('#demoList');

        var aly = window.sessionStorage.getItem("aly")
        var url
        if (aly == 1) {
            //todo  这里应该是项目的id
            url = '/aly/upload/'
        } else {
            url = 'commune/ask/img/';
        }
        // 获取url中参数
        layui.use(['layer'], function () {
            var router = layui.router();
            projectId = router.search.id;
            $('#id').val(projectId)
        })

        $(document).on('click', '.demo-delete', function(d){
            var filePathId = $(this).attr('data-file-path');
            $(this).parents('tr').remove()
            $('#'+filePathId).remove();
        });

        //缩略图片上传
        var uploadInst = upload.render({
            elem: '#thumbnail',
            url: url,
            data: {
                dir: "commune"
            },
            field: 'file',
            before: function (obj) {
                obj.preview(function (index, file, result) {
                    $('#lowSource').attr('src', result); //图片链接（base64）
                });
            },
            done: function (res) {
                //如果上传失败
                if (res.code != 200) {
                    return layer.msg('上传失败');
                }

                //上传成功
                $("#cover_id").val(res.data.id);
                $('#cover_ext').val(res.data.ext);
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


        //获得所有项目的标签
        function allOccupation() {
            return new Promise((resolve, reject) => {
                ppp.get('occupation/all', {
                    async: true
                }, function (d) {
                    resolve(d);
                });
            })
        }

        //获得所有公社
        function allCommune() {
            return new Promise((resolve, reject) => {
                ppp.get('commune/allLists', {
                    async: true
                }, function (d) {
                    resolve(d.data);
                });
            })
        }

        // 获取公社信息
        function getComment() {
            return new Promise((resolve, reject) => {
                $.get("ask/info", {
                    id: projectId
                }, function (data) {
                    resolve(data);
                }, "json");
            });
        }

        async function setData() {
            var occupation = await allOccupation();
            var commune = await allCommune();
            var projectInfo = await getComment();
 console.log(projectInfo.file_list==undefined)
            var fileList = projectInfo.file_list;


            if(projectInfo.file_list!=undefined ){
                if( fileList.length>0){
                    for(var i in fileList){
                        var val = fileList[i];
                        var pathId = "file-path-"+i;
                        var tr = $(['<tr id="upload-' + i + '">','<td> <input style="width: 500px" type="text" value="'+ val.name+'" name="ppp_file_name[]" placeholder="请输入文件名称"></td>', '<td></td>', '<td>已上传</td>', '<td>', '<button type="button" class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>', '<button type="button" data-file-path="'+pathId+'" class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>', '</td>', '</tr>'].join(''));
                        demoListView.append(tr);
                        $('#project').append(`<input id="${pathId}" type="hidden" name="accessory[]" value="${val.path}"/>`)
                    }
                }
              
            }


            if (projectInfo.code != -1) {
                imgTextEditor.setContent(projectInfo.content);
                $('#lowSource').attr('src', projectInfo.imagePath);

            }
            //获取地区
            let area = occupation.area;
            for (let i in area) {
                let val = area[i];
                let option = `<option value="${val.id}">${val.name}</option>`;
                jq('#area-id').append(option)
            }

            //获取行业
            let trade = occupation.trade;
            for (let i in trade) {
                let val = trade[i];
                let option = `<option value="${val.id}">${val.name}</option>`;
                jq('#trade-id').append(option)
            }

            //获取回报机制
            let reward = occupation.reward;
            for (let i in reward) {
                let val = reward[i];
                let option = `<option value="${val.id}">${val.name}</option>`;
                jq('#reward-id').append(option)
            }

            //所处阶段
            let age = occupation.age;
            for (let i in age) {
                let val = age[i];
                let option = `<option value="${val.id}">${val.name}</option>`;
                jq('#age-id').append(option)
            }

            //项目示范级别/批次
            let level = occupation.level;
            for (let i in level) {
                let val = level[i];
                let option = `<option value="${val.id}">${val.name}</option>`;
                jq('#level-id').append(option)
            }

            for (let i in commune) {
                let val = commune[i];
                let option = `<option value="${val.id}">${val.name}</option>`;
                jq('#commune-id').append(option)
            }

            if (projectInfo.code != -1) {
                form.val('commune-form', projectInfo);
            } else {

            }
            form.render();
        }

        setData();

        // var addAttachementElement = document.getElementById('addAttachement')
        // var attachementElement = document.getElementById('attachement');
        // var buttonElements;
        // addAttachementElement.onclick = function () {
        //     if (attachementElement.children.length < 5) {
        //         var liElement = document.createElement('li');
        //         attachementElement.appendChild(liElement);
        //         var inputElement = document.createElement('input');
        //         inputElement.type = 'file';
        //         inputElement.name = "accessory[]";
        //         liElement.appendChild(inputElement);
        //         var buttonElement = document.createElement('button');
        //         buttonElement.name = 'delete';
        //         buttonElement.innerHTML = '删除';
        //         liElement.appendChild(buttonElement);
        //         buttonElements = document.getElementsByName('delete');
        //         for (var i = 0; i < buttonElements.length; i++) {
        //             buttonElements[i].onclick = function () {
        //                 if (confirm('确认删除吗？')) {
        //                     var liElement = this.parentNode;
        //                     liElement.parentNode.removeChild(liElement);
        //                 }
        //             }

        //         }
        //     } else {
        //         layer.msg('只能添加5个附件！');
        //     }
        // }
        var uploadListIns = upload.render({
                elem: '#testList',
                url: '/aly/uploadAttachment',
                accept: 'file',
                data: {
                    dir: "attachment"
                  },
                field: 'attachment',
                multiple: true,
                auto: false,
                bindAction: '#testListAction',
                choose: function (obj) {
                    var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                    //读取本地文件
                    obj.preview(function (index, file, result) {
                        var tr = $(['<tr id="upload-' + index + '">','<td> <input type="text" value="'+ file.name+'" name="ppp_file_name[]" class="ppp-file-name" id="" placeholder="请输入文件名称"></td>', '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>', '<td>等待上传</td>', '<td>', '<button type="button" class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>', '<button type="button" data-file-path="file-path2-'+index+'" class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>', '</td>', '</tr>'].join(''));
                        //单个重传
                        tr.find('.demo-reload').on('click', function () {
                            obj.upload(index, file);
                        });

                        //删除
                        tr.find('.demo-delete').on('click', function () {
                            delete files[index]; //删除对应的文件
                            tr.remove();
                            uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                        });

                        demoListView.append(tr);
                    });
                },
                done: function (res, index, upload,file) {
                   
                        if (res.code == 200) { //上传成功
                            var tr = demoListView.find('tr#upload-' + index),
                                tds = tr.children();
                            tds.eq(2).html('<span class="ok-ppp" style="color: #5FB878;">上传成功</span>');
                            tds.eq(3).html(''); //清空操作#}
                            $('#project').append(` <input id="file-path2-"${index} type="hidden" name="accessory[]" value="${res.data.url}"/>`)
                            return delete this.files[index]; //删除文件队列已经上传成功的文件
                           
                           
                        }else{
                            this.error(index, upload,res.msg);

                        }
                       
                    }

                    ,
                error: function (index, upload,msg) {
                    var tr = demoListView.find('tr#upload-' + index),
                        tds = tr.children();
                    tds.eq(2).html('<span class="loser" style="color: #FF5722;">上传失败('+msg+')</span>');
                    tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
                }
            });


        // 表单提交事件
        form.on('submit(commune-form-submit)', function (data) {
            if($(".loser").length>0){
                layer.msg("请删除上传失败的文件或重新上传")
                return false;
            }else{}

            //不上传也不能提交
            if($(".ok-ppp").length< $('.ppp-file-name').length){
                layer.msg("请先上传附件")
                return false;
            }else{}

            layer.load(2);
            var communeForm = document.querySelector("#commune-form")
            let formData = new FormData(communeForm);
            formData.append('content', imgTextEditor.getContent())
            var url;
            if (projectId) {
                url = 'ask/update'
                formData.append('id', projectId)
            } else {
                url = 'commune/ask/set'
            }
            
            $.ajax({
                url: config.serverUrl + url,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dateType: 'json',
                beforeSend: function () {
                    console.log("正在进行，请稍候");
                },
                success: function (responseStr) {
                    var res = JSON.parse(responseStr)
                    if (res.code == 200) {
                        layer.msg('成功', {
                            icon: 1
                        });
                        location.href = '#!ask.html';
                    } else {
                        layer.msg(res.msg)

                    }
                    layer.closeAll('loading');

                },
                error: function (responseStr) {
                    console.log("error");
                }
            });

            return false;
        });
    });


    //点击取消跳转到列表页
    $('#ppp-to-list').on('click', function () {
        location.href = '#!ask.html';
    });
} //函数结束