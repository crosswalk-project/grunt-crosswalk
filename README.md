# grunt-crosswalk

grunt-crosswalk is a grunt plugin for applications into an apk so they can be installed on an android device. It builds on top of the [crosswalk-apk-generator](https://github.com/crosswalk-project/crosswalk-apk-generator).

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

This plugin requires **Grunt ~0.4.0**.

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

The shared configuration for both tasks (<code>crosswalk_prepare</code> and <code>crosswalk</code>) should be added to <code>grunt.initConfig()</code> as follows:

    grunt.initConfig({
      // ... other task configuration ...

      crosswalk_configuration: {
        // location on the device to install the crosswalk-app.sh script to
        // (default: '/tmp')
        crosswalkAppScriptDir: '/home/developer/',

        // path to the config.xml file for the crosswalk apk file
        // (default: 'config.xml')
        configFile: 'data/config.xml',

        // path to the sdb command (default: process.env.SDB or 'sdb')
        sdbCmd: '/home/bilbo/bin/sdb'
      }
    });

The <code>crosswalk-app.sh</code> script is a shell script which runs on crosswalk devices, wrapping native crosswalk commands to make them simpler to call remotely via <code>sdb shell</code>. It also does some of the work to interpret error messages and output from the crosswalk commands to simplify the grunt-crosswalk code. You can find it in the <em>scripts</em> directory of the grunt-crosswalk source.

Configuration for grunt-crosswalk tasks is described below.

# Tasks

## crosswalk_prepare task

This task automates pushing the <em>crosswalk-app.sh</em> script to the attached device, overwriting any file already in the specified location. It also applies a <code>chmod +x</code> to the script to make it executable.

The destination of the file is <code>crosswalkAppScriptDir</code> (from <em>crosswalk_configuration</em>) + <code>'crosswalk-app.sh'</code>.

The task requires no configuration beyond that in the <em>crosswalk_configuration</em> section (see above).

Run it with:

    grunt crosswalk_prepare

You only need to run this task once to put the script in place. Once you've done this, you should be able to use the full range of commands to the crosswalk task, as described below.

It is also possible to run the <em>crosswalk-app.sh</em> script independently of grunt-crosswalk: see the script for details of how to invoke it.

## crosswalk task

The crosswalk task wraps the sdb command to perform various actions with a project.

The crosswalk task is actually a multitask, but is typically used to run different actions on the target device, specified by an <code>action</code> option (see *Options* below).

Note that several tasks rely on metadata from a <em>config.xml</em> file (crosswalk package configuration XML file). A minimal version of this might look like:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets"
        xmlns:crosswalk="http://crosswalk.org/ns/widgets"
        id="https://github.com/01org/tetesttest"
        version="0.0.1"
        viewmodes="fullscreen">
    <name>MyApplication</name>
    <icon src="icon.png"/>
    <crosswalk:application id="myapplictn.7dhfyr7e7f"
                       package="myapplictn"
                       required_version="2.1"/>
    <content src="index.html"/>
</widget>
```

The important data here are the <code>id</code> and <code>package</code> of the <code>crosswalk:application</code> element. In grunt-crosswalk, these are referred to as the **app ID** and the **package name** respectively. These identifiers are required by the <code>pkgcmd</code> and <code>wrt-launcher</code> commands on the crosswalk device. They are automagically provided to the <em>crosswalk-app.sh</em> script when certain crosswalk task subcommands are invoked.

It is also important to note that these tasks are intended for the control of a single application, with a single <em>config.xml</em> file, and are not intended to control multiple applications simultaneously.

Having said that, the Bridge API (in <em>lib/bridge.js</em>) provides a low-level wrapper around <code>sdb</code> which is not tied to a single <em>config.xml</em> file. Alternative grunt tasks could be defined on top of the Bridge API if more flexibility were needed.

### Options

#### asRoot

type: boolean, default: false

If set to <code>true</code>, grunt-crosswalk attempts to run the action specified as the root user on the device. It does this by preceding the "real" action with a call to <code>sdb root on</code>, then calling the action, then calling <code>sdb root off</code>.

If the action fails, grunt-crosswalk will still attempt to call <code>sdb root off</code> to ensure that any further commands do not run as root.

If at any point you need to reset to the non-root user but are unable to do so via grunt-crosswalk, call the following directly instead:

    $ sdb root off

#### action

type: string, mandatory

The <em>action</em> option specifies which subcommand to run. The available values are:

*   **push:** Push one or more files to the device.
*   **install:** Install one or more apk files which are already on the device.
*   **uninstall:** Uninstall an application which is already installed on the device.
*   **start:** Start an application already installed on the device.
*   **stop:** Stop an application which is running on the device.
*   **debug:** Start an application on the device in debug mode.
*   **script:** Run an arbitrary script/command on the device.

Each action has its own additional options, as described in the following sections.

### action: push

*   *localFiles*

    type: string | string[] | object, mandatory

    *   If the value is a string, it is treated as a reference to a single file on the local filesystem. If a relative path, it is resolved relative to <em>Gruntfile.js</em>.
    *   If an array of strings, this option is treated as a reference to multiple files on the local filesystem.
    *   If an object, the value should have the following format:

            localFiles: {
              pattern: 'foo/bar/*',
              filter: 'latest'
            }

        *   The <em>pattern</em> property is a file glob pattern which is matched against local files.
        *   The <em>filter</em> property is optional. Currently only <em>'latest'</em> is supported. If set to this value, only the most recent of the files matching <em>pattern</em> is pushed.

*   *remoteDir*

    type: string, mandatory

    The remote directory on the device to which the files specified by <em>localFiles</em> should be pushed.

    The destination filename for a file is the basename of the local file joined to <em>remoteDir</em>.

*   *chmod*

    type: string, default: null

    The chmod string to apply to each file after it is pushed to the device, to set permissions for the file. This can be a symbolic string (e.g. 'a+x') or an octal one (e.g. '0777').

*   *overwrite*

    type: boolean, default: true

    If set to <code>true</code>, any existing file with a matching file name will be overwritten. If <code>false</code>, the action will fail if a file with the same path already exists on the device.

### action: install

*   *remoteFiles*

    type: string | string[] | object, mandatory

    Specifies the paths of apk files on the device which should be installed.

    See <em>push options &gt; localFiles</em> (above) for the acceptable values.

### action: uninstall

*   *stopOnFailure*

    type: boolean, default: false

    If the application cannot be uninstalled and this option is set to <code>true</code>, grunt will exit with an error. If <code>false</code>, any subsequent tasks will still run even if this task failed.

### action: start

*   *stopOnFailure*

    type: boolean, default: false

    If the application cannot be started and this option is set to <code>true</code>, grunt will exit with an error. If <code>false</code>, any subsequent tasks will still run even if this task failed.

### action: stop

*   *stopOnFailure*

    type: boolean, default: false

    If the application cannot be stopped and this option is set to <code>true</code>, grunt will exit with an error. If <code>false</code>, any subsequent tasks will still run even if this task failed.

### action: debug

*   *localPort*

    type: integer, default: 8888

    If an application is started in debug mode, this specifies the local port which should be connected to the remote debug port on the device.

*   *browserCmd*

    type: string, default: null

    Command to open a browser with the debug window for the application. If set, grunt-crosswalk will attempt to run the specified browser.

    The string should have a format like:

        'google-chrome %URL%'

    The '%URL%' part of this provides a placeholder for grunt-crosswalk to insert the debug URL for the application.

    At the moment, only Google Chrome is known to work as a debug client for crosswalk apps.

*   *stopOnFailure*

    type: boolean, default: false

    If the application cannot be started and this option is set to <code>true</code>, grunt will exit with an error. If <code>false</code>, any subsequent tasks will still run even if this task failed.

    Note that if you are debugging and any step in the debug sequence fails (i.e. if a remote port cannot be established on the device, or the browserCmd is not set), grunt will exit anyway. This option only has an effect on the application start itself.

### action: script

By default, running this action invokes the specified remoteScript like this:

    remoteScript <package name> <app ID>

where:

*   <code>&lt;package name&gt;</code> is the value of the <code>widget.crosswalk:application@package</code> attribute in <em>config.xml</em>.
*   <code>&lt;app URI&gt;</code> is the value of the <code>widget.crosswalk:application@id</code> attribute in <em>config.xml</em>.

Extra arguments can be passed to the script by setting the <em>args</em> option.

Options:

*   *remoteScript*

    type: string, mandatory

    Remote path on the device of the script to be executed.

*   *args*

    type: string[], default: []

    Extra arguments to pass to the script.


## Example Gruntfile.js

    grunt.initConfig({
      crosswalk_configuration: {
        crosswalkAppScriptDir: '/home/developer/',
        configFile: 'config.xml',
        sdbCmd: 'sdb'
      },

      crosswalk: {
        push: {
          action: 'push',
          localFiles: {
            pattern: 'build/*.apk',
            filter: 'latest'
          },
          remoteDir: '/home/developer/'
        },

        install: {
          action: 'install',
          remoteFiles: {
            pattern: '/home/developer/*.apk',
            filter: 'latest'
          }
        },

        uninstall: {
          action: 'uninstall'
        },

        start: {
          action: 'start',
          stopOnFailure: true
        },

        stop: {
          action: 'stop',
          stopOnFailure: false
        },

        debug: {
          action: 'debug',
          browserCmd: 'google-chrome %URL%',
          localPort: 9090,
          stopOnFailure: true
        }
      }
    });
