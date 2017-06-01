const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const browserSync = require("browser-sync").create();
const autoprefixer = require('gulp-autoprefixer');
const reload = browserSync.reload;
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const notify = require('gulp-notify');

gulp.task("browser-sync", () => {
	browserSync.init({
		server: "."
	});
});

gulp.task("styles", () => {
	return gulp.src("./dev/styles/**/*.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer("last 2 versions", "safari 5", "ie 8", "ie 9", "opera 12.1"))
		.pipe(concat("style.css"))
		.pipe(gulp.dest("./public/styles"))
		.pipe(reload({stream: true}));
});

gulp.task("scripts", () => {
	return browserify('./dev/scripts/main.js', {debug: true})
		.transform('babelify', {
			sourceMaps: true,
			presets: ['es2015']
		})
		.bundle()
		.on('error', notify.onError({
			message: "Error: <%= error.message %>",
			title: 'Error in JS 💀'
		}))
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./public/scripts/'))
		.pipe(reload({stream: true}))
});

gulp.task("watch", () => {
	gulp.watch("./dev/styles/**/*.scss", ["styles"]);
	gulp.watch("./dev/scripts/main.js", ["scripts"]);
	gulp.watch("*.html", reload);
});

gulp.task("default", ["browser-sync", "styles", "scripts", "watch"])