


// (async () => {
//     const im = require('imagemagick');
//     const { walkSync } = require('../walkSync')
//     const path = require('path')
//     const plimit = require('p-limit')
//     const makeDir =require('make-dir')
//     const limit = plimit(5);
//     const files = []
//     const promises = []
//     walkSync('sprites', (src) => {
//         const fileName = path.basename(src)
//         const groupName =src.split('\\')[1]
//         const srcPath= path.join(process.cwd(),src)

//         const dstPath = path.join(process.cwd(), 'sprites-cropped',groupName, fileName)
//         console.log('dstPath',dstPath)
//         debugger
//         promises.push(limit(async () => await cropImage({ srcPath, dstPath })))
//     })
//     async function cropImage({ srcPath, dstPath }) {
//         try {


//         await makeDir(path.dirname(dstPath))
//         return new Promise((resolve, reject) => {
//             im.crop({
//                 srcPath,
//                 dstPath,
//                 height: 200,

//             }, function (err, stdout, stderr) {

//                 if (err){
//                     debugger
//                     reject(err)
//                 }

//                 console.log('resized kittens.jpg to fit within 200');
//                 resolve(true)

//             });
//         })

//     } catch (error) {
//             debugger
//     }
//     }
//     try {
//         await Promise.all(promises)
//     } catch (error) {
//         debugger
//     }


// })()






(async () => {
    require('dotenv').config()
    const { execSync } = require('child_process')
    const sharp = require('sharp');
    const fs = require('fs')
    const { walkSync } = require('./walkSync')
    const makeDir = require('make-dir')
    const path = require('path')
    const plimit = require('p-limit')
    const limit = plimit(5);
    const promises = []
    let counter = 0
    let total = 0

    walkSync('images', async (src) => {
        try {
            console.log('src', src)
            const fileName = path.basename(src)
            if (fileName !== 'undefined') {

                debugger
                const marka = src.replaceAll('\\', ' ').replaceAll('/', ' ').split(' ')[1]
                if (marka !== 'undefined') {

                    const srcPath = path.join(process.cwd(), src)
                    console.log('marka', marka, fileName)
                    debugger
                    const dstPath = path.join(process.cwd(), 'public/img-resized', marka, fileName)
                    debugger
                    if (!fs.existsSync(dstPath)) {


                        await makeDir(path.dirname(dstPath))
                        debugger
                        promises.push(limit(async () => await cropImage({ srcPath, dstPath })))
                    } else {
                        console.log('file exists')
                    }
                }
            }
        } catch (error) {
            console.log('error crop----', error)
        }


    })
    async function cropImage({ srcPath, dstPath }) {

        try {
            const fs = require('fs')
            const buffer = fs.readFileSync(srcPath)
            await sharp(buffer)
                .resize(250)
                .jpeg()
                .toFile(dstPath);
            ++counter
            console.log('counter', counter)
            if (counter >= 100) {
                counter = 0
                ++total
   
            }
        } catch (error) {
            console.log('sharp error', error)
        }

    }

    try {
        await Promise.all(promises)
        // execSync('git config --global user.name "Serdar Ashirov" ')
        // execSync("git config --global user.email 'webapis@users.noreply.github.com'")
        // execSync(`git remote set-url origin https://x-access-token:${process.env.GH_TOKEN}@github.com/webapis/img-opt.git`)
        // execSync("git add .")
        // execSync("git commit -m 'Automatedreport'")
        // execSync("git push")

    } catch (error) {
        console.log('all promse', error)
    }



})()
