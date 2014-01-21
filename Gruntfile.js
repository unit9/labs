'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		watch: {
			compass: {
				files: ['styles/{,*/}*.{scss,sass}'],
				tasks: ['compass', 'autoprefixer']
			},
			livereload: {
				options: {
					livereload: '<%= connect.livereload.options.livereload %>'
				},
				files: ['**/*']
			}
		},
		connect: {
			livereload: {
				options: {
					port: 9000,
					livereload: 35729,
					open: 'http://localhost:9000',
					hostname: '0.0.0.0',
					base: ['.']
				}
			}
		},
		compass: {
			default: {
				options: {
					sassDir: 'styles',
					cssDir: 'styles'
				}
			}
		},
		autoprefixer: {
			default: {
				src: 'styles/main.css'
			}
		}
	});

	grunt.registerTask('serve', [
		'connect',
		'compass',
		'autoprefixer',
		'watch'
	]);
};