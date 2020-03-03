function Lay(layui){
 var setting = {
        view: {
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
            selectedMulti: false
        },
        check: {
            enable: true
        },
        data: {
            keep: {
                parent: true
            },
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "parentId"
            },
            key: {
                name: "menuName"
            },
            check: {
                enable: true, // 显示多选框按钮
                chkStyle: "checkbox", // 添加生效
                chkboxType: {"Y": "", "N": ""} //Y:勾选（参数：p:影响父节点），N：不勾（参数s：影响子节点）[p 和 s 为参数]
            }
        },
        edit: {
            enable: true
        }

    };//setting结束

    var newCount = 1;

    function onAsyncSuccess() {
        //获得树形图对象
        var zTree = $.fn.zTree.getZTreeObj("menuTreeData");
        //获取根节点个数,getNodes获取的是根节点的集合
        var nodeList = zTree.getNodes();
        for (var i = 0; i < nodeList.length; i++) {
            zTree.expandNode(nodeList[i], true, false, false, false);
        }
    }

    function addHoverDom(treeId, treeNode) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='add node' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_" + treeNode.tId);
        if (btn) btn.bind("click", function () {
            var zTree = $.fn.zTree.getZTreeObj("menuTreeData");
            zTree.addNodes(treeNode, {id: (100 + newCount), pId: treeNode.id, name: "new node" + (newCount++)});
            return false;
        });
    };

    function removeHoverDom(treeId, treeNode) {
        $("#addBtn_" + treeNode.tId).unbind().remove();
    };
    layui.use(['form', 'table', 'config', 'ppp'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        var $ = layui.jquery;

        $('#role-toolbar').vm({
            addShow: ppp.hasPerm("sys:role:add")
        });
        $('#role-table-bar').vm({
            editShow: ppp.hasPerm("sys:role:edit"),
            permShow: ppp.hasPerm("sys:role:perm"),
            deleteShow: ppp.hasPerm("sys:role:delete")
        });
        //渲染表格
        var roleTable = table.render({
            elem: '#role-table',
            // toolbar: '#role-toolbar',
            url: config.serverUrl + 'roles/lists',
            request: config.request,
            parseData: config.parseData,
            response: config.response,
            headers: {Authorization: config.getToken()},
            page: true,
            cols: [[
                {type: 'numbers'},
                {field: 'id', align: 'center', width: 200, sort: true, title: 'ID'},
                {field: 'name', align: 'center', sort: true, title: '角色名'},
                {field: 'describe', align: 'center', sort: true, title: '备注'},
                {field: 'create_time', align: 'center', sort: true, title: '创建时间'},
                {field: 'update_time', align: 'center', sort: true, title: '修改时间'},
                // {field: 'create_uid', align: 'center', sort: true, title: '创建者'},
                {align: 'center', toolbar: '#role-table-bar', title: '操作', width: 200}
            ]]
        });
        // 添加
        table.on('toolbar(role-table)', function (obj) {
            if (obj.event === 'add') {
                showEditModel();
            }
        });

        // 表单提交事件
        form.on('submit(role-form-submit)', function (data) {
            layer.load(2);
            if (data.field.id) {
                ppp.post('role/editRole', {data: data.field}, function () {
                    layer.closeAll('loading');
                    layer.msg('修改成功', {icon: 1});
                    roleTable.reload('role-table');
                    layer.closeAll('page');
                });
            } else {
                ppp.post('role/addRole', {data:data.field}, function () {
                    layer.closeAll('loading');
                    layer.msg('添加成功', {icon: 1});
                    roleTable.reload('role-table');
                    layer.closeAll('page');
                });
            }
            return false;
        });

        // 表单提交事件
        form.on('submit(tree-form-submit)', function (data) {
            layer.load(2);
            var zTree = $.fn.zTree.getZTreeObj("menuTreeData");
            var checked = zTree.getCheckedNodes();
            var menuIds = [];
            for (var i = 0; i < checked.length; i++) {
                menuIds.push(checked[i].id);
            }
            if (menuIds.length == 0) {
                layer.msg('请选择关联菜单', {icon: 5});
                layer.closeAll('loading');
                layer.closeAll('page');
                return false;
            }
            var formData = {
                roleId:data.field.roleId,
                menuIds:menuIds
            };
            ppp.post('roles/menus', {data:formData}, function () {
                layer.closeAll('loading');
                layer.msg('关联成功', {icon: 1});
                roleTable.reload('role-table');
                layer.closeAll('page');
            });
            return false;
        });

        // 工具条点击事件
        table.on('tool(role-table)', function (obj) {
            var data = obj.data;
            if (obj.event === 'edit') { //修改
                showEditModel(data);
            } else if (obj.event === 'del') { //删除
                doDelete(obj);
            } else if (obj.event === 'resource') {
                showMenuTree(data);
            }
        });

        //显示菜单树
        var showMenuTree = function (data) {
            var menuIds = data.menuIds;
            layer.open({
                type: 1,
                title: '菜单关联',
                area: '450px',
                offset: '120px',
                content: $('#menu-tree').html(),
                success: function () {
                    $('#tree-form')[0].reset();
                    form.val("tree-form", {
                        "roleId": data.id
                    });
                    //树形菜单
                    ppp.get('menus', {}, function (data) {
                        var result = data.result;
                        //定义一数组
                        var zNodes = [];
                        for (var i = 0; i < result.length; i++) {
                            var zNode = {};
                            zNode.id = result[i].id;
                            zNode.parentId = result[i].parent_id;
                            zNode.menuName = result[i].menu_name;
                            zNode.isParent = result[i].menu_type == 3 ? false : true;
                            zNodes.push(zNode);
                        }
                        var zTree = $.fn.zTree.init($("#menuTreeData"), setting, zNodes);
                        if (menuIds) {
                            menuIds.forEach(function(menu,i){
                                var node = zTree.getNodeByParam("id", menu.id);
                                    zTree.checkNode(node, true, false);               
                            })
                        }
                        onAsyncSuccess();
                        layer.closeAll('loading');
                    });
                    $('#tree-form .close').click(function () {
                        layer.closeAll('page');
                    });
                }
            });
        };

        // 显示编辑弹窗
        var showEditModel = function (data) {
            layer.open({
                type: 1,
                title: data ? '修改角色' : '添加角色',
                area: '450px',
                offset: '120px',
                content: $('#role-model').html(),
                success: function () {
                    $('#role-form')[0].reset();
                    if (data) {
                        form.val('role-form', data);
                    }
                    $('#role-form .close').click(function () {
                        layer.closeAll('page');
                    });
                }
            });
        };
        // 删除
        var doDelete = function (obj) {
            layer.confirm('确定要删除吗？', function (i) {
                layer.close(i);
                layer.load(2);
                ppp.delete('roles/' + obj.data.id, {}, function () {
                    layer.closeAll('loading');
                    layer.msg('删除成功', {icon: 1});
                    obj.del();
                });
            });
        };

        // 搜索按钮点击事件
        $('#role-btn-search').click(function () {
            roleTable.reload({where: ppp.getSearchForm()});
        });
    });


}//方法结束