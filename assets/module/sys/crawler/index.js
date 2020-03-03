layui.use(['table', 'layer', 'jquery', 'form', 'setter', 'ppp'], function () {
    var setter = layui.setter;
    var domain = setter.serverApiUrl;
    var url = domain + 'list/type';
    var layer = layui.layer;
    var form = layui.form;
    var $ = layui.jquery;
    var table = layui.table;
    var ppp = layui.ppp;
    //方法级渲染
    var demoTable = table.render({
        elem: '#demo'
        , url: url
        , toolbar: '#toolbar'
        , parseData: function (res) { //res 即为原始返回的数据
            console.log(res);
            var status;
            if (res.result === 'ok') {
                status = 0;
            }
            for (var i in res.list.data) {
                if (res.list.data[i].is_use == 1) {
                    res.list.data[i].use = "否"
                } else {
                    res.list.data[i].use = "是"
                }
            }

            return {
                "code": status, //解析接口状态
                "msg": res.result, //解析提示文本
                "count": res.list.total, //解析数据长度
                "data": res.list.data //解析数据列表
            };
        }
        , cols: [[
            {checkbox: true, fixed: true}
            , {field: 'id', title: 'ID', sort: true, fixed: true}
            , {field: 'name', title: '分类名称'}
            // ,{field:'num', title: '数量', width:80, sort: true}
            , {field: 'tag', title: '关键词'}
            , {field: 'num', title: '最少个数'}
            , {field: 'sort', title: '排序'}
            , {field: 'use', title: '是否使用'}
            , {field: 'create_time', title: '创建时间'}
            , {fixed: 'right', title: '操作', align: 'center', toolbar: '#barDemo', width: 150}
        ]]
        , id: 'testReload'
        , page: true
    });

    /*控制按钮*/
    table.on('toolbar(demo)', function (obj) {
        var data = obj.data;
        switch (obj.event) {
            case 'add': //添加
                openForm(data);
                break;
            case 'preview':
                break;
            case 'examine':
                break;
        }
    });

    //添加和编辑
    let openForm = function (data){
        if(data){
            ppp.putTempData('form_data', data);
        }

        ppp.popupCenter({
            title: data?'修改':'添加',
            path: 'components/crawler/form.html',
            finish:function (){
                demoTable.reload();
            }
        });
    };


    //当点击确定的时候
    $('.ok-btn').on('click', function () {
        var tag = document.querySelector('.tag').value;
        document.querySelector('.tag').value = tag.replace(/，/g, ',');
        var fForm = document.getElementById('flForm');
        var fd = new FormData(fForm);
        if (fForm.getAttribute('data-edi') == 1) {

            $.ajax({
                url: domain + 'add/type',
                type: 'post',
                dataType: 'json',
                data: fd,
                processData: false,
                contentType: false,
                success: function (d) {
                    if (d.result == 'ok') {
                        location.reload();
                    }
                }
            })
        } else if (fForm.getAttribute('data-edi') == 2) {
            fd.append('id', fForm.getAttribute('data-id'));
            fd.append('data[name]', fd.get('name'));
            fd.append('data[tag]', fd.get('tag'));
            fd.append('data[num]', fd.get('num'));
            fd.append('data[sort]', fd.get('sort'));
            if (fd.get('use') == '是') {

                fd.append('data[use]', 'use');
            } else {
                fd.append('data[use]', 'no');
            }

            $.ajax({
                url: domain + 'up/data',
                type: 'post',
                data: fd,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function (d) {
                    if (d.result == 'ok') {
                        location.reload();

                    }
                }
            })
        }
    });

    //监听工具条,删除,编辑
    table.on('tool(demo)', function (obj) {
        var data = obj.data;
        console.log(data);
        if (obj.event === 'del') {
            layer.confirm('确定删除这条数据吗', function (index) {
                $.ajax({
                    url: domain + 'del/type',
                    type: 'post',
                    data: {
                        id: data.id
                    },
                    dataType: 'json',
                    success: function (d) {
                        if (d.result == 'ok') {
                            obj.del();
                        }
                    }
                })

                layer.close(index);
            });
        } else if (obj.event === 'edit'){
            openForm(data)
        }
    });
    //取消事件
    $(document).on('click', '.cancel-btn', function () {
        layer.close(i);
        location.reload();
    })


});