const gulp = require('gulp')
const svgmin = require('gulp-svgmin')
const sassInlineSvg = require('gulp-sass-inline-svg')
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const runSequence = require('run-sequence')

gulp.task('svg', function(){
  return gulp.src('./src/icons/**/*.svg')
    .pipe(svgmin())
    .pipe(sassInlineSvg({
      destDir: './src/stylesheets/vendor'
    }))
})

gulp.task('styles', () => {
  return gulp.src('./src/stylesheets/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest('./dist/stylesheets'))
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/stylesheets'))
})

gulp.task('style-helpers', () => {
  const paths = ['functions', 'variables']
  const base  = './src/stylesheets/'
  const dist  = './dist/stylesheets'

  return paths.forEach((path) => {
    const src = base + path + '/**/*'
    gulp.src(src, { base: base }).pipe(gulp.dest(dist))
  })
})

gulp.task('watch', () => {
  gulp.watch('./src/stylesheets/**/*', ['svg', 'styles']);
});

gulp.task('default', () => {
  runSequence(
    'svg',
    'styles',
    'style-helpers',
    'watch'
  )
})
