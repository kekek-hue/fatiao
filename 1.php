<?php

/////--华丽分割线--------------------------------------------------------------------
$domain = 'http://192.168.1.10:81/';

//书写方法
$in = [

    'commune/my' => [
        //路由
        'commune/my',

        //接口描述
        '获取我的数据列表',

        //请求方法
        'post',

        //返回
        [
            //返回结果实例
            [
                'result' => [
                    "id" => "313435907670212904",
                    "content" => "111111",
                    "title" => "22222",
                    "commune_name" => "测试公社",
                    "image_url" => "http://192.168.1.10:85/images/commune/big/904/212/313435907670.jpeg",
                    "type" => "1",
                    "user_id" => "123132131"
                ]
            ],

            //返回参数=>代表意义
            [
                'id' => '键值',
                'content' => '内容',
                'title' => '内容',
                'commune_name' => '公社名称',
                'image_url' => '图片URL',
                'type' => '提问类型 1社问 2公告 3动态 4新闻 5项目 6问题',
                'user_id' => '用户id'
            ]
        ],

        //参数
        [
            //参数键值=>[]
            'userid' => [
                //描述
                '用户id',

                //是否必传,1是,0否
                1
            ],
            'begintime' => [
                '时间段搜索开始时间',
                0
            ],
            'endtime' => [
                '时间段搜索结束时间',
                0
            ],
            'page' => [
                '页数',
                1
            ],
            'liststype' => [
                '获取我的数据类型 公社/问题/more...',
                1,
                ['ask' => '我的问题', 'askfav' => "我的关注", 'askcomment' => "我的评论", "joincomment" => "我的公社"]
            ],
            'type' => [
                '提问类型',
                0,
                ' 1社问 2公告 3动态 4新闻 5项目 6问题'
            ],
            'communeid' => [
                '公社id',
                0
            ]
        ],
    ],
    'commune/ask/list' => [
        //路由
        'commune/ask/list',

        //接口描述
        '获取问题列表',

        //请求方法
        'post',

        //返回
        [
            //返回结果实例
            [
                'result' => [
                    "id" => "313435907670212904",
                    "content" => "111111",
                    "title" => "22222",
                    "commune_name" => "测试公社",
                    "image_url" => "http://192.168.1.10:85/images/commune/big/904/212/313435907670.jpeg",
                    "type" => "1",
                    "status" => "0",
                    "is_show_status" => "0",
                    "is_view_comment_status" => "1",
                    "user_id" => "123131",
                    "check_view_comment_time" => "2019-05-30 15:13:16",
                    "check_name" => "花花"
                ]
            ],

            //返回参数=>代表意义
            [
                'id' => '键值',
                'content' => '内容',
                'title' => '内容',
                'commune_name' => '公社名称',
                'image_url' => '图片URL',
                'type' => '提问类型 1社问 2公告 3动态 4新闻 5项目 6问题',
                'status' => "状态,1.待审核,2审核通过,3审核不通过",
                'is_show_status' => "是否隐藏公告 0否 1是",
                'is_view_comment_status' => "是否能查看评论 0否 1是",
                'user_id' => "用户id",
                "check_view_comment_time" => "操作隐藏评论的时间",
                "check_name" => "操作人"

            ]
        ],

        //参数
        [
            //参数键值=>[]
            's' => [
                //描述
                '关键字搜索',

                //是否必传,1是,0否
                0
            ],
            'begintime' => [
                '时间段搜索开始时间',
                0
            ],
            'endtime' => [
                '时间段搜索结束时间',
                0
            ],
            'page' => [
                '页数',
                1
            ],
            'communeid' => [
                '公社id',
                1
            ],
            'hotid' => [
                '获取公社最热问题id',
                0,
                2004
            ],
            'recommendid' => [
                '获取公社推荐问题id',
                0,
                2005
            ],
            'status' => [
                '审核状态',
                0,
                "1未审核2审核通过3审核不通过"
            ],
            'type' => [
                '提问类型',
                0,
                ' 1社问 2公告 3动态 4新闻 5项目 6问题'
            ],
            'showstatus' => [
                '隐藏状态',
                0,
                "1"
            ],
            'viewcommentstatus' => [
                '隐藏评论状态',
                0,
                "1"
            ]
        ],
    ],

    'commune/ask' => [
        //路由
        'commune/ask',

        //接口描述
        '发起社问问题接口',

        //请求方法
        'post',

        //返回结果
        [
            [
                'result' => 'ok / false / errorInfo(错误信息)'
            ],

            [
                'ok' => '成功',
                'false' => '错误',
                'errorInfo' => '错误信息'
            ]
        ],

        //参数
        [
            //是否必传,1是,0否
            'communeid' => [
                '公社信息id',
                1
            ],
            'title' => [
                '提问的标题',
                1
            ],
            'content' => [
                '提问的内容',
                1
            ],
            'file' => [
                '提问附带的图片',
                0
            ],
            'tag' => [
                '添加提问所属的标签',
                1
            ],
            'type' => [
                '提问的模块类型',
                1,
                [
                    1 => '社问',
                    2 => '公告',
                    3 => '动态',
                    4 => '新闻',
                    5 => '项目',
                    6 => '问题'
                ],
            ],
        ],
    ],
    'commune/ask/comment' => [
        //路由
        'commune/ask/comment',

        //接口描述
        '回复社问问题接口',

        //请求方法
        'post',

        //返回结果
        [
            [
                'result' => 'ok / false / errorInfo(错误信息)'
            ],

            [
                'ok' => '成功',
                'false' => '错误',
                'errorInfo' => '错误信息'
            ]
        ],

        //参数
        [
            //是否必传,1是,0否
            'askid' => [
                '问题ID',
                1
            ],
            'text' => [
                '回复的内容',
                1
            ],
        ],

    ],
    'commune' => [
        'commune',
        '添加公社接口',
        'post',
        [
            [
                'result' => 'ok / false / errorInfo(错误信息)'
            ],
            [
                'ok' => '成功',
                'false' => '错误',
                'errorInfo' => '错误信息'
            ]
        ],
        [
            'name' => ['公社名称', 1],
            'info' => ['公社描述', 1],
            'tag' => ['公社标签', 1],
            'province' => ['省', 1],
            'city' => ['市', 1],
            'area' => ['区/县',],
            'file' => ['上传的图片',]
        ]
    ],
    'commune/list' => [
        //路由
        'commune/list',

        //接口描述
        '获取公社列表',

        //请求方法
        'post',

        //返回
        [
            //返回结果实例
            [
                'result' => [
                    "id" => "313409747372540363",
                    "name" => "测试公社",
                    "info" => "公社信息",
                    "status" => "1",
                    "create_time" => "2019-05-15 20:18:26",
                    "user_id" => "123",
                    "image_url" => "http://192.168.1.10:85/images/commune/big/363/540/313409747372.png",
                    "hot_id" => 2004,
                    "recommend_id" => 2005,
                ]
            ],

            //返回参数=>代表意义
            [
                'id' => '键值',
                'name' => '公社名称',
                'info' => '公社信息',
                'status' => '状态,1.待审核,2审核通过',
                'image_url' => '图片URL',
                'create_time' => '创建时间',
                'user_id' => '用户id',
                'hot_id' => '获取公社问题最热分类的唯一标识',
                'recommend_id' => '获取公社问题推荐分类的唯一标识'
            ]
        ],

        //参数
        [
            //参数键值=>[]
            'type' => [
                //描述
                '调用接口类型，默认为app调用，当=admin为后台调用',

                //是否必传,1是,0否
                0
            ]
        ],
    ],
    'commune/ask/show/edit' => [
        //路由
        'commune/ask/show/edit',

        //接口描述
        '隐藏问题接口',

        //请求方法
        'post',
        //返回
        [
            [
                'result' => 'ok / false / errorInfo(错误信息)'
            ],
            [
                'ok' => '成功',
                'false' => '错误',
                'errorInfo' => '错误信息'
            ]
        ],
        //参数
        [
            //参数键值=>[]
            'userid' => [
                //描述
                '用户id',

                //是否必传,1是,0否
                1
            ],
            'askid' => [
                '问题id',
                1
            ],
            'status' => [
                '隐藏状态，0取消隐藏 1隐藏',
                1,
                '0/1'
            ]
        ],
    ],
    'commune/ask/view/comment/edit' => [
        //路由
        'commune/ask/view/comment/edit',

        //接口描述
        '隐藏评论接口',

        //请求方法
        'post',
        //返回
        [
            [
                'result' => 'ok / false / errorInfo(错误信息)'
            ],
            [
                'ok' => '成功',
                'false' => '错误',
                'errorInfo' => '错误信息'
            ]
        ],
        //参数
        [
            //参数键值=>[]
            'userid' => [
                //描述
                '用户id',

                //是否必传,1是,0否
                1
            ],
            'askid' => [
                '问题id',
                1
            ],
            'status' => [
                '隐藏状态，0取消隐藏 1隐藏',
                1,
                '0/1'
            ]
        ],
    ],
    'commune/ask/top' => [
        //路由
        'commune/ask/top',

        //接口描述
        '置顶接口',

        //请求方法
        'post',
        //返回
        [
            [
                'result' => 'ok / false / errorInfo(错误信息)'
            ],
            [
                'ok' => '成功',
                'false' => '错误',
                'errorInfo' => '错误信息'
            ]
        ],
        //参数
        [
            //参数键值=>[]
            'userid' => [
                //描述
                '用户id',

                //是否必传,1是,0否
                1
            ],
            'askid' => [
                '问题id',
                1
            ],
            'begintime' => [
                '开始展示时间',
                1
            ],
            'endtime' => [
                '结束展示时间',
                1
            ],
            'sort' => [
                '优先级排序',
                1
            ]
        ],
    ],
    'commune/ask/top/one' => [
        //路由
        'commune/ask/top/one',

        //接口描述
        '获取一条置顶数据接口',

        //请求方法
        'get',
        //返回
        [
            //返回结果实例
            [
                'result' => [
                    "ask_id" => "313435907670212904",
                    "content" => "111111",
                    "title" => "22222",
                    "commune_name" => "测试公社",
                    "image_url" => "http://192.168.1.10:85/images/commune/big/904/212/313435907670.jpeg",
                    "type" => "1",
                ]
            ],

            //返回参数=>代表意义
            [
                'ask_id' => '问题id',
                'content' => '内容',
                'title' => '内容',
                'commune_name' => '公社名称',
                'image_url' => '图片URL',
                'type' => '提问类型 1社问 2公告 3动态 4新闻 5项目 6问题',
            ]
        ],
        //参数
        [],
    ],

    'commune/ask/supervision' => [
        //路由
        'commune/ask/supervision',

        //接口描述
        '监督问题接口',

        //请求方法
        'post',
        //返回
        [
            [
                'result' => 'ok / false / errorInfo(错误信息)'
            ],
            [
                'ok' => '成功',
                'false' => '错误',
                'errorInfo' => '错误信息'
            ]
        ],
        //参数
        [
            //参数键值=>[]
            'userid' => [
                //描述
                '用户id',

                //是否必传,1是,0否
                1
            ],
            'askid' => [
                '问题id',
                1
            ]
        ],
    ],
    'commune/ask/supervision/list' => [
        //路由
        'commune/ask/supervision/list',

        //接口描述
        '获取监督数据接口',

        //请求方法
        'post',
        //返回
        [
            //返回结果实例
            [
                'result' => [
                    "id" => "313435907670212904",
                    "content" => "111111",
                    "title" => "22222",
                    "commune_name" => "测试公社",
                    "image_url" => "http://192.168.1.10:85/images/commune/big/904/212/313435907670.jpeg",
                    "type" => "1",
                    "create_time" => "2019-05-29 14:37:19",
                    "check_name" => "花花",
                ]
            ],

            //返回参数=>代表意义
            [
                'id' => '键值',
                'content' => '内容',
                'title' => '内容',
                'commune_name' => '公社名称',
                'image_url' => '图片URL',
                'type' => '提问类型 1社问 2公告 3动态 4新闻 5项目 6问题',
                'create_time' => "监督时间",
                'check_name' => "监督人"
            ]
        ],
        //参数
        [
            //参数键值=>[]
            'userid' => [
                '用户id',
                1
            ],
            'page' => [
                '页数',
                1
            ],
            'communeid' => [
                '公社id',
                1
            ]
        ],
    ],
    'commune/join' => [
        //路由
        'commune/join',

        //接口描述
        '加入公社接口',

        //请求方法
        'post',
        //返回
        [
            [
                'result' => 'ok / false / errorInfo(错误信息)'
            ],
            [
                'ok' => '成功',
                'false' => '错误',
                'errorInfo' => '错误信息'
            ]
        ],
        //参数
        [
            //参数键值=>[]
            'userid' => [
                '用户id',
                1
            ],
            'communeid' => [
                '公社id',
                1
            ]
        ],
    ],
    'commune/join/status' => [
        //路由
        'commune/join/status',

        //接口描述
        '用户是否加入公社接口',

        //请求方法
        'post',
        //返回
        [
            [
                'result' => '1/0'
            ],
            [
                '1' => '是',
                '0' => '否'
            ]
        ],
        //参数
        [
            //参数键值=>[]
            'userid' => [
                '用户id',
                1
            ],
            'communeid' => [
                '公社id',
                1
            ]
        ],
    ],
    'commune/quit' => [
        //路由
        'commune/quit',

        //接口描述
        '退出公社接口',

        //请求方法
        'post',
        //返回
        [
            [
                'result' => 'ok / false / errorInfo(错误信息)'
            ],
            [
                'ok' => '成功',
                'false' => '错误',
                'errorInfo' => '错误信息'
            ]
        ],
        //参数
        [
            //参数键值=>[]
            'userid' => [
                '用户id',
                1
            ],
            'communeid' => [
                '公社id',
                1
            ]
        ],
    ],

    'nim/server/create' => [
        //路由
        'nim/server/create',

        //接口描述
        '创建网易云信用户接口',

        //请求方法
        'post',
        //返回
        [
            //返回结果实例
            [
                'result' => [
                    "token" => "a366a13218a4521c0a9509e561cdbad3",
                    "account" => "123213213213"
                ]
            ],

            //返回参数=>代表意义
            [
                'token' => '网易云通信ID登录token值',
                'account' => '网易云通信account值'
            ]
        ],
        //参数
        [
            //参数键值=>[]
            'userid' => [
                '用户id',
                1
            ]
        ],
    ],
    'adopt/comment' => [
        //路由
        'adopt/comment',

        //接口描述
        '获取采纳问题接口',

        //请求方法
        'post',
        //返回
        [
            //返回结果实例
            [
                'result' => [
                    "comment_id" => "1231321321",
                    "create_time" => "2019-05-23 19:11:40"
                ]
            ],

            //返回参数=>代表意义
            [
                'comment_id' => '评论id',
                'create_time' => '采纳时间'
            ]
        ],
        //参数
        [
            //参数键值=>[]
            'askid' => [
                '问题id',
                1
            ]
        ],
    ],


];

$out = [];
//处理出展现形式
foreach ($in as $k => $v) {

    //处理返回结果
    $resArr = $v[3][1];

    $res = [];
    foreach ($resArr as $k2 => $v2) {
        $res[] = [
            'key' => $k2,
            'text' => $v2
        ];
    }

    //处理参数
    if (key_exists(4, $v)) {
        $par = [];
        $param = $v[4];
        foreach ($param as $k1 => $v1) {
            $par[] = [
                //键值
                'key' => $k1,
                'text' => $v1[0],
                'need' => key_exists(1, $v1) && $v1[1] === 1 ? '是' : '否',
                'value' => $v1[2] ?? [],
            ];
        }
    }

    $out[] = [
        //键值
        'key' => $v[0],
        'text' => $v[1],
        'method' => strtoupper($v[2]),
        'url' => $domain . $v[0],
        'param' => $par,
        'return' => [
            'res' => $v[3][0],
            'test' => $res,
        ],
    ];
}

echo json_encode($out);