function Lay(layui) {

    layui.use(['layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form', 'upload', 'config', 'ppp'], function () {
        var laypage = layui.laypage //分页
            ,
            table = layui.table //表格
            ,
            jq = layui.jquery,
            form = layui.form,
            layedit = layui.layedit,
            laydate = layui.laydate,
            upload = layui.upload,
            config = layui.config,
            ppp = layui.ppp;

        var occupation;
        let communeArray; //所有公社

        //公社列表
        ppp.get('commune/allLists', {async: false}, function (data) {
            if(data.code == 0){
                var communeData = data.data;
                communeData.forEach(function(value,i){
                    let opt ="<option value="+value.id+">"+value.name+"</option>";
                    $("#commune").append(opt);
                });
                form.render('select', 'ask-form');
            }else{
                // communeArray = res.commune;
                // if (communeArray == null) {
                //
                // } else {
                //     let option = '<option value="">请选择公社</option>';
                //     for (let c of communeArray) {
                //         option += `<option value="${c.id}">${c.name}</option>`;
                //     }
                //     jq('#commune').html(option);
                // }
            }
        });

        //执行一个 table 实例
        var askTable = table.render({
            elem: '#communeAsk-table'
            // , url: config.serverApiUrl + 'admin/commune/ask/list' //数据接口
            ,
            url: '/commune/ask/lists' //数据接口
            ,
            cellMinWidth: 80,
            parseData: function (res) { //res 即为原始返回的数据
                if (res.isCommune == 1) {
                    $('.is-commune').hide();
                }
                occupation = res.occupation;

                return {
                    "code": 0, //解析接口状态
                    "count": res.total, //解析数据长度
                    "data": res.data //解析数据列表
                };
            },
            title: '文章列表',
            page: true //开启分页
            ,
            limit: 15 //每页默认显示的数量
            ,
            limits: [15, 30, 45],
            toolbar: '#commune-add-toolbar',
            cols: [
                [ //表头
                    {
                        type: 'checkbox',

                    }, {
                    field: 'id',
                    title: 'ID',
                    sort: true,
                    width: 180
                }, {
                    field: 'title',
                    title: '公告名称',
                    width: 280
                }, {
                    field: 'type',
                    title: '类型',
                    sort: true,
                    templet: function (d) {
                        if (d.type == 1) {
                            return '社问';
                        }
                        if (d.type == 2) {
                            return '公告';
                        }
                        if (d.type == 3) {
                            return '动态';
                        }
                        if (d.type == 4) {
                            return '新闻';
                        }
                        if (d.type == 5) {
                            return '项目';
                        }
                        if (d.type == 6) {
                            return '问题';
                        }
                        if (d.type == 7) {
                            return '政策法规';
                        }
                    },

                }, {
                    field: 'create_time',
                    title: '创建时间',
                    width: 163
                }, {
                    field: 'name',
                    title: '公社'
                }, {
                    field: 'tid',
                    title: '置顶',
                    templet: function (d) {
                        if (d.tid) {
                            return '是';
                        } else {
                            return '否';
                        }
                    }
                },
                    //  {
                    //     field: 'begin_time',
                    //     title: '置顶开始时间',
                    //     templet: function (d) {
                    //         if (d.begin_time) {
                    //             return d.begin_time;
                    //         } else {
                    //             return '-';
                    //         }
                    //     }
                    // }, {
                    //     field: 'end_time',
                    //     title: '置顶结束时间',
                    //     templet: function (d) {
                    //         if (d.end_time) {
                    //             return d.end_time;
                    //         } else {
                    //             return '-';
                    //         }
                    //     }
                    // },
                    {
                        field: 'image_url',
                        title: 'image_url',
                        templet: function (d) {
                            return `<img style="height:50px" data-img="${d.image_url}" src="${d.image_url}">`;
                        },
                        width:150
                    }, {
                    field: 'status',
                    title: '审核状态',
                    templet: function (d) {
                        if (d.status == 1) {
                            return '待审核';
                        }
                        if (d.status == 2) {
                            return '审核通过';
                        }
                        if (d.status == 3) {
                            return '审核不通过';
                        }
                    },
                    width: 200
                }, {
                    fixed: 'right',
                    align: 'center',
                    title: '操作',
                    toolbar: '#barDemo',
                    width: 280
                }
                ]
            ],
            done: function (res, curr, count) {
                ppp.hoverOpenImg();
            }
        });

        /*
         * 编辑内容
         */
        let openEdit = function (data) {
            let tempData = {};
            tempData.occupation = occupation;
            tempData.commune = communeArray;
            if (data) {
                //原有的数据
                tempData.data = data;
            } else {

            }
            ppp.putTempData('t_commune_data', tempData);

            location.href = '#/setAskForm/id=' + data.id + '/.html';
        };

        // 表格操作列事件
        table.on('toolbar(communeAsk-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            switch (layEvent) {
                case 'add':
                    location.href = '#!setAskForm';
                    break;
            }
        });


        table.on('tool(communeAsk-table)', function (obj) {
            var data = obj.data;
            console.log(obj.event)
            switch (obj.event) {
                case 'op-pass': //审核通过
                    communeAskSet(data, 2);
                    break;
                case 'op-not': //审核不通过
                    communeAskSet(data, 3);
                    break;
                case 'op-top': //置顶
                    communeAskTop(data);
                    break;
                case 'op-cancel-top':
                    cancelTop(data);
                    break;
                case 'op-del': //删除
                    delcproject(data, 3);
                    break;
                case 'update-attr': //删除
                    openEdit(data);
                    ;
                    break;
            }
        });

        //置顶公告
        var communeAskTop = function (data) {
            ppp.putTempData('commune_ask_data', data);
            ppp.popupCenter({
                title: '置顶公告',
                path: 'components/views/commune/askTop.html',
                finish: function () {
                    table.reload('communeAsk-table');
                }
            });
        };

        var communeAskSet = function (data, type) {
            var titl = '确定审核通过吗？';
            if (type == 3) {
                titl = '确定审核 不通过吗？';
            }
            layer.confirm(titl, function (index) {
                jq.post("/commune/ask/status", {
                    id: data.id,
                    type: type
                }, function (data) {
                    // console.log(data);
                    table.reload('communeAsk-table');
                    layer.msg(data.msg);
                }, "json");
            });
        }

        //取消置顶
        var cancelTop = function (data) {
            var titl = '确定取消置顶？';

            layer.confirm(titl, function (index) {
                jq.post(config.serverUrl + "commune/ask/cancel/top", {
                    id: data.tid
                }, function (data) {
                    table.reload('communeAsk-table');
                    layer.msg(data.msg);
                }, "json");
            });
        }
        //删除项目
        var delcproject = function (data) {
            var titl = '确定删除项目？';

            layer.confirm(titl, function (index) {
                jq.post(config.serverUrl + "commune/ask/delete", {
                    id: data.id
                }, function (data) {
                    table.reload('communeAsk-table');
                    layer.msg(data.msg);
                }, "json");
            });
        }
        form.on('submit(ask-form-submit)', function (data) {
            askTable.reload({
                where: data.field
            });
        });
        // 搜索按钮点击事件
        // $('#search_ask').click(function () {
        //     let title = $("#title").val();
        //     askTable.reload({where: {'s': title}});
        // });

        //分页
        laypage.render({
            elem: 'pageDemo' //分页容器的id
            ,
            count: 100 //总页数
            ,
            skin: '#1E9FFF' //自定义选中色值
            //,skip: true //开启跳页
            ,
            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
            jump: function (obj, first) {
                if (!first) {
                    layer.msg('第' + obj.curr + '页', {
                        offset: 'b'
                    });
                }
            }
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