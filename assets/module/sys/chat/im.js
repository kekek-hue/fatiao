    //localStorage.clear();
layui.use(['layim','config'], function(layim){
    var config = layui.config;
    //基础配置
  /*  layim.config({
        //获取主面板列表信息
        init: {
          url: config.serverUrl+"im/info" //接口地址（返回的数据格式见下文）
          ,type: 'get' //默认get，一般可不填
          ,data: {} //额外参数
        }
        //获取群员接口
        ,members: {
          url: config.serverUrl+"im/getMembers" //接口地址（返回的数据格式见下文）
          ,type: 'get' //默认get，一般可不填
          ,data: {} //额外参数
        },
        uploadFile: {
            url: config.serverUrl+"upload/uploadFile"
        }
        ,uploadImage: {
            url: config.serverUrl+"im/uploadimg"
        }
        ,brief: false 
        ,title: '我的通讯录' 
        ,maxLength: 3000 
        ,isfriend: true 
        ,isgroup: true 
        ,right: '0px'
        ,isAudio: !0
        ,isVideo: !0
        ,tool: [{
            alias: "code",
            title: "代码",
            icon: "&#xe64e;"
        }]
        ,chatLog: config.serverUrl+"im/getChatLog" 
        ,find: config.serverUrl+"findgroup/index" 
        ,copyright: false 
    });*/
   /* var socket = new WebSocket(config.webSocketUrl);
    var user = config.getUser();
    socket.onopen = function(){
        //console.error(user);
        if(user){
            var login_data = '{"type":"init","id":"'+user.id+'","username":"'+user.name+'","avatar":"assets/images/favicon.ico","sign":"'+user.res_id+'"}';
            socket.send( login_data );
        }else{
            user = config.getUser();
        }
    };
    //监听收到的消息
    socket.onmessage = function(res){
        var data = eval("("+res.data+")");
        switch(data['message_type']){
            // 服务端ping客户端
            case 'ping':
                socket.send('{"type":"ping"}');
                break;
            // 登录 更新用户列表
            case 'init':
                console.log(data['id']+"登录成功");
                //layim.getMessage(data); //res.data即你发送消息传递的数据（阅读：监听发送的消息）
                break;
            //添加 用户
            case 'addUser':
                console.log(data);
                layim.addList(data.data);
                break;
            //删除 用户
            case 'delUser':
                layim.removeList({
                    type: 'friend'
                    ,id: data.data.id //好友或者群组ID
                });
                break;
            // 添加 分组信息
            case 'addGroup':
                console.log(data);
                layim.addList(data.data);
                break;
            case 'delGroup':
                layim.removeList({
                    type: 'group'
                    ,id: data.data.id //好友或者群组ID
                });
                break;
            // 检测聊天数据
            case 'chatMessage':
                console.log(data);
                layim.getMessage(data.data);
                break;
            // 离线消息推送
            case 'logMessage':
                setTimeout(function(){layim.getMessage(data.data)}, 1000);
                break;
            // 用户退出 更新用户列表
            case 'logout':
                break;
            //聊天还有不在线
            case 'ctUserOutline':
                console.log('11111');
                layer.msg('好友不在线', {'time' : 1000});
                break;
               
        }
    };

    //layim建立就绪
    layim.on('ready', function(res){

        layim.on('sendMessage', function(res){
            //console.log(res);
            // 发送消息
            var mine = JSON.stringify(res.mine);
            var to = JSON.stringify(res.to);
            var login_data = '{"type":"chatMessage","data":{"mine":'+mine+', "to":'+to+'}}';
            socket.send( login_data );
        });
    });*/

}); 