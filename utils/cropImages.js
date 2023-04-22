
require('dotenv').config()
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
async function cropImages() {
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

    try {
        await Promise.all(promises)


    } catch (error) {
        console.log('all promse', error)
    }
}



module.exports = {
    cropImages
}






