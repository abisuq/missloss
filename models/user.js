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
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.insert(user, {safe: true}, function (err, user) {
        mongodb.close();
        callback(null, user[0]);
      });
    });
  });
};
//读取用户信息
User.get = function(name, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.findOne({
        name: name
      }, function(err, user){
        mongodb.close();
        if (user) {
          return callback(null, user);
        }
        callback(err);
      });
    });
  });
};