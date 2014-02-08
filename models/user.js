var crypto = require('crypto');
var mongodb = require('./db');

function User(user) {
  this.name = user.name;
  this.password = user.password;
};
module.exports = User;

//存储用户信息
User.prototype.save = function(callback) {
  var user = {
      name: this.name,
      password: this.password
  };
  if(!require('../settings').allowRegister){
    //不允许注册
    return callback('Reg not allowed');
  }
  mongodb.acquire(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.release(db);
        return callback(err);
      }
      collection.insert(user, {safe: true}, function (err, user) {
        mongodb.release(db);
        callback(null, user[0]);
      });
    });
  });
};
//读取用户信息
User.get = function(name, callback) {
  mongodb.acquire(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.release(db);
        return callback(err);
      }
      collection.findOne({
        name: name
      }, function(err, user){
        mongodb.release(db);
        if (user) {
          return callback(null, user);
        }
        callback(err);
      });
    });
  });
};