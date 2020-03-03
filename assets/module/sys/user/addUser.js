function Lay(layui) {
    layui.use(['layer', 'ppp', 'form', 'formSelects'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var formSelects = layui.formSelects;
        var temp_data = ppp.getTempData('t_admin_user');
        var role_id;
        var commune_id;
        var role_list = [];
        var commune_list = [];
        var t_admin_user = [];
        if (temp_data) {
            t_admin_user = temp_data.data;

            //如果是增加公社管理员
            if (temp_data.hasOwnProperty('is_commune') && temp_data.is_commune === 1) {
                //隐藏选择角色
                $('.commune-hide').remove();
                $('.commune-show').show();

                //公社管理员的角色是1
                $('#admin_user-form').append('<input name="role" value="1" type="hidden"/>');
            } else {
                $('.commune-hide').show();
                $('.commune-show').remove();
            }

            form.val('admin_user-form', t_admin_user);
            role_list = temp_data.role_list;
            commune_list = temp_data.commune_list;
            if (t_admin_user) {
                $(".u_name").attr('disabled', true);
            }

            if(t_admin_user){
                role_id = t_admin_user.role_id;
            }else{
                role_id = 1;
            }

            if(temp_data.hasOwnProperty('is_commune') && temp_data.is_commune === 1){
                commune_id = t_admin_user.commune_id;
            }else{
                commune_id = 0;
            }
        }

        //渲染用户
        var renderSelectOption = function (data) {
            data.forEach(function (value, i) {
                var select = '';
                if (role_id == value.id) {
                    select = 'selected'
                }
                var optionHmtl = ' <option  data-grade=' + value.res_id + ' value="' + value.id + '"  ' + select + '>' + value.name + '</option>';
                $("#appCategory").append(optionHmtl);
            })
            form.render();
        }

        //渲染公社
        var renderCommuneOption = function (data) {
           console.log(data)
           if(data != undefined){
            data.forEach(function (value, i) {
                var select = '';
                if (commune_id == value.id) {
                    select = 'selected'
                }
                var optionHmtl = ' <option  data-grade=' + value.id + ' value="' + value.id + '"  ' + select + '>' + value.name + '</option>';
                $("#commune").append(optionHmtl);


            })
            form.render()

           }
          
        }
        // if (role_list.length > 0) {
        renderSelectOption(role_list);
        renderCommuneOption(commune_list)
        // renderCommuneOption(commune_list);
        // }
        // 获取所有角色
        //  layer.load(2);
        //
        // ppp.get('/roles/roles', {}, function (data) {
        //      // 渲染多选下拉框
        //      var roleSelectData = new Array();
        //      for (var i = 0; i < data.result.length; i++) {
        //          roleSelectData.push({name: data.result[i].name, value: data.result[i].id});
        //      }
        //      formSelects.data('roleIds', 'local', {arr: roleSelectData});
        //      // 回显user数据
        //      var user = ppp.getTempData('t_user');
        //      if (user) {
        //          form.val('user-form', user);
        //          $("#name").attr("readonly", "readonly");
        //          var rds = new Array();
        //          for (var i = 0; i < user.roleIds.length; i++) {
        //              rds.push(user.roleIds[i]);
        //          }
        //          formSelects.value('roleIds', rds);
        //      }
        //      layer.closeAll('loading');
        //  });

        // 表单提交事件
        form.on('submit(user-form-submit)', function (data) {
            console.log(data.field)
            layer.load(2); 
            //定义一数组
            // var roleIds = new Array();
            // if (data.field.roleIds) {
            //     roleIds = data.field.roleIds.split(",");
            // }
            // data.field.roleIds = roleIds;
            if (data.field.id) {
                ppp.post('admin/updateInfo', {data: data.field}, function (data) {
                   
                    layer.closeAll('loading');
                    if(data.code==200){
                        layer.msg('修改成功', {icon: 1});
                        ppp.finishPopupCenter();
                    }else{
                        layer.msg(data.msg);

                    }
                  
                    // window.location.reload();//更改后不刷新
                });
            } else {
                ppp.post('admin/addUser', {data: data.field}, function (data) {
                    layer.closeAll('loading');
                    if(data.code==200){
                    layer.msg('添加成功', {icon: 1});
                    ppp.finishPopupCenter();
                    }else{
                        layer.msg(data.msg); 
                    }
                    // window.location.reload();//更改后不刷新
                });
            }
            return false;
        });
    });


}//方法结束