
require('dotenv').config()

async function prefetchImage() {

    const { cropImages } = require(`${process.cwd()}/node_modules/biraradamoda/utils/cropImages`)
    const { workerPromise } = require(`${process.cwd()}/node_modules/biraradamoda/utils/workerPromise`)
    const { walkSync } = require(`${process.cwd()}/node_modules/biraradamoda/utils/walkSync`)
    const path = require('path')

    const plimit = require('p-limit');

    const limit = plimit(20);

    const { downloadCollection } = require(`${process.cwd()}/node_modules/biraradamoda/utils/uploadCollection`)
    const genders = [{ gender: 'kadin', gender1: 'kadin' }, { gender: 'erkek', gender1: 'erkek' }, { gender: 'kcocuk', gender1: 'kiz-cocuk' }, { gender: 'ecocuk', gender1: 'erkek-cocuk' }]
    console.log('process.env.marka', process.env.marka)
    for (let g of genders) {
        const { gender, gender1 } = g
        await downloadCollection(gender, gender1, process.env.marka)
    }
    let filePaths = []

    walkSync(path.join(process.cwd(), `erkek/unzipped-data`), async (filepath) => {
        filePaths.push(filepath)
    })
    walkSync(path.join(process.cwd(), `kadin/unzipped-data`), async (filepath) => {
        filePaths.push(filepath)
    })
    walkSync(path.join(process.cwd(), `kiz-cocuk/unzipped-data`), async (filepath) => {
        filePaths.push(filepath)
    })

    walkSync(path.join(process.cwd(), `erkek-cocuk/unzipped-data`), async (filepath) => {
        filePaths.push(filepath)
    })
    const chunk = (arr, size) => arr.reduce((carry, _, index, orig) => !(index % size) ? carry.concat([orig.slice(index, index + size)]) : carry, []);


    console.log('marka---------!', process.env.marka)
    const chunkedArray = chunk(filePaths.filter(f => f.includes(process.env.marka)), 40)
    debugger
    const result = await Promise.all(chunkedArray.map((array, i) => {
        debugger
        return limit(() => workerPromise({ buffers: array, workerId: i }))
    }));
    await cropImages()
    console.log('result finished', result)

}


module.exports = {
    prefetchImage
}
debugger