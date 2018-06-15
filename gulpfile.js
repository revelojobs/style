const gulp = require('gulp');
const svgmin = require('gulp-svgmin');
const sassInlineSvg = require('gulp-sass-inline-svg');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const liveReload = require('gulp-livereload');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');

gulp.task('svg', function(){
  return gulp.src('./src/icons/**/*.svg') 
    .pipe(svgmin())
    .pipe(sassInlineSvg({
      destDir: './src/stylesheets/vendor'
    }));
});

gulp.task('styles', () => {
  return gulp.src('./src/stylesheets/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest('./dist/stylesheets'));
});

gulp.task('minify-styles', () => {
  return gulp.src('./dist/stylesheets/main.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/stylesheets'));
});

gulp.task('style-helpers', () => {
  const paths = ['functions', 'variables'];
  const base  = './src/stylesheets/';
  const dist  = './dist/stylesheets';

  return paths.forEach((path) => {
    let src = base + path + '/**/*';
    gulp.src(src, { base: base }).pipe(gulp.dest(dist));
  });
});

// gulp.task('watch', () => {
//   liveReload.listen();

//   gulp.watch('./src/stylesheets/**/*', ['styles']);
// });

// gulp.task('serve', ['styles'], () => {
//   const browserSyncInstance = browserSync.create();

//   browserSyncInstance.init({
//     port: 8000,
//     server: {
//       baseDir: './dist'
//     }
//   });

//   gulp.watch('./dist/**/*').on('change', browserSyncInstance.reload);
// });

// gulp.task('development', () => {
//   runSequence('svg', 'styles', 'images', 'serve', 'watch');
// });

gulp.task('default', () => {
  runSequence('svg', 'styles', 'minify-styles', 'style-helpers');
});