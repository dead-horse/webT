/*!
 * webT - lib/template.js 
 * Copyright(c) 2013 
 * Author: dead-horse <dead_horse@qq.com>
 */

/**
 * Module dependencies.
 */
var fs = require('fs');
var join = require('path').join;

/**
 * Ask for user input.
 */

function ask(desc, callback) {
  process.stdout.write('  \033[90m' + desc + '\033[0m');
  process.stdin.setEncoding('utf8');
  process.stdin.once('data', callback).resume();
}

/**
 * Confirm for user input
 */
function confirm(desc, callback) {
  process.stdout.write('  \033[90m' + desc + '\033[0m');
  process.stdin.setEncoding('utf8');
  process.stdin.once('data', function (data) {
    data = String(data).trim().toLowerCase();
    callback(data === 'y' || data === 'yes');
  }).resume();
}

/**
 * Initialize a new `Template`
 */
function Template() {
  this.contentPath = join(__dirname, '..', 'template');
  this.vars = {
    projectName: 'input your project name: ',
    projectDescription: 'input your project description: ',
    authName: 'input your name: ',
    authEmail: 'input your email: '
  };
  this.pluginConfirms = {
    mysql: 'need mysql(y/n)?'
  };
  this.values = {};
  this.plugins = {};
  this.directories = {};
}

Template.prototype.init = function(dest) {
  var self = this;
  var vars = this.vars;
  var keys = Object.keys(vars);
  this.dest = dest;

  console.log();

  function next() {
    var desc;
    var key = keys.shift();

    function done(value) {
      self.values[key] = String(value).trim();
      self.values[key + 'UpperCase'] = self.values[key].toUpperCase();
      next();
    }

    if (key) {
      desc = vars[key];
      ask(desc, done);
    } else {
      self.initPlugins();
    }
  }

  next();
};

Template.prototype.initPlugins = function() {
  var self = this;
  var pluginConfirms = this.pluginConfirms;
  var keys = Object.keys(pluginConfirms);

  console.log('\nchoose plugins you want: ');

  function next() {
    var desc;
    var key = keys.shift();

    function done(value) {
      self.plugins[key] = value;
      next();
    }

    if (key) {
      desc = pluginConfirms[key];
      confirm(desc, done);
    } else {
      process.stdin.destroy();
      self.create();
    }
  }

  next();
};


/**
 * Return the files for this template.
 *
 * @return {Array}
 * @api private
 */

Template.prototype.__defineGetter__('files', function(){
  var self = this;
  var files = [];
  
  (function next(dir) {
    fs.readdirSync(dir).forEach(function (file) {
      //ignore empty file
      if (file === '.empty') {
        return;
      }
      files.push(file = dir + '/' + file);
      var stat = fs.statSync(file);
      if (stat.isDirectory()) {
        self.directories[file] = true;
        next(file);
      }
    });
  })(this.contentPath);

  return files;
});

/**
 * Create the template files.
 *
 * @api private
 */

Template.prototype.create = function() {
  var self = this;
  console.log();
  this.files.forEach(function(file) {
    var path = self.parse(file);
    var out = join(self.dest, path.replace(self.contentPath, ''));

    // directory
    if (self.directories[file]) {
      try {
        fs.mkdirSync(out, 0775);
        console.log('  \033[90mcreate :\033[0m \033[36m%s\033[0m', out);
      } catch (err) {
        // ignore
      }
    // file
    } else {
      var str = self.parse(fs.readFileSync(file, 'utf8'));
      if (str === false) {
        return;
      }
      fs.writeFileSync(out, str);
      console.log('  \033[90mcreate :\033[0m \033[36m%s\033[0m', out);
    }
  });
  console.log();
};

/**
 * Parse `str`.
 *
 * @return {String}
 * @api private
 */

Template.prototype.parse = function(str){
  var self = this;
  //parse plugins
  if (str.indexOf('@') === 0) {
    var plugin = str.match(/^\@(\w+)\n/)[1];
    if (!this.plugins[plugin]) {
      return false;
    } else {
      str = str.replace(/^\@\w+\n/, '');
    }
  }
  str = str.replace(/\@(\w+)\n((.|\n)*?)\@end\n/, function (_, plugin, value) {
    return self.plugins[plugin] ? value : '';
  });
  return str
    .replace(/\{\{([^}]+)\}\}/g, function(_, key){
      return self.values[key];
    });
};

exports.create = function () {
  return new Template();
};
