layui.use(['carousel','layer', 'ppp', 'form', 'iconPicker', 'config', 'jquery', 'upload'], function () {
    var ppp = layui.ppp;
    var carousel = layui.carousel;
    var banner = ppp.getTempData('banner');
    var $=layui.jquery;
    if(banner.length<1){
        return false
    }
    for(let i of banner){
        $('#images').append(`<img style="width: 192px;height: 108px" src="${i}" alt="" class="load-img layui-upload-img">`);
    }

    $(document).on('click', '.load-img', function(){
        var src = this.src;
        layer.o
    })
});