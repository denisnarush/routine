module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({

        less: {
            dev: {files: {'style.css': 'less/result.less'}}
        },

        autoprefixer: {
            dev: {
                options: {
                    browsers: ['iOS 9']
                },
                files: {
                    'css/app.prefix.css': 'css/app.css'
                }
            }
        },

        watch: {
            files: ['less/**/*.less'],
            tasks: ['less', 'autoprefixer']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['less',]);
};