/*global module, require*/
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({

        less: {
            'dev': {files: {'pages/home.css': 'pages/home.less'}}
        },

        cssmin: {
            'dev': {
                options: {
                    restructuring: false
                },
                files: [{
                    expand: true,
                    cwd: 'pages',
                    src: ['*.css', '!*.min.css'],
                    dest: 'pages',
                    ext: '.min.css'
                }]
            }
        },

        watch: {
            'svg': {
                files: ['images/*.svg'],
                tasks: ['svgmin']
            },
            'dev': {
                files: ['blocks/**/*.less', 'blocks.theme/**/*.less'],
                tasks: ['less:dev', 'cssmin:dev']
            }
        },
        
        svgmin: {
            options: {
                plugins: [
                    {
                        removeUselessStrokeAndFill: false
                    }, {
                        removeAttrs: {
//                            attrs: ['xmlns']
                        }
                    }
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['*.svg'],
                    dest: 'images/svg-min/',
                    ext: '.min.svg'
                }]
            }
        }


    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-svgmin');

    grunt.registerTask('default', ['less:dev', 'cssmin:dev']);
    grunt.registerTask('svg', ['svgmin']);
};