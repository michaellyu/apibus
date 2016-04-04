var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

var path = {
    scripts: {
        src: './src/apibus.js',
        name: 'apibus.min.js',
        out: './dist',
        demo: './demo/public/assets/lib'
    },
    lua: {
        src: './src/apibus.lua',
        out: './dist',
        demo: './demo/apis'
    }
};

gulp.task('publish', function () {
    gulp.src(path.scripts.src)
        .pipe(gulp.dest(path.scripts.out))
        .pipe(gulp.dest(path.scripts.demo))
        .pipe(uglify({preserveComments: 'license'}))
        .pipe(rename(path.scripts.name))
        .pipe(gulp.dest(path.scripts.out));

    gulp.src(path.lua.src)
        .pipe(gulp.dest(path.lua.demo))
        .pipe(gulp.dest(path.lua.out));
});

gulp.task('default', ['publish']);
