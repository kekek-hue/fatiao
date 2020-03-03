function Lay() {
    layui.use(['layer', 'ppp', 'transfer', 'config', 'strpy'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp,
            config = layui.config,
            form = layui.form,
            $ = layui.jquery,
            transfer = layui.transfer;
        var cols = [
            {type: 'checkbox', fixed: 'left'},
            {field: 'id', title: 'ID', width: 80, sort: true},
            {field: 'name', title: '名称', width: 80}
        ];
        var data = ppp.getTempData('t_app_categroy_data');
        var formRenderData = data.data;
        form.render();
        form.val("category-form", data);
        //表格配置文件
        var tabConfig = {
            'page': true,
            'limit': 10,
            'height': 300,
            'width': 270,
            'leftTitle': '源数据类型',
            'rightTitle': 'app类型'
        }
        //数据源
        ppp.get('category/getList', {}, function (data) {
            var appCategoryData = data.result;
            //getSourceData(appCategoryData);
            renderSelectOption(data.result);

           
        });
        var c_id = data.id;
        var renderSelectOption = function (data) {
            var optionHtml = '<option>请选择</option>';
            data.forEach(function (value, i) {
                var select = '';
                if (c_id == value.id) {
                    select = 'selected'
                }
                optionHtml += ' <option  data-grade=' + value.grade + ' value="' + value.id + '"  ' + select + '>' + value.name + '</option>';
            });
            $("#appCategory").append(optionHtml);
            form.render();
        }

        // if(typeList.length>0){
        //     renderSelectOption(typeList);
        // }
        // var getSourceData = function(appCategoryData){
        //     ppp.get('source/category/getList', {}, function (data) {
        //         var sourceCategoryData = data.result;
        //         renderTransfer(sourceCategoryData,appCategoryData);
        //         form.render();
        //     });
        // }
        var moveData = function (data, type) {
            if (type == 0) {
                type = 'a';
            } else {
                type = 'b';
            }
            var handerData = handerMoveData(data);

            var data = JSON.stringify(handerData).toString()
            var dataQ = {
                ids: data
            };
            ppp.post('add/app/category/' + data + '/' + type, {data: dataQ}, function () {
                layer.msg('修改成功', {icon: 1});
            });
        }
        /*处理移动数据*/
        var handerMoveData = function (data) {
            var handerData = new Array();
            data.forEach(function (value, i) {
                var rlt = handlerStrToPin(value);
                var childObj = {
                    'name': value.name,
                    'id': value.id,
                    'pinName': rlt
                };
                handerData.push(childObj);
            })
            return handerData;
        }
        /*处理获取汉字首字母+随机字母*/
        var handlerStrToPin = function (value) {
            var rlt = '';
            var rel = layui.strpy(value.name, '-');
            var relArray = rel.split('-');
            relArray.forEach(function (val, j) {
                var r = val.substr(0, 1);
                rlt += r;
            });
            var radStr = Math.random().toString(36).substr(12);
            rlt += radStr;
            return rlt;
        }
        var renderTransfer = function (sourceCategoryData, appCategoryData) {
            var tb1 = transfer.render({
                elem: "#root",
                cols: cols, //表格列  支持layui数据表格所有配置
                data: [sourceCategoryData, appCategoryData], //[左表数据,右表数据[非必填]]
                tabConfig: tabConfig, //表格配置项 支持layui数据表格所有配置
                callbackFun: moveData
            })
        }
        // 表单提交事件
        form.on('submit(form-submit)', function (data) {
            // layer.msg(JSON.stringify(data.field));
            var load = layer.load(2);
            console.log(data.field);
            if (data.field.id) {
                ppp.post('category/add', {data: data.field}, function (e) {
                    layer.close(load);
                    layer.msg('修改成功', {icon: 1});
                    // table.reload('role-table');
                    layer.closeAll('page');
                    ppp.finishPopupCenter();
                    //window.location.reload();//更改后不刷新
                });
            }else{}
            return false;
        });
        //transfer.get(参数1:初始化返回值,参数2:获取数据[all,left,right,l,r],参数:指定数据字段)
        //获取数据

    });
}//函数结束