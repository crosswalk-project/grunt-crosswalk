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

grunt-crosswalk has been tested on:

*   Ubuntu Linux (64bit)
*   Ubuntu Linux (32bit)
*   Windows 7 Enterprise (64bit)

# Dependencies

grunt-crosswalk depends on the [crosswalk-apk-generator]
(https://github.com/crosswalk-project/crosswalk-apk-generator) and shares
its dependencies.

# General configuration

The [Android SDK](http://developer.android.com/sdk/index.html) should
be installed and setup up correctly, particularly the 'android' (or
'android.bat' on MS Windows) command should be in the PATH. Also, the
Crosswalk SDK should be installed and the XWALK_APP_TEMPLATE environment
variable set to point to the xwalk_app_template directory within it.

# Tasks

You can list tasks in the *crosswalk* target. Each one
should contain the configuration data necessary to control
and build the application into desired apk package. All the
configuration items are detailed in the [crosswalk-apk-generator]
(https://github.com/crosswalk-project/crosswalk-apk-generator) in
the README file.  The *outDir*, *name*, and *version* properties are
required. Outdir specifies the directory where the generator will output
the files, and *name* and *version* are the name and version number of
the application.

## Example Gruntfile.js

```
  grunt.initConfig({
    ...
    packageInfo: grunt.file.readJSON('package.json'),
    ...
    crosswalk: {
      options: {
        //outDir: process.env.HOME+'/z/webapps/webapps-annex/build',
        outDir: 'build',

        verbose: false,

        version: '<%= packageInfo.version %>',

        // display name for the app on the device;
        // the sanitisedName used to construct the Locations object later
        // is derived from this
        name: '<%= packageInfo.name %>',

        // package for the app's generated Java files; this works best if
        // you have at least one period character between two character
        // strings, and no digits
        pkg: 'org.org01.webapps.<%= packageInfo.name.toLowerCase() %>',

        // the icon used in the android launcher/etc
        icon: 'icon_128.png',

        // should the app run as fullscreen
        fullscreen: true,

        // should the app run with remote debugging enabled
        remoteDebugging: true,

        // path to the directory containing your HTML5 app;
        // note that this must use the correct path separators for your
        // platform: Windows uses '\\' while Linux uses '/'
        appRoot: 'build/xpk',

        // the main html files of your app relative to the appRoot
        appLocalPath: 'index.html',

        // path to the root of your Android SDK installation;
        // on Windows, use the path to the sdk directory inside
        // the installation, e.g. 'c:\\android-sdk\\sdk'
        // default: automatically obtain from the 'android' command's path
        //androidSDKDir: '/opt/android-sdk-linux/',
        //androidSDKDir: '/opt/adt-bundle-linux-x86_64-20131030/sdk',

        // path to the xwalk_app_template directory; you can either 
        // download and unpack this manually, or use the xwalk_android_dl
        // script to do so (part of the crosswalk-apk-generator project;
        // see the [README](https://github.com/crosswalk-project/crosswalk-apk-generator/blob/master/README.md) for details.).
        // note that path separators specific to your platform must be used
        // can be set via an environment variable :
        // eg: export XWALK_APP_TEMPLATE=$HOME/Downloads/crosswalk-3.32.53.4-x86/xwalk_app_template
        //xwalkAndroidDir: process.env.HOME+"/Downloads/crosswalk-3.32.53.4-x86/xwalk_app_template"

        // default: automatically obtains latest from androidSDKDir/platforms
        //androidAPILevel: "18.0.1"
        //androidAPILevel: "18"
      },
      shared_build: {
        // properties defined here override the ones in options
      },
      x86_build: {
        // architecture of embedded crosswalk
        // if arch is defined for a target, an embedded apk is built;
        // otherwise, a shared one is built
        arch: 'x86'
     }
      ...
    },
    ...
  }
```
