var express = require('express');
var router = express.Router();
var base = require('./base');
var session = require('session');
var app = express();
app.use(session({
  secret: '12345',
  resave: true,
  saveUninitialized: true
}));
router.post('/login', function(req, res) {
  var name = req.body.Name;
  var pwd = req.body.pwd;
  base(function(con) {
    var sql = 'select *from user where username =\'' + name + '\';';
    con.query(sql, function(err, result) {
      if (err) {
        throw err;
      }
      if (result.length !== 0) {
        if (name === result[0].username && pwd === result[0].password) {
          var sql2 = 'UPDATE user set states = \'logined\' where id = ' + result[0].id + ';';
          con.query(sql2, function(err) {
            if (err) {
              throw err;
            }
          });
          req.session.userInfo = name;
          res.render('user', { name: req.session.userInfo });
        } else {
          res.render('login');
        }
      } else {
        res.render('login');
      }

    });
  }, 'emailSystem');
});
