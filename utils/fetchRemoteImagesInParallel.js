
require('dotenv').config()

async function fetchRemoteImages() {
 

    const { workerPromise } = require('./workerPromise')
    const { walkSync } = require(`${process.cwd()}/utils/walkSync`)
    const path = require('path')

    const plimit = require('p-limit');

    const limit = plimit(20);

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
    console.log('result finished', result)

}


module.exports = {
    fetchRemoteImages
}
debugger