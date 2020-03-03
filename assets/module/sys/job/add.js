function Lay(){
 layui.use(['layer', 'ppp', 'form', 'iconPicker'], function () {
        var layer = layui.layer;
        var ppp = layui.ppp;
        var form = layui.form;
        var $ = layui.jquery;
        var iconPicker = layui.iconPicker;
        var jobData = ppp.getTempData('t_job_data');
        if(jobData){
            var  jobId = jobData.id;
            form.val('job-form', schemeSkuData);
        }
        //单位company_id
        ppp.get('company/lists', {async: false}, function (data) {
            if(data.code == 0){
                let companyData = data.data;
                companyData.forEach(function(value,i){
                    let opt ="<option value="+value.id+">"+value.name+"</option>";
                    $("#company_id").append(opt);
                });
            }
        });
        // 表单提交事件
        form.on('submit(job-form-submit)', function (data) {
            layer.load(2);
            if (data.field.id) {
                ppp.post('job/edit/' + data.field.id, {data: data.field}, function () {
                    layer.closeAll('loading');
                    layer.msg('修改成功', {icon: 1});
                    ppp.finishPopupCenter();
                });
            } else {
                ppp.post('job/addJob', {data: data.field}, function () {
                    layer.closeAll('loading');
                    layer.msg('添加成功', {icon: 1});
                    ppp.finishPopupCenter();
                });
            }
            //location.reload();
            return false;
        });
        form.render();
    });

}//函数结束