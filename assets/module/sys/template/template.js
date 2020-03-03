
function Lay(layui){

    var newCount = 1;
    layui.use(['form', 'table', 'config', 'ppp'], function () {
        var form = layui.form;
        var table = layui.table;
        var config = layui.config;
        var layer = layui.layer;
        var ppp = layui.ppp;
        var $ = layui.jquery;
        //根据DOM元素的id构造出一个编辑器
        var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
            mode: "text/htmlmixed",    //实现groovy代码高亮
            lineNumbers: true,  //显示行号
            theme: "dracula",   //设置主题
            lineWrapping: true, //代码折叠
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            matchBrackets: true,    //括号匹配
        });
        editor.setSize('800px', '950px');
        editor.setValue('<!-- begin code -->');//给代码框赋值

        var setting = {
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
                    name: "templateName",
                    path: "templatePath"
                }
            },
            callback:{
                onMouseDown:onMouseDown
            }

        };//setting结束

        function onMouseDown(event, treeId, treeNode) {
            //console.error(treeNode);
            if(!treeNode){
                return false;
            }
            if(treeNode.isParent){
                //console.error(treeNode.isParent);
            }else{
                //console.error(treeNode.templatePath);
                var path = treeNode.templatePath;
                var data = {
                    'path':path
                };
                ppp.get('template/readContent', {data:data}, function (data) {
                    //console.error(data.result);
                    //editor.setValue('42343'+Math.random());//给代码框赋值
                    editor.setValue(data.result);//给代码框赋值

                });        
            }
        }

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
            toolbar: '#role-toolbar',
            url: config.serverUrl + 'roles/lists',
            request: config.request,
            parseData: config.parseData,
            response: config.response,
            headers: {Authorization: config.getToken()},
            page: true,
            cols: [[
                {type: 'numbers'},
                {field: 'id', align: 'center', width: 60, sort: true, title: 'ID'},
                {field: 'name', align: 'center', sort: true, title: '角色名'},
                {field: 'describe', align: 'center', sort: true, title: '备注'},
                {field: 'create_time', align: 'center', sort: true, title: '创建时间'},
                {field: 'update_time', align: 'center', sort: true, title: '修改时间'},
                {field: 'create_uid', align: 'center', sort: true, title: '创建者'},
                {align: 'center', toolbar: '#role-table-bar', title: '操作', width: 200}
            ]]
        });
        //显示菜单树
        var showMenuTree = function (data) {
            //树形菜单
            ppp.get('template/list', {}, function (data) {
                var result = data.result;
                //定义一数组
                var zNodes = [];
                for (var i = 0; i < result.length; i++) {
                    var zNode = {};
                    zNode.id = result[i].id;
                    zNode.parentId = result[i].parent_id;
                    zNode.templateName = result[i].template_name;
                    zNode.templatePath = result[i].template_path;
                    zNode.isParent = result[i].template_type == 3 ? false : true;
                    zNodes.push(zNode);
                }
                var zTree = $.fn.zTree.init($("#menuTreeData"), setting, zNodes);
                layer.closeAll('loading');
            });
        };
        showMenuTree()

    });


}//方法结束