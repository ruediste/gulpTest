var gulp = require('gulp');
// var plugins = require('gulp-load-plugins')()
var plugins = require("gulp-load-plugins")({
	pattern : [ 'gulp-*', 'gulp.*', 'main-bower-files' ],
	replaceString : /\bgulp[\-.]/
});
var merge = require('event-stream').merge;

var dest = 'build/';
var assets = [ 'src/main/assets/**/*.*' ];

function read(suffix) {
	return merge(gulp.src(plugins.mainBowerFiles(), {
		base : './bower_components/'
	}), gulp.src(assets))
	.pipe(plugins.filter('**/*.' + suffix))
	.pipe(plugins.sourcemaps.init());

}
gulp.task('css', function() {
	merge(
	  read('css'), 
	  read('less').pipe(plugins.less())
	)
	.pipe(plugins.order([ '**/bootstrap.css', '*' ]))
	.pipe(plugins.debug({title : 'css1'}))
	.pipe(plugins.concatCss('main.css'))
	.pipe(plugins.cleanCss())
	.pipe(plugins.sourcemaps.write())
	.pipe(plugins.debug({title : 'css2'}))
	.pipe(gulp.dest(dest));

});

gulp.task('js', function() {
	gulp.src(plugins.mainBowerFiles().concat(assets)).pipe(plugins.debug({
		title : 'js1'
	}))
	.pipe(plugins.filter('**/*.js'))
	.pipe(plugins.concat('main.js'))
	.pipe(plugins.uglify())
	.pipe(plugins.debug({title : 'js2'}))
	.pipe(gulp.dest(dest));

});

gulp.task('others', function() {
	gulp.src([ 'bower_components/**/*.*' ])
	// .pipe(plugins.debug({title:'others1'}))
	.pipe(
			plugins.filter([ '**', '!**/*.js', '!**/*.less', '!**/*.css',
					'!**/*.md', '!**/*.nuspec' ])).pipe(plugins.debug({
		title : 'others2'
	})).pipe(gulp.dest(dest));
});
gulp.task('default', [ 'css', 'js', 'others' ]);