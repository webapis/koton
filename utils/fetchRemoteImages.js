


async function fetchRemoteImages() {

    const {
         workerData
    } = require('node:worker_threads');
    const { buffers, workerId } = workerData
    const makeDir = require('make-dir');


    const path = require('path')
    const fs = require('fs')
    const placeholder = require(`${process.cwd()}/node_modules/biraradamoda/utils/placeholders.json`)
    const { fetchImages } = require(`${process.cwd()}/node_modules/biraradamoda/utils/fetchImages`)

    let counter = 0
    for (let filepath of buffers) {
        const marka = path.parse(filepath).name
        const imageHost = placeholder[marka].imageHost
        const data = JSON.parse(fs.readFileSync(filepath))
        debugger
        await makeDir(`${process.cwd()}/images/${marka}`)

        for (let product of data) {
            if (product !== null && product.imageUrl !== null) {
                const fullImageUrl = imageHost + product.imageUrl

                const destFileName =product.imageUrl.replace(/\W/g, '')+'.jpeg'
                const fileDestion = `${process.cwd()}/images/${marka}/${destFileName}`
                const cropperDest = `${process.cwd()}/public/img-resized/${marka}/${destFileName}`
                const urls = { url: fullImageUrl, filepath: fileDestion, imgTitle: product.title }
debugger
                if (!fs.existsSync(cropperDest) && counter <= 500) {

                    try {
                        await fetchImages({ urls: [urls], workerId })
                        counter = counter + 1
             
                    } catch (error) {
                        console.log('error----', error
                        )
                    }

                } 

                debugger
            } 


        }


    }

}

fetchRemoteImages()
