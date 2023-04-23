const fs = require('fs')
const fetch = require('node-fetch')


async function fetchImages({ urls,workerId }) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    const { url: url1, filepath: filepath1, imgTitle: title1 } = urls[0]



    return new Promise(async (resolve, reject) => {
        try {

            const response1 = await fetch(url1)

                const stream1 = fs.createWriteStream(filepath1)
                stream1.on('close', () => {
               
                    resolve({ filepath: filepath1, title: title1 })
                })
                stream1.on('error', (error) => {
                    console.log('error 1---', error)
                    resolve(true)
                })

                response1.body.pipe(stream1)
        
        } catch (error) {
            console.log('error 3---', error)
            resolve(true)
        }


    })
}

module.exports = { fetchImages }