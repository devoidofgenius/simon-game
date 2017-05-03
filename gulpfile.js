const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const babel       = require('gulp-babel');
const reload      = browserSync.reload;

const src = {
    scss: 'app/src/scss/*.scss',
    css:  'app/css/',
    scripts:   'app/src/scripts/*.js',
    js:   'app/js/',
    html: 'app/*.html'
};

// Compile JS with Babel
gulp.task('js', function() {
   return gulp.src(src.scripts)
       .pipe(babel({
           presets: ['es2015']
       }))
       .pipe(gulp.dest(src.js))
       .pipe(reload({stream: true}));
});

// Compile sass into CSS
gulp.task('sass', function() {
    return gulp.src(src.scss)
        .pipe(sass())
        .pipe(gulp.dest(src.css))
        .pipe(reload({stream: true}));
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'js'], function() {
    browserSync.init({
        server: "./app"
    });
    gulp.watch(src.scss, ['sass']);
    gulp.watch(src.scripts, ['js']);
    gulp.watch(src.html).on('change', reload);
});


gulp.task('default', ['serve']);
