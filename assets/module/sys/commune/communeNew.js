function Lay(layui) {

    layui.use(['layedit', 'laydate','setter', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form', 'upload', 'config', 'ppp'], function () {
        var laypage = layui.laypage //分页
            , table = layui.table //表格
            , jq = layui.jquery
            , form = layui.form
            , layedit = layui.layedit
            , laydate = layui.laydate
            , upload = layui.upload
            , layer = layui.layer
            , config = layui.config
            , setter = layui.setter
            , ppp = layui.ppp;

//执行一个 table 实例
        var communeTable = table.render({
            elem: '#commune-table'
            , url: setter.serverUrl + 'commune/get/list' //数据接口
            , toolbar: '#commune-add-toolbar'
            , parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "count": res.total, //解析数据长度
                    "data": res.data //解析数据列表
                };
            }
            , defaultToolbar: ['filter']
            , title: '文章列表'
            , page: true //开启分页
            , limit: 15 //每页默认显示的数量
            , limits: [15, 30, 45]
            , cols: [[ //表头
                // {type: 'checkbox'}
                 {field: 'id', title: 'ID', sort: true}
                , {field: 'name', title: '名称'}
                , {field: 'info', title: '公告'}
                , {
                    field: 'status', title: '状态', templet: function (d) {
                        if (d.status == 1) {
                            return '<font style="color:blue">待审核</font>';
                        }
                        if (d.status == 2) {
                            return '<font style="color:green">审核通过</font>';
                        }
                        if (d.status == 3) {
                            return '<font style="color:blue">不通过</font>';
                        }
                    }
                }
                , {field: 'index',title:'首页显示',templet:'#switchTpl', unresize: true}
                , {field: 'create_time', title: '创建时间'}
                , {
                    field: 'image_url',
                    title: 'image_url',
                    templet: function(d){
                        return `<div><img style="height:50px" data-img="${d.image_url}" src="${d.image_url}"></div>`
                    }
                }
// , {field: 'tags', title: '标签'}
// , {fixed: 'right', align: 'center', title: '标签操作', toolbar: '#TagDemo'}
                , {fixed: 'right', align: 'center', title: '操作', toolbar: '#TagDemo' ,width:400 }
            ]]
            , done: function (res, curr, count) {
                ppp.hoverOpenImg();
            }
        });

        //监听性别操作
        form.on('switch(indexDemo)', function(obj){
            // layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);

            var id = this.value;//公社的id

            var status;
            //
            if(obj.elem.checked){
                //显示
                status = 1;
            }else{
                //不显示
                status = 0;
            }
            var data = {id:id, status: status};

            $.post(setter.serverUrl+'commune/setIndex', data, function(d){
                //这里成功了就不用提示了
            }, 'json');

        });

// 表格操作列事件
        table.on('toolbar(commune-table)', function (obj) {
            var data = obj.data;
            var layEvent = obj.event;
            switch (layEvent) {
                case 'add':
                    openEdit(data);
                    break;
            }
        });

        table.on('tool(commune-table)', function (obj) {
            var data = obj.data;
           // console.log(data);
            switch (obj.event) {
                case 'op-pass':
                    pass2(data, 2);
                    break;
                case 'op-pending':
                    pass2(data, 1);
                    break;
                case 'op-not':
                    pass2(data, 3)
                    break;
                case 'op-delete':
                    deleteCommune(data);
                    break;
                case 'op-cover'://修改封面
                    coverCommune(data);
                    break;
                case 'delete-attr':
                    deleteCommune(data);
                    break;
                case 'edit-attr':
                    openEdit(data);
                    break;
                case 'tagadd-attr':
                    addTag(data, 2);
                    break;
                case 'tag-delete':
                    addTag(data, 3);
                    break;
                case 'go-index':
                    ppp.putTempData('commune_data', data);
                    ppp.popupCenter({
                        data:'修改数据',
                        path: 'components/views/commune/update.html',
                        finish: function () {
                            communeTable.reload();
                        }
                    });

                    //setIndex(data);
                    break;
            }
        });

        let pass2 = function (data, v) {
            var req = {commune_id: data.id, status: v};
            $.ajax({
                url: config.serverApiUrl + 'commune/create/ispass',
                type: 'POST',
                data: JSON.stringify(req),
                processData: false,
                contentType: false,
                beforeSend: function () {
                    console.log("正在进行，请稍候");
                },
                success: function (responseStr) {
                    layer.closeAll('loading');
                    layer.msg('成功', {icon: 1});
                    table.reload('commune-table');
                },
                error: function (responseStr) {
                    console.log("error");
                }
            });
        }

        /*
        *编辑内容
        */
        let openEdit = function (data) {
            if (data) {
                ppp.putTempData('t_commune_data', data);
            }
            ppp.popupCenter({
                title: data ? '修改公社详情' : '添加',
                path: 'components/views/commune/form.html',
                finish: function () {
                    communeTable.reload();
                }
            });
        }

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

        //修改公社封面 todo
        var coverCommune = function(data){

            console.log(data);

        };

        var deleteCommune = function(data){
            let formData = new FormData();
            formData.append('id', data.id);
            layer.confirm('确定要删除吗？', function (i) {
                layer.close(i);
                layer.load(2);

                $.ajax({
                    url: config.serverUrl + 'commune/delete',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    beforeSend: function () {
                        console.log("正在进行，请稍候");
                    },
                    success: function (responseStr) {
                        layer.closeAll('loading');
                        layer.msg('成功', {icon: 1});
                        table.reload('commune-table');
                    },
                    error: function (responseStr) {
                        console.log("error");
                    }
                });
            });
        };

//添加删除标签
        var addTag = function (data, type) {

            console.log(data);
            if (data) {
                ppp.putTempData('t_commune_data', data);
            }

            var path = '';

            if (type == 2) {
                path = 'components/views/commune/tag.html';
            } else {
                path = 'components/views/commune/tagdel.html';
            }

            ppp.popupCenter({
                title: (type == 2 ? '添加标签' : '删除标签'),
                path: path,
                finish: function () {
                    communeTable.reload();
                }
            });
        }

        /***
         * @author lifang
         * @desc 设置公社到首页
         * @param data
         */
        function setIndex( data ) {
            ppp.post('commune/setIndex',{data:data},function (e) {
                if (e.code==200)
                {
                    layer.closeAll('loading');
                    layer.msg('设置成功', {icon: 1});
                    communeTable.reload();
                }
                else
                {
                    layer.closeAll('loading');
                    layer.msg('设置失败', {icon: 1});
                    communeTable.reload();
                }
            });

        }

//添加
        function postAddCompany(layero, index) {
            var companyObj = {
                name: layero.find('#name').val(),
                type: layero.find('#type').val(),
                simple: layero.find('#simple').val(),
                people: layero.find('#people').val(),
                register_address: layero.find('#register_address').val(),
                work_address: layero.find('#work_address').val(),
                create_time: layero.find('#create_time').val(),
            };
            jq.post("../../company/addCompany", companyObj, function (data) {
                if (data.code == 200) {
                    layer.alert('修改成功', {icon: 1, title: '提示'});
                    layer.close(index); //关闭弹层
                    location.reload()
                } else {
                    layer.msg(data.msg);
                }
            }, "json");

        }


        /*
        *更新快捷方式
        */
        function openUpdate(data) {
            layer.open({
                type: 1,
                title: '快速属性操作',
                shade: 0.8,
                shadeClose: true,
                moveType: 1,
                content: jq('.form-dv').html(),
                success: function (layero, index) {
                    jq("input[name=type][value=1]").attr("checked", data.type == 1 ? true : false);
                    jq("input[name=type][value=2]").attr("checked", data.type == 2 ? true : false);
                    jq("input[name=type][value=3]").attr("checked", data.type == 3 ? true : false);
                    jq("input[name=type][value=4]").attr("checked", data.type == 4 ? true : false);
                    jq("input[name=type][value=7]").attr("checked", data.type > 4 ? true : false);
                    jq("select[name='status']").val(data.status)
                    layero.find('#title-news').val(data.title);
                    layero.find('#news-id').val(data.id);
                    form.render();
                }
            });
        }

        /*
        *关闭当前窗口
        */
        function closeDialog() {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        }
    });
}
