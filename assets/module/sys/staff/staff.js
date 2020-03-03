function Lay(layui) {
    layui.use(['layedit', 'ppp', 'laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider', 'jquery', 'form', 'upload'], function () {
        var laypage = layui.laypage //分页
            , table = layui.table //表格
            , jq = layui.jquery
            , form = layui.form
            , layedit = layui.layedit
            , laydate = layui.laydate
            , upload = layui.upload
            , ppp = layui.ppp;

        //执行一个 table 实例
        table.render({
            elem: '#staff-table'
            , url: '../../staff/lists' //数据接口
            , toolbar: '#articleTool'
            , title: '文章列表'
            , page: true //开启分页
            , cols: [[ //表头
                {type: 'checkbox'}
                , {field: 'id', title: 'ID', sort: true}
                , {field: 'company_id', title: '单位'}
                , {field: 'user_id', title: '用户'}
                , {field: 'job_id', title: '职位'}
                , {field: 'in_time', title: '加入时间'}
                , {field: 'out_time', title: '退出时间'}
                , {field: 'info', title: '申请信息'}
                , {fixed: 'right', align: 'center', title: '操作', toolbar: '#barDemo'}
            ]]
            , done: function (res, curr, count) {
                ppp.hoverOpenImg();
            }
        });

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
        jq('.reload-btn').on('click', function () {
            var id = jq('#id').val();
            var title = jq('#title').val();
            var info = jq('#info').val();
            //执行重载
            table.reload('article-table', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                , where: {
                    id: id,
                    name: name,
                    info: info
                }
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
        table.on('tool(staff-table)', function (obj) {
            var data = obj.data;
            switch (obj.event) {
                case 'delete-attr':
                    deleteStaff(data);
                    break;
                case 'edit-attr':
                    openEdit(data);
                    break;
            }
            ;
        });
        /*表格头控制按钮*/
        table.on('toolbar(staff-table)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id),
                data = checkStatus.data;
            switch (obj.event) {
                case 'getCheckData':
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
                case 'addStaff':
                    upenAddForm(data);
                    break;
            }
            ;
        });
        //添加数据弹窗
        var upenAddForm = function (data) {
            if (data) {
                ppp.putTempData('t_staff_data', data);
            }
            ppp.popupCenter({
                title: data ? '修改员工详情' : '添加员工',
                path: 'components/views/company/staff/form.html',
                finish: function () {
                    renderTable();
                }
            });
            form.render();
        }

        //添加
        function postAddStaff(layero, index) {
            var staffObj = {
                companyId: layero.find('#company_id').val(),
                user_id: layero.find('#user_id').val(),
                jobId: layero.find('#job_id').val(),
                status: layero.find('#status').val(),
                inTime: layero.find('#in_time').val(),
                outTime: layero.find('#out_time').val(),
                info: layero.find('#info').val(),
            };
            console.log(staffObj);
            jq.post("../../staff/addStaff", staffObj, function (data) {
                if (data.code == 200) {
                    layer.alert('修改成功', {icon: 1, title: '提示'});
                    layer.close(index); //关闭弹层
                    location.reload()
                } else {
                    layer.msg(data.msg);
                }
            }, "json");

        }

        //删除单位
        function deleteStaff(data) {
            console.error(data);
            let obj = {
                id: data.id
            };
            jq.post("../../staff/deleteStaff", obj, function (data) {
                if (data.code == 200) {
                    layer.alert('删除成功！', {icon: 1, title: '提示'});
                    location.reload()
                } else {
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

        /*
        *编辑内容
        */
        function openEdit(data) {

        }


    });
}
