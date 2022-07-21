const fs = require('fs');
const fsExtra = require('fs-extra');
const handlebars = require('handlebars');
const sass = require('sass');
const esbuild = require('esbuild');
const {watch} = require('chokidar');

//Get ENV mode
const mode = process.env.NODE_ENV || 'development';
console.log(`Mode: ${mode}`);

//* Copy Assets Folder to Dist *//
console.log('copying assets...');
fsExtra.copy('assets', 'dist/assets', {recursive: true}, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('copying assets...done');
});

//* Generate HTML File *//
console.log('generating html...');
let compiled = handlebars.compile(fs.readFileSync('./src/index.hbs', 'utf8'));
fs.writeFileSync('./dist/index.html', compiled({}));
console.log('generating html...done');

//* Transpile SASS to CSS *//
console.log('transpiling sass...');
sass.compileAsync("./src/app.scss",{
    sourceMap: true,
    outputStyle: 'compressed'
})
    .then(result => {
        fs.writeFileSync('./dist/app.css', result.css);
        console.log('transpiling sass...done');
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });


//* Transpile Typescript to Javascript *//
console.log(`transpiling typescript...${mode}`);
if(mode === 'development') {
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
}
else {
    esbuild.build({
        entryPoints: ['./src/app.ts'],
        bundle: true,
        sourcemap : true,
        target : 'es2015',
        minify : true,
        outfile: './dist/app.js',
        tsconfig: './tsconfig.json'
    }).then(()=>{
        console.log('transpiling typescript...done');
    }).catch(() => process.exit(1));
}