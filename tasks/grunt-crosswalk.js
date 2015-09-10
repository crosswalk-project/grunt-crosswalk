module.exports = function (grunt) {
  var spawnSync = require('child_process').spawnSync;
  var path = require('path');
  var which = require('which');
  var fs = require('fs');
  var semver = require('semver');
  var _ = require('lodash');

  var generate_apk = function(target,done) {
    var data = target.data;
    var options = target.options();
    var outDir = data.outDir || options.outDir || '.';

    // crosswalk-app create org.org01.webapps.annex
    // && rm -rf org.org01.webapps.annex/app
    // && cp -r build/xpk org.org01.webapps.annex/app
    // && cd org.org01.webapps.annex
    // && crosswalk-app build org.org01.webapps.annex
    // && cd ..

    var commands = {

      'crosswalk-app-create': {
        cmd: 'crosswalk-app',
        args: [
          'create',
          options.pkg
        ],
        options: {
          cwd: '.',
          stdio: 'inherit'
        }
      },

      'remove-sample-app': {
        cmd: 'rm',
        args: [
          '-r',
          'app'
        ],
        options: {
          cwd: options.pkg,
          stdio: 'inherit'
        }
      },

      'copy-apk-to-app': {
        cmd: 'cp',
        args: [
          '-r',
          '../'+options.appRoot,
          'app'
        ],
        options: {
          cwd: options.pkg,
          stdio: 'inherit'
        }
      },

      'crosswalk-app-build': {
        cmd: 'crosswalk-app',
        args: [
          'build',
          options.pkg
        ],
        options: {
          cwd: '.',
          stdio: 'inherit'
        }
      },

    };
    
    Object.keys(commands).forEach(function (command) {
      var thisCmd = commands[command];
      console.log('MAXMAXMAX:', thisCmd.cmd + ' ' + thisCmd.args.join(' '));
      var child = spawnSync(thisCmd.cmd, thisCmd.args, thisCmd.options);
    });

  };

  /**
  * Build an apk
  */
  grunt.registerMultiTask('crosswalk', 'Tasks for generating apk packages for crosswalk on Android', function (identifier) {
    console.log('MAXMAXMAX');
    var done = this.async();

    generate_apk(this, done);
  });

};

