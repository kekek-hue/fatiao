
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

    //执行一个 table 实例
    var demoTable = table.render({
        elem: '#demo-table'
        , url: config.serverUrl+'adv/index' //数据接口
        , toolbar: '#demoTool'
        , title: '文章列表'
        , page: true //开启分页
        , defaultToolbar: ['filter']//'filter', 'print', 'exports'
        , cols: [[ //表头
            // {type: 'checkbox'}
            {field: 'row', title: 'row',  width:70}
            , {field: 'title', title: '标题', width:180}
            , {
                field: 'coverPath',
                title: '封面',
                templet: '<div><img style="height:50px" data-img="{{d.coverPath}}" src="{{d.coverPath}}"></div>'
            }
            , {field: 'start_time', title: '开始时间',width:180}
            , {field: 'end_time', title: '结束时间', width:180}
            , {field: 'url', title: '连接地址', width:280}
            // , {field: 'cover_id', title: '封面id', width:180}
            , {field: 'category_name', title: '专栏', width:150}
            , {fixed: 'right', align: 'center', title: '操作', toolbar: '#barDemo', width:150}
        ]]
        , parseData: function (res) { //res 即为原始返回的数据
            var count = res.pageCount;
            var total = res.total;
            var list = res.data;
            return {
                "code": 0, //解析接口状态
                "count": total,
                "data": list //解析数据列表
            };
        }
        , done: function (res, curr, count) {
            ppp.hoverOpenImg();
        }
    });

    // 搜索条件
    laydate.render({
        elem: '#start_time'
        ,type:'datetime'
    });

    // 搜索条件
    laydate.render({
        elem: '#end_time'
        ,type:'datetime'
    });

    // 渲染分类的搜索条件
    (function(){
        $.get(config.serverUrl+'category/getList',{}, function (d) {
            if(d.status == '200'){

                // 要渲染的select对象
                var obj = $('#type');

                var data = d.result;
                for(let i in data){
                    var val = data[i];
                    obj.append(`<option value="${val.id}">${val.name}</option>`)
                }

                form.render('select');
            }else{
                layer.alert('栏目数据请求失败,请联系管理员')
            }
        }, 'json')
    })()
    function renderTable(){
        demoTable.reload()
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

    //查询开始
    form.on('submit(demo-form-submit)', function (data) {
        demoTable.reload({
            where: data.field
        });
    });
    //查询结束
    //监听提交
    form.on('submit(newsUpdateForm)', function (data) {
        form.render();
        jq.post("../article/update", data.field, function (data) {
            if (data.code == 200) {
                layer.alert('修改成功', {icon: 1, title: '提示'});
                location.reload()
            } else {

            }
        }, "json");
        return false;
    });

    /*控制按钮*/
    table.on('tool(demo-table)', function (obj) {
        var data = obj.data;
        switch (obj.event) {
            case 'del':
                // alert('del')
                layer.confirm('确定删除吗？', function (index) {
                    deleteCommune(data);
                });
                break;
            case 'edit':
                // alert('edit')
                openEdit(data, 2);
                break;
        }
    });

    /*表格头控制按钮*/
    table.on('toolbar(demo-table)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id),
            data = checkStatus.data;
        switch (obj.event) {
            case 'del':
                if (data.length == 0) {
                    layer.msg('请选择一行');
                    return false;
                }
                var company = data;
                layer.confirm('确定删除吗？', function (index) {
                    deleteCompanys(company);
                    layer.close(index);
                });
                break;
            case 'add':
                openAdd();
                break;
        }
        ;
    });

    //删除
    function deleteCommune(data) {
        let obj = {
            id: data.id
        };
        jq.post(config.serverUrl + "adv/delete", obj, function (data) {
            if (data.code == 200) {
                layer.alert('删除成功！', {icon: 1, title: '提示'});
                renderTable()
            } else {
                layer.alert('删除失败！', {icon: 1, title: '提示'});
                renderTable()
            }
        }, "json");
    }

    //删除文章
    function deleteCompanys(data) {
        for (var j = 0, len = data.length; j < len; j++) {
            var companyId = data[j].id;
            var data = {
                'id': companyId
            };
            deleteCompany(data);
        }
    }


    //添加标签
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
                // renderTable();
            }
        });
    }


    var delTag = function (data) {

    }

    //添加广告
    var openAdd = function(data){
        openEdit(data)
    }

    /*
    *编辑内容
    */
    var openEdit = function (data) {
        if (data) {
            ppp.putTempData('t_commune_data', data);
        }
        ppp.popupCenter({
            title: data ? '修改' : '添加',
            path: 'components/views/ad/form.html',
            finish: function () {
                renderTable();
            }
        });
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

    //上传图片
    jq(document).on('change', '#img', function () {
        var files = this.files; // 获取文件的数量
        console.log(files);
        readers(files[0])
    });

    function readers(fil) {
        var reader = new FileReader();  // 异步读取存储在用户计算机上的文件
        reader.readAsDataURL(fil); // 开始读取指定的Blob对象或File对象中的内容
        console.log(reader.result);
        reader.onload = function () {
            document.getElementById("thumbail").innerHTML = "<img src='" + reader.result + "'>";  // 添加图片到指定容器中
        };
    }

});