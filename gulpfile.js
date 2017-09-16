var gulp = require('gulp');
var del = require('del');
var postcss = require('gulp-postcss')
var autoprefixer = require('autoprefixer')
var cssnano = require('cssnano')
var babel = require('gulp-babel');
var uglify = require('gulp-uglifyjs');
const eslint = require('gulp-eslint');


gulp.task('rm', function() {
    //You can use multiple globbing patterns as you would with `gulp.src`
    return del(['dist/css/*']);
    return del(['dist/js/*']);
    }
)

gulp.task('postcss', ['rm'], function () {
    var plugins = [
        autoprefixer({browsers: ['last 1 version']}),
        cssnano()
    ];
    return gulp.src('./src/css/*.css')
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('babel-uglify', ['rm'], () =>
    gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
);

gulp.task('postcss-watch', function () {
    var plugins = [
        autoprefixer({browsers: ['last 1 version']}),
        cssnano()
    ];
    return gulp.src('./src/css/*.css')
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('babel-uglify-watch', () =>
    gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
);

gulp.task('watch', function(){
    var watcher1 = gulp.watch('src/js/*.js', ['babel-uglify-watch'])
    var watcher2 = gulp.watch('src/css/*.css', ['postcss-watch']);
    watcher1.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
    watcher2.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
})

gulp.task('lint', () => {
    gulp.src(['src/js/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
})

gulp.task('default', ['rm', 'postcss', 'babel-uglify'])
