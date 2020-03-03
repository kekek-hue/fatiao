function Lay(layui) {

    layui.use(['layedit', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form', 'upload', 'config', 'ppp'], function () {
        var laypage = layui.laypage //分页
            , table = layui.table //表格
            , jq = layui.jquery
            , form = layui.form
            , layedit = layui.layedit
            , laydate = layui.laydate
            , upload = layui.upload
            , config = layui.config
            , ppp = layui.ppp;

        let communeArray;//所有公社
        let userData;//用户信息
        //执行一个 table 实例
        var askTable = table.render({
            elem: '#communeAsk-table'
            , url: '/topic/list' //数据接口
            , parseData: function (res) { //res 即为原始返回的数据

                userData = res.users;//用户信息
                communeArray = res.communeList;//公社信息

                if (res.users.role_id == 1) {//若果是公社管理员就隐藏公社
                    $('.is-commune').hide();
                }else{//不是的话就渲染公社
                    let option = '<option value="">请选择公社</option>';
                    for (let c of communeArray) {
                        option += `<option value="${c.id}">${c.name}</option>`;
                    }
                    jq('#commune').html(option);
                    form.render('select', 'ask-form');
                }

                return {
                    "code": 0, //解析接口状态
                    "count": res.total, //解析数据长度
                    "data": res.data //解析数据列表
                };
            }
            ,method: 'post'
            , title: '文章列表'
            , page: true //开启分页
            , limit: 15 //每页默认显示的数量
            , limits: [15, 30, 45]
            , toolbar: '#commune-add-toolbar'
            , cols: [[ //表头
                {type: 'checkbox'}
                , {field: 'id', title: 'ID', sort: true}
                , {field: 'title', title: '标题'}
                , {field: 'content', title: '内容'}
                , {field: 'create_time', title: '创建时间'}
                , {field: 'communeName', title: '公社'}
              
                , {
                    field: 'status', title: '审核状态', templet: function (d) {
                        if (d.status == 1) {
                            return '待审核';
                        }
                        if (d.status == 2) {
                            return '审核通过';
                        }
                        if (d.status == 3) {
                            return '审核不通过';
                        }
                    }
                }
                , {fixed: 'right', align: 'center', title: '操作', toolbar: '#barDemo'}
            ]]
            , done: function (res, curr, count) {
                ppp.hoverOpenImg();
            }
        });

        /*
 *编辑内容
 */
        let openEdit = function (data) {
            let tempData = {};
            tempData.commune = communeArray;
            tempData.userData = userData;
            if (data) {
                //原有的数据
                tempData.data = data;
            } else {

            }
            ppp.putTempData('t_commune_data', tempData);

            ppp.popupCenter({
                title: data ? '修改' : '添加',
                path: 'components/views/commune/topicForm.html',
                finish: function () {
                    askTable.reload();
                }
            });
        };

        // 表格操作列事件
        table.on('toolbar(communeAsk-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            switch (layEvent) {
                case 'add':
                    openEdit(data);
                    break;
            }
        });


        table.on('tool(communeAsk-table)', function (obj) {
            var data = obj.data;
            switch (obj.event) {
                case 'op-pass'://审核通过
                    communeAskSet(data, 2);
                    break;
                case 'op-not'://审核不通过
                    communeAskSet(data, 3);
                    break;
                case 'op-top'://置顶
                    communeAskTop(data);
                    break;
                case 'op-del'://删除
                    communeAskDel(data);
                    break;
                case 'op-cancel-top':
                    cancelTop(data);
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

        var communeAskDel = function (data){
            // topic/delete
            var title = '确定删除吗？';
            layer.confirm(title, function (index) {
                jq.post("/topic/delete", data, function (data) {
                    // console.log(data);
                    table.reload('communeAsk-table');
                    layer.msg(data.msg);
                }, "json");
            });
        };

        var communeAskSet = function (data, type) {
            var titl = '确定审核通过吗？';
            data.status=2;

            if (type == 3) {
                titl = '确定审核 不通过吗？';
                data.status=3;
            }
            layer.confirm(titl, function (index) {
                jq.post("/topic/update", data, function (data) {
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
                jq.post(config.serverUrl + "commune/ask/cancel/top", {id: data.tid}, function (data) {
                    table.reload('communeAsk-table');
                    layer.msg(data.msg);
                }, "json");
            });
        }

        form.on('submit(ask-form-submit)', function (data) {
            askTable.reload({where: data.field});
        });
        // 搜索按钮点击事件
        // $('#search_ask').click(function () {
        //     let title = $("#title").val();
        //     askTable.reload({where: {'s': title}});
        // });

        //分页
        laypage.render({
            elem: 'pageDemo' //分页容器的id
            , count: 100 //总页数
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
        *关闭当前窗口
        */
        function closeDialog() {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }
    });
}
   