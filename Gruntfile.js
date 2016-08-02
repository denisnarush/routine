/*global module, require*/
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({

        less: {
            dev: {files: {'pages/home.css': 'pages/home.less'}}
        },

        watch: {
            'svg': {
                files: ['images/*.svg'],
                tasks: ['svgmin']
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
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-svgmin');

    grunt.registerTask('default', ['less']);
    grunt.registerTask('svg', ['svgmin']);
};