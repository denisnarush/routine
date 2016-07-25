/*global module, require*/
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({

        less: {
            dev: {files: {'pages/home.css': 'pages/home.less'}}
        },

        autoprefixer: {
            dev: {
                options: {
                    browsers: ['iOS 9']
                },
                files: {
                    'css/index.prefix.css': 'css/index.css'
                }
            }
        },

        watch: {
            'svg': {
                files: ['images/*.svg'],
                tasks: ['svgmin']
            },
            'ui': {
                files: ['ui-components/**/*.less', 'less/layout.less'],
                tasks: ['less']
            },
            'blocks': {
                files: ['blocks/**/*.less'],
                tasks: ['less']
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
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-svgmin');

    grunt.registerTask('default', ['less']);
    grunt.registerTask('svg', ['svgmin']);
};