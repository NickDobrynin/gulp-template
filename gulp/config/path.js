import * as nodePath from 'path';

const   rootFolder  = nodePath.basename(nodePath.resolve()),
        buildFolder = `./dist`,
        srcFolder   = `./src`;

export const path   = {
            build:          {
                html:       `${buildFolder}/`,
                css:        `${buildFolder}/css/`,
                js:         `${buildFolder}/js/`,
                img:        `${buildFolder}/img/`,
                fonts:      `${buildFolder}/fonts/`,
                phpmailer:  `${buildFolder}/phpmailer/`,
                php:        `${buildFolder}/`,
            },
            src:            {
                html:       [`${srcFolder}/html/**/*.html`, `!${srcFolder}/html/modules/*.html`],
                css:        `${srcFolder}/scss/style.scss`,
                js:         `${srcFolder}/js/scripts.js`,
                img:        `${srcFolder}/img/**/*.{png,jpg,jpeg,gif,ico,webp}`,
                svg:        `${srcFolder}/img/**/*.svg`,
                phpmailer:  `${srcFolder}/phpmailer/**/*`,
                php:        `${srcFolder}/*.php`,
            },
            watch:          {
                html:   `${srcFolder}/**/*.html`,
                css:    `${srcFolder}/scss/**/*.scss`,
                js:     `${srcFolder}/js/**/*.js`,
                img:    `${srcFolder}/img/**/*.{png,jpg,jpeg,svg,gif,ico,webp}`,
                files:  `${srcFolder}/files/**/*.*`,
            },
            clean:          buildFolder,
            buildFolder:    buildFolder,
            srcFolder:      srcFolder,
            rootFolder:     rootFolder,
            ftp:            ``
        }