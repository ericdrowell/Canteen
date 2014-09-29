module.exports = function(grunt) {
  var files = [
    'src/canteen.js',
    'lib/md5.js'
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
        dest: 'build/canteen.js'
      },
      devLicense: {
        src: ['license.js', 'build/canteen.js'],
        dest: 'build/canteen.js'
      },
      prodLicense: {
        src: ['license.js', 'build/canteen.min.js'],
        dest: 'build/canteen.min.js'
      }
    },
    uglify: {
      prod: {
        files: {
          'build/canteen.min.js': 'build/canteen.js'
        }
      }
    },
    clean: {
      build: ['build/*'],
      examples: ['examples/build/*']
    },
    jshint: {
      options: {
        laxbreak: true
      },
      all: ['src/**/*.js']
    },
    replace: {
      all: {
        options: {
          variables: {
            VERSION: '<%= pkg.version %>',
            YEAR: '<%= grunt.template.today("yyyy") %>',
            DATE: '<%= grunt.template.today("mmmm dS, yyyy") %>'
          },
          prefix: '@@'
        },

        files: [{
          src: 'build/canteen.js',
          dest: 'build/canteen.js'
        }, {
          src: 'build/canteen.min.js',
          dest: 'build/canteen.min.js'
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
  grunt.registerTask('build', ['clean:build', 'concat:dev', 'uglify:prod', 'concat:devLicense', 'concat:prodLicense', 'replace:all']);

};