
function mergeFiles(gender) {


    require('dotenv').config()

    const { productTitleMatch } = require('../assets/productTitleMatch')
    console.log('--------------------------------------------------------------')
    const plimit = require('p-limit')

    const path = require('path')
    const makeDir = require('make-dir');
    const { walkSync } = require('./walkSync')

    const fs = require('graceful-fs')
    const limit = plimit(5);

    console.log('--------------------------------------------------------------')




    const keywords = require(path.join(process.cwd(), `assets/keywords.json`))
    fs.rmSync(path.join(process.cwd(), `${gender}/_files/data`), { recursive: true, force: true });



    const functionObj = { diger: {} }



    let markaProducts = []
    walkSync(path.join(process.cwd(), `${gender}/unzipped-data`), async (filepath) => {
        const data = JSON.parse(fs.readFileSync(filepath))

        markaProducts.push(...data)
    })

    console.log('PRODUCTS TO MERGE', markaProducts.length)



    let i = 0
    for (let mp of markaProducts) {
        i++
        const { title, marka } = mp
        const categoryKeywords = keywords.filter(f => f.keywordType === 'category')

        var machfound = false
        for (let k of categoryKeywords) {


            const nws = k.exclude !== '' ? k.exclude.split(',') : []
            if (k.keywords.toLowerCase().includes('penye elbise') && title.toLowerCase().includes('penye elbise')) {
                console.log(k.keywords)
                
            }
            const match = productTitleMatch({ kw: k.keywords, nws, title })
            if (k.keywords.toLowerCase().includes('penye elbise') && title.toLowerCase().includes('penye elbise')) {
                console.log(k.keywords)
                
            }
            if (match) {

                if (functionObj[k.functionName] === undefined) {
                    functionObj[k.functionName] = {}
                }

                if (functionObj[k.functionName][marka] === undefined) {
                    functionObj[k.functionName][marka] = []
                }

                const previouslyAdded = functionObj[k.functionName][marka].find(f => f.imageUrl === mp.imageUrl)
                if (!previouslyAdded) {
                    functionObj[k.functionName][marka] = [...functionObj[k.functionName][marka], mp]
                }
                machfound = true
                //  break;



            }


        }


        if (machfound === false) {
            if (functionObj['diger'][marka] === undefined) {
                functionObj['diger'][marka] = []
            }
            functionObj['diger'][marka] = [...functionObj['diger'][marka], { ...mp, title: mp.title + ' diger' }]

        }

        if (i === markaProducts.length) {

            for (let fnName in functionObj) {

                const fnc = functionObj[fnName]

                for (let m in fnc) {


                    const current = functionObj[fnName][m]
                    const savePath = path.join(process.cwd(), `${gender}/_files/data/${fnName}/${m}.json`)
                    makeDir.sync(path.dirname(savePath))

                    if (current && current.length > 0) {
                        fs.writeFileSync(savePath, JSON.stringify(current))
                    }
                    else {

                    }

                }






            }

        }
    }




}


(async () => {
    const genders = [{ gender: 'kadin', gender1: 'kadin' }, { gender: 'erkek', gender1: 'erkek' }, { gender: 'kcocuk', gender1: 'kiz-cocuk' }, { gender: 'ecocuk', gender1: 'erkek-cocuk' }]

    //    const genders = [{ gender: 'kadin', gender1: 'kadin' }]

    for (let g of genders) {
        const { gender1 } = g
        await mergeFiles(gender1)
    }

})()
