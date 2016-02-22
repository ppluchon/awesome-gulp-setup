var fs = require('fs');
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var minimist = require('minimist');
var webpack = require('gulp-webpack');
<% if(includeImagemin) {%>
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
<% } %>

var knownOptions = {
  boolean: 'production',
  default: { production : false }
};

var options = minimist(process.argv.slice(2), knownOptions);


gulp.task('sass', function(){
	<% if(includeWebserver) { %>
		if(options.production)
		{
			return gulp.src('src/scss/*.scss')
			.pipe(plumber())
			.pipe(sass.sync({
				outputStyle: 'compressed',
				errLogToConsole: true
			}))
			.pipe(autoprefixer({
	            browsers: ['last 3 versions'],
	            cascade: false
	        }))
			.pipe(gulp.dest("public/dist/css"))
			.pipe(browserSync.stream())
		} else {
			return gulp.src('src/scss/*.scss')
			.pipe(plumber())
			.pipe(sass.sync({
				errLogToConsole: true
			}))
			.pipe(gulp.dest("public/dist/css"))
			.pipe(browserSync.stream())
		}
	<% } else {%>
		if(options.production)
		{
			return gulp.src('src/scss/*.scss')
			.pipe(plumber())
			.pipe(sass.sync({
				outputStyle: 'compressed',
				errLogToConsole: true
			}))
			.pipe(autoprefixer({
	            browsers: ['last 3 versions'],
	            cascade: false
	        }))
			.pipe(gulp.dest("public/dist/css"))
		} else {
			return gulp.src('src/scss/*.scss')
			.pipe(plumber())
			.pipe(sass.sync({
				errLogToConsole: true
			}))
			.pipe(gulp.dest("public/dist/css"))
		}
	<% } %>
	
	
});

gulp.task('webpack', function(){
	<% if(includeWebserver) { %>
		if(options.production)
		{
			return gulp.src('src/js/main.js')
			.pipe(webpack( require('./webpack.production.config.js') ))
			.pipe(gulp.dest('public/dist/js/'))
			.pipe(browserSync.stream());
		} else {
			return gulp.src('src/js/main.js')
			.pipe(webpack(require('./webpack.config.js') ))
			.pipe(gulp.dest('public/dist/js/'))
			.pipe(browserSync.stream());
		}
	<% } else {%>
		if(options.production)
		{
			return gulp.src('src/js/main.js')
			.pipe(webpack( require('./webpack.production.config.js') ))
			.pipe(gulp.dest('public/dist/js/'))
		} else {
			return gulp.src('src/js/main.js')
			.pipe(webpack(require('./webpack.config.js') ))
			.pipe(gulp.dest('public/dist/js/'))
		}
	<% } %>
	
})

<% if(includeImagemin) {%>
gulp.task('imagemin', () => {
    return gulp.src('src/assets/**/*')
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('public/assets'));
});
<% } %>

gulp.task('default', [<% if(includeImagemin) {%>'imagemin',<% } %> 'webpack', 'sass'], function(){
	<% if(includeWebserver) {%>
		<% if(hasVhost) {%>
				browserSync.init({
	        proxy: "<%= vhostName %>"
	    	});
		<% } else { %>
				browserSync.init({
	        server: {
	            baseDir: "./public"
	        }
		    });
		<% } %>
	<% } %>

	gulp.watch("src/js/**/*.js", ['webpack']);
	gulp.watch("src/scss/**/*.scss", ['sass']);
	<% if(includeWebserver) { %>
	gulp.watch("public/*.html").on('change', browserSync.reload);
	gulp.watch("public/index.php").on('change', browserSync.reload);
	<% } %>
});