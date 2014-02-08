/*var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {}));
*/
//修改为连接池方式
//see also http://cnodejs.org/topic/5190d61263e9f8a542acd83b

var mongodb = require('mongodb'),
	config = require('../settings');
	poolModule = require('generic-pool');

//手动实现连接池
module.exports = poolModule.Pool({
	name	:	'mongodb',
	//单个数据库连接的创建
	create	:	function(callback){
		var mongoserver = new mongodb.Server(config.host,config.port,
			{'auto_reconnect':false,poolSize:1});
		var db = new mongodb.Db(config.db,mongoserver,{w:-1});
		db.open(function(err,db){
			if(err) return callback(err);
			callback(null,db);
		});
	},
	//单个数据库连接的销毁
	destroy	:	function(db){
		db.close();
	},
	max	:	config.poolSize,
	min	:	config.poolMin,
	idleTimeoutMillis	:	config.poolIdleMs,
	log	:	false,
});