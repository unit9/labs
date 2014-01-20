'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		watch: {
			livereload: {
				options: {
					livereload: '<%= connect.livereload.options.livereload %>'
				},
				files: [
					'**/*'
				]
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
		}
	});

	grunt.registerTask('serve', [
		'connect',
		'watch'
	]);
};