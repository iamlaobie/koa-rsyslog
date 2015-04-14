# koa-rsyslog
rsyslog for koa

var koa = require('koa');
var rsyslog = require('koa-rsyslog');
var app = koa();

app.use(rsyslog({
  "host": "172.31.11.99",
  "tag": "info4k"
}));
