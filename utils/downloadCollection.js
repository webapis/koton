require('dotenv').config()
const fs = require('fs')
const fetch = require('node-fetch')
const makeDir = require('make-dir')
const path = require('path')

const decompress = require('decompress');
const decompressTargz = require('decompress-targz');
process.env.REPO='keyword-editor'
console.log('process.env.REPO', process.env.REPO)
async function downloadIndexFolder({ gender, gender1 }) {

    await makeDir(`assets/${gender1}`)

    const response = await fetch(`https://github.com/${process.env.REPO}/blob/${gender}/public/indexes.tar.gz?raw=true`, { method: 'get' })

    var file = fs.createWriteStream(`assets/${gender1}/indexes.tar.gz`);

    return new Promise((resolve, reject) => {
        file.on('close', () => {
            console.log('fetched')
            resolve()

        })
        response.body.on('error', (error) => {
            reject(error)

        })

        response.body.pipe(file)
    })

}

async function decompressIndexFolder({ gender1 }) {
    await makeDir(`assets/${gender1}`)
    return new Promise((resolve, reject) => {

        decompress(`assets/${gender1}/indexes.tar.gz`, gender1, {
            plugins: [
                decompressTargz()
            ]
        }).then(() => {
            console.log('Files decompressed');
            resolve(true)
        }).catch(error => {
            console.log('Files decompressed error');
            reject(error)
        })


    })

}




async function getContent(filepath, gender1) {
    console.log('filepath', filepath)
    const fileName = path.basename(filepath)
    
    await makeDir(`assets/${gender1}`)
    const response = await fetch(filepath, { method: 'get', headers: { Accept: "application/vnd.github.raw", authorization: `token ${process.env.GH_TOKEN}`, "X-GitHub-Api-Version": "2022-11-28" } })

    var file = fs.createWriteStream(`assets/${gender1}/${fileName}`);



    return new Promise((resolve, reject) => {
        file.on('close', () => {
            console.log('fetched')
            resolve()

        })
        response.body.on('error', (error) => {
            reject(error)

        })

        response.body.pipe(file)
    })

}




(async () => {

    const genders = [{ gender: 'kadin', gender1: 'kadin' }, { gender: 'erkek', gender1: 'erkek' }, { gender: 'kcocuk', gender1: 'kiz-cocuk' }, { gender: 'ecocuk', gender1: 'erkek-cocuk' }]

    for (let g of genders) {
        const { gender, gender1 } = g
        console.log('gender', gender, gender1)
        await downloadIndexFolder({ gender, gender1 })
        await decompressIndexFolder({ gender1 })
        await getContent(`https://raw.githubusercontent.com/${process.env.REPO}/${gender}/public/category-nav-counter.json`, gender1)
        await getContent(`https://raw.githubusercontent.com/${process.env.REPO}/${gender}/public/keywords.json`, gender1)
    }

})()
