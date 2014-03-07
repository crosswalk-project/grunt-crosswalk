# grunt-crosswalk

grunt-crosswalk is a grunt plugin for packaging applications into an apk so they can be installed on an android device. It builds on top of the [crosswalk-apk-generator](https://github.com/crosswalk-project/crosswalk-apk-generator).

# License

Apache version 2, copyright Intel Corporation Ltd. See <em>LICENSE</em> for more details.

# Contributing

Bug reports and feature requests are encouraged: please
use the [github issue tracker for the project]
(https://github.com/crosswalk-project/grunt-crosswalk/issues)
to file them.

If you are interested in contributing code to the project, please see
the <em>HACKING.md</em> file. Pull requests should be targeted at the
master branch.

# Getting started

To use grunt-crosswalk in your own project, install it with:

    npm install grunt-crosswalk --save-dev

Once the plugin has been installed, enable it with a line of JavaScript in your Gruntfile.js:

    module.exports = function (grunt) {
      grunt.loadNpmTasks('grunt-crosswalk');

      // grunt.initConfig({ ... }) etc.
    };

# Dependencies

grunt-crosswalk has been tested on:

*   Ubuntu Linux (64bit)
*   Ubuntu Linux (32bit)
*   Windows 7 Enterprise (64bit)

grunt-crosswalk depends on the [crosswalk-apk-generator]
(https://github.com/crosswalk-project/crosswalk-apk-generator) and shares
its dependencies. In general, the Android SDK should be installed and
setup up correctly, particularly the 'android' (or 'android.bat' on
Windows) command should be in the PATH; and the Crosswalk SDK should be
installed and the XWALK_APP_TEMPLATE environment variable set to point
to the xwalk_app_template directory within it.

# General configuration

TODO

# Tasks

TODO

## Example Gruntfile.js

TODO
