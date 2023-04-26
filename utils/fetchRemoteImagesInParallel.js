
require('dotenv').config()

async function prefetchImage() {
    console.log('version 1.1.12')
    const { cropImages } = require(`${process.cwd()}/node_modules/biraradamoda/utils/cropImages`)
    const { workerPromise } = require(`${process.cwd()}/node_modules/biraradamoda/utils/workerPromise`)
    const { walkSync } = require(`${process.cwd()}/node_modules/biraradamoda/utils/walkSync`)
    const path = require('path')
    const fs = require('fs')
    const plimit = require('p-limit');

    const limit = plimit(20);

    const { downloadCollection } = require(`${process.cwd()}/node_modules/biraradamoda/utils/uploadCollection`)
    const genders = [{ gender: 'kadin', gender1: 'kadin' }, { gender: 'erkek', gender1: 'erkek' }, { gender: 'kcocuk', gender1: 'kiz-cocuk' }, { gender: 'ecocuk', gender1: 'erkek-cocuk' }]

    for (let g of genders) {
        const { gender, gender1 } = g
        await downloadCollection(gender, gender1, process.env.marka)
    }
    let filePaths = []


    if (fs.existsSync(path.join(process.cwd(), `erkek/unzipped-data`))) {
        walkSync(path.join(process.cwd(), `erkek/unzipped-data`), async (filepath) => {
            filePaths.push(filepath)
        })

    }
    if (fs.existsSync(path.join(process.cwd(), `kadin/unzipped-data`))) {
        walkSync(path.join(process.cwd(), `kadin/unzipped-data`), async (filepath) => {
            filePaths.push(filepath)
        })
    }

    if (fs.existsSync(path.join(process.cwd(), `kiz-cocuk/unzipped-data`))) {
        walkSync(path.join(process.cwd(), `kiz-cocuk/unzipped-data`), async (filepath) => {
            filePaths.push(filepath)
        })
    }

    if (fs.existsSync(path.join(process.cwd(), `erkek-cocuk/unzipped-data`))) {
        walkSync(path.join(process.cwd(), `erkek-cocuk/unzipped-data`), async (filepath) => {
            filePaths.push(filepath)
        })
    }


    const chunk = (arr, size) => arr.reduce((carry, _, index, orig) => !(index % size) ? carry.concat([orig.slice(index, index + size)]) : carry, []);



    const chunkedArray = chunk(filePaths.filter(f => f.includes(process.env.marka)), 40)
    debugger
    const result = await Promise.all(chunkedArray.map((array, i) => {
        debugger
        return limit(() => workerPromise({ buffers: array, workerId: i }))
    }));
    await cropImages()
    console.log('result finished', result)
    let countfiles = 0
    walkSync(path.join(process.cwd(), `public/img-resized`), () => {
        ++countfiles

    })

    console.log('total imgs', countfiles)
}


module.exports = {
    prefetchImage
}
debugger