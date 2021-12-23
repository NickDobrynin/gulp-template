export const phpmailer = () => {
    return app.gulp.src(app.path.src.phpmailer)
        .pipe(app.gulp.dest(app.path.build.phpmailer));
}

export const myphp = () => {
    return app.gulp.src(app.path.src.php)
        .pipe(app.gulp.dest(app.path.build.php));
}