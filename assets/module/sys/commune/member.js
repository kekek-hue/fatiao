function Lay(layui) {

    layui.use(['layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form', 'upload', 'config', 'ppp'], function () {
        var laypage = layui.laypage //分页
            , table = layui.table //表格
            , form = layui.form
            , layedit = layui.layedit
            , laydate = layui.laydate
            , upload = layui.upload
            , config = layui.config
            , ppp = layui.ppp;

        var $ = layui.jquery;

        var isCommuneAdmin = false;//是不是公社管理员
        //执行一个 table 实例
        var communeTable = table.render({
            elem: '#commune-member-table'
            , url: config.serverUrl + 'commune/user/list' //数据接口
            , parseData: function (res) { //res 即为原始返回的数据
                isCommuneAdmin = res.roleId == '1';
                //如果是公社管理员就隐藏
                if(isCommuneAdmin){
                    isCommuneAdmin=true;
                    $('#commune-select').hide();
                }else{
                    isCommuneAdmin=false;
                    $('#commune-select').show();
                }

                return {
                    "code": 0, //解析接口状态
                    "count": parseInt(res.data.total),
                    "data": res.data.data //解析数据列表
                };
            }
            , title: '文章列表'
            , page: true //开启分页
            , limit: 15 //每页默认显示的数量
            , limits: [15, 30, 45]
            , cols: [[ //表头
                {field: 'id', title: '用户ID', sort: true}
                , {field: 'nickname', title: '成员姓名'}
                , {
                    field: 'status', title: '审核', templet: function (d) {
                        if (d.status == 1) {
                            return '<font style="color:blue">待审</font>';
                        }
                        if (d.status == 2) {
                            return '<font style="color:green">通过</font>';
                        }
                        if (d.status == 3) {
                            return '<font style="color:blue">不过</font>';
                        }
                        if (d.status == 0) {
                            return '<font style="color:blue">离开</font>';
                        }
                    }
                }
                , {field: 'c_name', title: '公社名称'}//是公社管理员就不显示
                , {title: '操作', toolbar: '#barDel'}
            ]]
        });

        // 表格操作列事件
        table.on('toolbar(person-area-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            var type = $("#edit").data("edit-type");
            var pppTitle = $("#edit").data("edit-title");
            switch (layEvent) {
                case 'add':
                    openEdit(data, 'addArea', pppTitle);
                    break;
            }
            ;
        });

        //公社社员删除
        table.on('tool(commune-member-table)', function (obj) {
            console.log(obj.data);
            var userId = obj.data.id;
            var communeId = obj.data.communeId;
            console.log(communeId);
            switch (obj.event) {
                case 'not'://不过
                    layer.confirm('确定？', function (index) {
                        $.ajax({
                            url: config.serverUrl + 'commune/user/status',
                            type: 'POST',
                            data: {userId: userId, communeId: communeId, status:'3'},
                            dataType: "json",
                            success: function (e) {
                                if (e.code == 200) {
                                    layer.alert('修改成功');
                                    communeTable.reload();
                                } else {
                                    layer.msg('失败');
                                }
                            },
                            error: function (e) {
                                //console.log(e);
                            }
                        });
                        layer.close(index);
                    });
                    break;
                case 'pass'://通过
                    layer.confirm('确定？', function (index) {
                        $.ajax({
                            url: config.serverUrl + 'commune/user/status',
                            type: 'POST',
                            data: {userId: userId, communeId: communeId, status:'2'},
                            dataType: "json",
                            success: function (e) {
                                if (e.code == 200) {
                                    layer.alert('修改成功');
                                    communeTable.reload();
                                } else {
                                    layer.msg('失败');
                                }
                            },
                            error: function (e) {
                                //console.log(e);
                            }
                        });
                        layer.close(index);
                    });
                    break;
                case 'commune_del':
                    if (userId == 0 || userId == null) {
                        layer.msg('请选择用户');
                        return false;
                    }
                    layer.confirm('确定拒绝？', function (index) {
                        $.ajax({
                            url: config.serverUrl + 'commune/del',
                            type: 'POST',
                            data: {userId: userId, communeId: communeId},
                            // processData: false,
                            // contentType: false,
                            dataType: "json",
                            success: function (e) {
                                if (e.code == 200) {
                                    layer.alert('修改成功');
                                    communeTable.reload();
                                } else {
                                    console.log(e)
                                    layer.msg('失败');
                                }
                            },
                            error: function (e) {
                                //console.log(e);
                            }
                        });
                        layer.close(index);
                    });
                    break;
                case 'addCompany':
                    break;
            }
            ;
        });

        table.on('tool(person-area-table)', function (obj) {
            var data = obj.data;
            var type = $("#edit").data("edit-type");
            var pppTitle = $("#edit").data("edit-title");
            switch (obj.event) {
                case 'delete-attr':
                    deleteData(data);
                    break;
                case 'edit-attr':
                    openEdit(data, type, pppTitle);
                    break;

            }
        });

        //分页
        laypage.render({
            elem: 'pageDemo' //分页容器的id
            , count: 0 //总页数
            , skin: '#1E9FFF' //自定义选中色值
            //,skip: true //开启跳页
            , layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
            , jump: function (obj, first) {
                if (!first) {
                    layer.msg('第' + obj.curr + '页', {offset: 'b'});
                }
            }
        });

        /*
        *编辑内容
        */
        let openEdit = function (data, type, title) {
            if (data) {
                ppp.putTempData('person-form', data);
            }

            ppp.putTempData('person-type', type);

            ppp.popupCenter({
                title: data ? '修改' + title + '详情' : '添加' + title,
                path: 'components/views/find/form.html',
                finish: function () {
                    // renderTable();
                }
            });
        };

        let deleteData = function (data) {
            let formData = new FormData();
            formData.append("id", data.id);
            $.ajax({
                url: config.serverApiUrl + 'occupation/del',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: "json",
                success: function (data) {
                    if (data.result == "ok") {
                        layer.msg('删除成功', {icon: 1});
                        location.reload();
                    } else {
                        layer.msg('修改失败', {icon: 2});
                    }
                },
                error: function (responseStr) {
                    console.log("error");
                }
            });
        };

        // 获取所有角色 渲染公社列表
        ppp.get('options/commune', {}, function (data) {
            commune_list = data;
            //渲染公社列表
            data.forEach(function (value, i) {
                var select = '';
                var optionHmtl = ' <option  data-grade=' + value.id + ' value="' + value.id + '"  ' + select + '>' + value.name + '</option>';
                $("#user-commune").append(optionHmtl);
            })
            form.render();
        });
        // 搜索按钮点击事件
        $('#user-btn-search').click(function () {
            communeTable.reload({where: ppp.getSearchForm()});
        });

        /*
        *关闭当前窗口
        */
        function closeDialog() {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }
    });
}
   