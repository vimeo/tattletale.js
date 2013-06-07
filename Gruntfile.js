module.exports = function(grunt) {
    'use strict';

// Helper Methods ____________________________________________________________

    function generateBanner() {
        var banner = '';
        banner += '/**\n';
        banner += ' * <%= pkg.name %>\n';
        banner += ' * <%= pkg.description %>\n';
        banner += ' * \n';
        banner += ' * @author <%= pkg.author %>\n';
        banner += ' * @version <%= pkg.version %>\n';
        banner += ' * @license <%= pkg.license %>\n';
        banner += ' */\n';

        return banner;
    }

// Initialization ____________________________________________________________

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: ['tattletale.js'],
            options: {
                'jshintrc': '.jshintrc'
            }
        },

        mocha: {
            options: {
                reporter: 'Spec',
                run: true
            },
            desktop: {
                src: ['test/tattletale-test.html']
            }
        },

        uglify: {
            options: {
                banner: generateBanner(),
                preserveComments: 'some',
                report: 'gzip'
            },
            my_target: {
                files: {
                    'tattletale.min.js': 'tattletale.js'
                }
            }
        }
    });

// Plug-In Loading ___________________________________________________________

    // Load the plugins that provide the tasks we specified in package.json
    var npm_packages = [
        'grunt-contrib-jshint',
        'grunt-contrib-uglify',
        'grunt-mocha'
    ].forEach(grunt.loadNpmTasks);

// Tasks _____________________________________________________________________

    grunt.registerTask('default', ['jshint', 'mocha', 'uglify']);

};