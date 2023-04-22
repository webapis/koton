


async function fetchRemoteImages() {

    const {
        Worker, isMainThread, parentPort, workerData
    } = require('node:worker_threads');
    const { buffers, workerId } = workerData
    const makeDir = require('make-dir');


    const path = require('path')
    const fs = require('fs')
    const placeholder = require('./placeholders.json')
    const { fetchImages } = require('./fetchImages')

    let counter = 0
    for (let filepath of buffers) {
        const marka = path.parse(filepath).name
        const imageHost = placeholder[marka].imageHost
        const data = JSON.parse(fs.readFileSync(filepath))
        debugger
        await makeDir(`${process.cwd()}/images/${marka}`)
        debugger
        for (let product of data) {
            if (product !== null && product.imageUrl !== null) {
                const fullImageUrl = imageHost + product.imageUrl
                const imageFileName = path.basename(product.imageUrl)
                const fileDestion = `${process.cwd()}/images/${marka}/${imageFileName}`
                const cropperDest = `${process.cwd()}/public/img-resized/${marka}/${imageFileName}`
                const urls = { url: fullImageUrl, filepath: fileDestion, imgTitle: product.title }
                console.log('counter', counter)
                if (!fs.existsSync(cropperDest) && counter <= 50) {

                    try {
                        await fetchImages({ urls: [urls], workerId })
                        counter = counter + 1
                        console.log('workerId', workerId)
                    } catch (error) {
                        console.log('error----', error
                        )
                    }

                } else {
                    console.log('fileDestion exists', fileDestion)
             

                }

                debugger
            } else {

                console.log('product', product)
            }


        }


    }

}

fetchRemoteImages()
debugger