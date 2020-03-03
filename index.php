<?php
/**
 * author:	xingzhou.name
 * email:	wxz@pctu.cn
 * qq:		600898
 * created:	2013-7-15
 * descript: 首页，为了安全，在权限上设定网站目录为只读，并锁死该index.php文件，防止篡改
 * 微信后台伺服
 */
//echo 11;die;
// 网站根目录
define('DOCROOT', str_replace("\\", '/', realpath(dirname(__FILE__))).'/');

// 项目根目录
define('PRJROOT', dirname(DOCROOT).'/');
define('APPNAME', 'admin');

/***
 * @desc 阿里云OSS对象存储，true开启，false关闭，开启后图片会存储到阿里云oss中，节省空间，减轻服务器，数据库压力，如果不开启，
 *      会存储到服务器上，备份到数据库中,（提示开启后请在config文件中配修改配置）
 * @author lifang
 */
define('ALY_OSS',true);

date_default_timezone_set('PRC');
// 开始
include PRJROOT.'bootstrap.php';