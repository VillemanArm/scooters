const { src, dest, watch, series, parallel } = require('gulp'); // подключение методов GULP
const browserSync = require('browser-sync').create(); //создание экземпляра сервера
const isProd = process.argv.includes("--production");
const isDev = !isProd;

// Плагины
const htmlmin = require('gulp-htmlmin');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const clean = require('gulp-clean');
const sass = require('gulp-sass')(require('sass'));
const shorthand = require('gulp-shorthand');
const groupCssMediaQueries = require('gulp-group-css-media-queries');
const csso = require('gulp-csso');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const webp = require('gulp-webp');
const webpHtml = require("gulp-webp-html");
const webpCss = require("gulp-webp-css-fixed");
const fonter = require("gulp-fonter-2");
const webpack = require("webpack-stream");
const fileInclude = require("gulp-file-include");
const ftp = require('vinyl-ftp');
const ftpSettings = require('./ftp_settings.json');
const connect = ftp.create(ftpSettings);
// const chalk = require('chalk');

//Задачи

const htmlTask = () => { // задача (обычная js функция)
    return src("./src/*.html") // чтение данных для обработки
        .pipe(plumber({ // замена стандартного обработчика ошибок
            errorHandler: notify.onError(error => ({
                title: 'HTML',
                message: error.message
            }))
        }))
        .pipe(fileInclude({ // импорт html шаблонов в файлы html подключение: @@include('путь к шаблону относительно файла')
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(webpHtml())
        .pipe(htmlmin({          // любое количество плагинов
            collapseWhitespace: true,
        }))
        .pipe(dest("./dist")) // запись данных после обработки
        .pipe(browserSync.stream()); //изменение отображения без перезагрузки страницы

}

const fontsTask = () => {
    return src("./src/fonts/**/*.*") //{ttf, woff, eot, svg}
        .pipe(newer("./dist/fonts/"))
        // .pipe(fonter({ //конвертер форматов eot, svg. Не передавать в него ничего другого!
        //     formats: ["ttf", "woff", "eot", "svg"]
        // }))
        .pipe(dest("./dist/fonts"))
        .pipe(browserSync.stream());

}

const worksTransferingTask = () => {
    return src("./src/works/**/*.*")
        .pipe(newer("./dist/"))
        .pipe(dest("./dist/works/"))
        .pipe(browserSync.stream());

}

const filesTransferingTask = () => {
    return src("./src/files/*.*")
        .pipe(newer("./dist/"))
        .pipe(dest("./dist/files"))
        .pipe(browserSync.stream());
}

const JSLibrariesTransferingTask = () => {
    return src("./src/js/libraries/*.*")
        .pipe(newer("./dist/js/libraries/"))
        .pipe(dest("./dist/js/libraries/"))
        .pipe(browserSync.stream());
}

const CSSLibrariesTransferingTask = () => {
    return src("./src/css/libraries/*.*")
        .pipe(newer("./dist/css/libraries/"))
        .pipe(dest("./dist/css/libraries/"))
        .pipe(browserSync.stream());
}

const sassTask = () => {
    return src("./src/css/*.sass", { sourcemaps: isDev })
        .pipe(plumber({
            errorHandler: notify.onError(error => ({
                title: 'SASS',
                message: error.message
            }))
        }))

        .pipe(sass()) // преобразование sass в css

        .pipe(webpCss())
        .pipe(autoprefixer())
        .pipe(shorthand()) // сокращение свойств, которые можно сократить
        .pipe(groupCssMediaQueries()) // сборка одинаковых медиа запросов в одно место
        .pipe(csso()) // минификация файла
        .pipe(concat("style.css"))
        .pipe(dest("./dist/css/", { sourcemaps: isDev }))
        .pipe(browserSync.stream())


}

const jsTask = () => {
    return src("./src/js/*.js", { sourcemaps: isDev })
        .pipe(plumber({
            errorHandler: notify.onError(error => ({
                title: 'JavaScript',
                message: error.message
            }))
        }))
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(dest("./dist/js/", { sourcemaps: isDev }))

}
// .pipe(concat("script.js"))
// .pipe(babel()) // перевод на ES5 для старых браузеров

const imgTask = () => {
    return src("./src/img/**/*.*")
        .pipe(plumber({
            errorHandler: notify.onError(error => ({
                title: 'Images',
                message: error.message
            }))
        }))
        .pipe(newer("./dist/img/")) // обновление только необработанных картинок
        .pipe(webp()) // конвертация картинок в webp
        .pipe(dest("./dist/img/")) // запись картинок в webp
        .pipe(src("./src/img/**/*.*"))
        .pipe(newer("./dist/img/"))
        .pipe(imagemin({ // минификация картинок
            verbose: true
        }))
        .pipe(dest("./dist/img/"))
        .pipe(browserSync.stream());
}

// наблюдение
const watcher = (cb) => {
    if (isDev) {
        watch("./src/**/*.html", htmlTask).on("all", browserSync.reload); // ожидание изменений в фоновом режиме
        watch("./src/css/**/*.sass", sassTask).on("all", browserSync.reload);
        watch("./src/js/**/*.js", jsTask).on("all", browserSync.reload);
        watch("./src/img/**/*.*", imgTask).on("all", browserSync.reload);
        watch("./src/fonts/**/*.*", fontsTask).on("all", browserSync.reload);
    }
    cb()
}

// Удаление директории сборки для ее обновления
const clear = (cb) => {
    if (isProd) {
        return src("./dist", { read: false, allowEmpty: true })
            .pipe(clean())
    }
    cb()
}

// Сервер
const server = (cb) => {
    if (isDev) {
        browserSync.init({
            server: {
                baseDir: "./dist"
            },
        });
    }
    cb()
}

//заливка на сервер
const deploy = () => {
    return src('dist/**/*.*', { buffer: false })
        .pipe(connect.newer('/domains/insight-webstudio.ru/')) // указать папку домена в корне хостинга
        .pipe(connect.dest('/domains/insight-webstudio.ru/'))
}


exports.htmlTask = htmlTask; //экспорт задачи
module.exports.watch = watcher; //экспорт задачи в другие модули
exports.clear = clear;
exports.sassTask = sassTask
exports.jsTask = jsTask
exports.imgTask = imgTask
exports.fontsTask = fontsTask
exports.worksTransferingTask = worksTransferingTask
exports.filesTransferingTask = filesTransferingTask
exports.JSLibrariesTransferingTask = JSLibrariesTransferingTask
exports.CSSLibrariesTransferingTask = CSSLibrariesTransferingTask
exports.deploy = deploy


// флаг --production запускает режим финальной сборки проекта
exports.default = series(   // последовательный список задач для всей сборки
    clear,
    htmlTask,
    sassTask,
    jsTask,
    imgTask,
    fontsTask,
    worksTransferingTask,
    filesTransferingTask,
    JSLibrariesTransferingTask,
    CSSLibrariesTransferingTask,
    parallel(watcher, server) // список задач, выполняемых параллельно
)