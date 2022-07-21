const fs = require('fs');
const handlebars = require('handlebars');
const sass = require('sass');
const esbuild = require('esbuild');
const {watch} = require('chokidar');

let compiled = handlebars.compile(fs.readFileSync('./src/index.hbs', 'utf8'));
fs.writeFileSync('./dist/index.html', compiled({}));

sass.compileAsync("./src/app.scss",{
    sourceMap: true,
    outputStyle: 'compressed'
})
    .then(result => {
    fs.writeFileSync('./dist/app.css', result.css);
})
    .catch(err => {
    console.log(err);
    process.exit(1);
});

watch('./src/**/*.ts', {}).on('change', (path) => {
    console.log(`building... ${path}`);
    esbuild.build({
        entryPoints: ['./src/app.ts'],
        bundle: true,
        sourcemap : true,
        target : 'es2015',
        minify : true,
        outfile: './dist/app.js',
        tsconfig: './tsconfig.json'
    }).catch(() => process.exit(1));
});