module.exports = function(grunt) {
  var files = [
    'src/canteen.js',
    'lib/md5.js',
    'lib/observe.js'
  ];

  // Project configuration.
  var config = {
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dev: {
        src: files,
        dest: 'dist/canteen.js'
      },
      devLicense: {
        src: ['license.js', 'dist/canteen.js'],
        dest: 'dist/canteen.js'
      },
      prodLicense: {
        src: ['license.js', 'dist/canteen.min.js'],
        dest: 'dist/canteen.min.js'
      }
    },
    uglify: {
      prod: {
        files: {
          'dist/canteen.min.js': 'dist/canteen.js'
        }
      }
    },
    clean: {
      dist: ['dist/*'],
      examples: ['examples/dist/*']
    },
    jshint: {
      options: {
        laxbreak: true
      },
      all: ['src/**/*.js']
    },
    replace: {
      dev: {
        options: {
          variables: {
            VERSION: 'dev',
            DATE: '<%= grunt.template.today("yyyy-mm-dd") %>'
          },
          prefix: '@@'
        },

        files: [{
          src: ['dist/canteen.js'],
          dest: 'dist/canteen.js'
        }]
      }
    },
    watch: {
      src: {
        files: ['src/**/*.js'],
        tasks: ['build'],
        options: {
          spawn: false,
        },
      }
    }
  };

  grunt.initConfig(config);

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Tasks
  grunt.registerTask('build', ['clean:dist', 'concat:dev', 'uglify:prod', 'concat:devLicense', 'concat:prodLicense']);

};