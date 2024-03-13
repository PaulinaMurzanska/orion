const gulp = require('gulp')
const exec = require('child_process').exec

// deploys frontend or backend code to netsuite
gulp.task('deploy', (cb) => {
  exec('suitecloud project:deploy --accountspecificvalues WARNING', (err, stdout, stderr) => {
    console.log(stdout)
    console.log(stderr)
    cb(err)
  })
})

gulp.task('watch', () => {
  gulp.watch(['src/**/*.js', 'src/**/*.json', 'src/**/*.xml'], gulp.series('deploy'))
})