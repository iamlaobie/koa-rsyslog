var os = require('os');
var util = require('util');
var moment = require('moment');
var winston = require('winston');
require('winston-rsyslog');

module.exports = function (options) {
  options.port = options.port || 514;
  options.facility = options.facility || '0';
  options.protocol = options.protocol || 'U';
  options.hostname = options.hostname || os.hostname();

  var logger = new(winston.Logger)({
    transports: [
      new(winston.transports.Rsyslog)(options)
    ]
  });
  return function* (next) {
    var start = new Date;
    yield next;
    var ms = new Date - start;
    var format = '%s - - [%s] "%s %s%s HTTP/1.X" %d %s %s ms';
    var length = this.length ? this.length.toString() : '-';
    var date = moment().format('YYYY-MM-DD HH:mm:ss ZZ');
    var msg = util.format(format, this.ip, date, this.method, this.path, this.request.search, this.status, length, ms);
    if (options.getExtra)  {
      msg += " " + options.getExtra(this.request)
    }
    msg += "\n"
    logger.info(msg)
  }
};
