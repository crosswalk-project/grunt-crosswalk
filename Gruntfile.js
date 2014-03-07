module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-release');

  grunt.initConfig({
    release: {
      options: {
        // manage add/commit/push manually
        add: true,
        commit: true,
        push: true,

        bump: true,
        tag: true,
        pushTags: true,
        npm: true,
        folder: '.',
        tagName: '<%= version %>',
        tagMessage: 'Version <%= version %>'
      }
    }

  });
};
