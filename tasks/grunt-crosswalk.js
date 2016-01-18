module.exports = function (grunt) {
  var spawnSync = require('child_process').spawnSync;

  var generate_apk = function(target,done) {
    var data = target.data;
    var options = target.options();
    var appRoot = options.appRoot;

    spawnSync('node_modules/grunt-crosswalk/node_modules/crosswalk-app-tools/src/crosswalk-pkg', ['-p', 'android', appRoot], {stdio: 'inherit'});
  };

  /**
  * Build an apk
  */
  grunt.registerMultiTask('crosswalk', 'Tasks for generating apk packages for crosswalk on Android', function (identifier) {
    var done = this.async();

    generate_apk(this, done);
  });

};

