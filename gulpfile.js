const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const rimraf = require('rimraf');
const rename = require("gulp-rename");


// _________Server_________
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload);
});

// ___________Pug Compile___________
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/templates/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'));
});

// ___________Styles Compile_____________

gulp.task('styles:compile', function () {
    return gulp.src('source/css/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/css'))
});
gulp.task('styles:compile_header', function () {
    return gulp.src('source/css/header.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('header.min.css'))
        .pipe(gulp.dest('build/css'))
});



// ___________Delete__________
gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
});

// __________Copy Fonts____________
gulp.task('copy:fonts', function () {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});
// __________Copy Images___________
gulp.task('copy:images', function () {
    return gulp.src('./source/img/**/*.*')
        .pipe(gulp.dest('build/img'));
});

//____________Copy Script_____________
gulp.task('copy:script', function () {
    return gulp.src('./source/js/**/*.*')
        .pipe(gulp.dest('build/js'));
});

// _____________Copy______________
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

// __________________Watchers________________
gulp.task('watch', function () {
    gulp.watch('source/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/css/**/*.scss', gulp.series('styles:compile', 'styles:compile_header'));
    gulp.watch('source/js/**/*.js', gulp.series('copy:script'));
});


// _______________Default______________
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('copy:images', 'templates:compile', 'styles:compile', 'copy:script',  'copy', 'styles:compile_header'),
    gulp.parallel('watch', 'server')
));