
const {
    parentPort, workerData
} = require('node:worker_threads');
const path = require('path')

const { dataCollection,functionName } = workerData

const { productTitleMatch } = require(path.join(process.cwd(), `netlify/functions/productTitleMatch`))

const allkeywords = require(path.join(process.cwd(), `api/_files/nav/keywords.json`))
const categoryKeywords = allkeywords.filter(f => f.keywordType === 'category' && f.groupName !== 'Fiyat')

let navKeys = { ['0-']: { matchingKeywords: [], keywords: {} } }
let navKeysWithCatKeys = {}
let catCounter = {}

function getCombinations(chars) {
    var result = [];
    var f = function (prefix, chars) {
      for (var i = 0; i < chars.length; i++) {
        result.push(prefix + chars[i]);
        f(prefix + chars[i], chars.slice(i + 1));
      }
    }
    f('', chars);
    return result;
  }
dataCollection.forEach(async (object) => {


    const { title, priceNew, imageUrl, marka } = object



    if (title) {

        const keywords = allkeywords
        if (keywords && keywords.length > 0) {
            //--------------------------FIND MATCHING KEYWORDS WITHING PRODUCT NAME
            const matchingKeywords = keywords.map((m) => { return { ...m, index: m.index.toString() + '-' } }).filter((kws) => {


                let exactmatch = kws.exactmatch
                let negwords = kws.exclude




                if (kws.groupName === 'Fiyat') {
                    const priceRange = kws.keywords.split('-').map(m => parseInt(m).toFixed(2))
                    const startPrice = parseFloat(priceRange[0])
                    const endPrice = parseFloat(priceRange[1])

                    try {
                        const price = priceNew.toString().replace('.', '').replace(',', '.')
                        const productPrice = parseFloat(price)
                        if (endPrice) {
                            if (productPrice >= startPrice && productPrice <= endPrice) {
                                return true
                            } else {
                                return false;
                            }
                        }
                        else {

                            if (productPrice >= startPrice) {
                                return true
                            } else {
                                return false
                            }

                        }
                    } catch (error) {
                        
                    }

                } else {

                    let nws = []
                    if (negwords) {
                        nws = negwords.split(',')

                    }
                    const kw = kws.keywords

                    const match = productTitleMatch({ kw, title, exactmatch, nws })

                    return match
                }

            })


            for (let k of categoryKeywords) {
                const { index, groupName } = k


                const match = matchingKeywords.find(f => {

                    return f.index.replace('-', '') === index
                })
                if (match && k.functionName === functionName) {

                    if (catCounter[groupName] === undefined) {
                        catCounter[groupName] = {}
                    }
                    if (catCounter[groupName][k.title] === undefined) {
                        catCounter[groupName][k.title] = { count: 1 }
                    } else {

                        catCounter[groupName][k.title].count = catCounter[groupName][k.title].count + 1
                    }

                }


            }

            //-------------------------IF MATCHING KEYWORDS FOUND------------------------------------------------------------------------------
            if (matchingKeywords.length > 0) {

                const possibleCombination = getCombinations(matchingKeywords.map((m) => m.index))

                possibleCombination.forEach(async (c, h) => {

                    const comb = c.split('-').filter(f => f !== '').map(m => parseInt(m)).sort((a, b) => a - b).map(m => m + "-").join('')

                    if (navKeys[comb] === undefined) {
                        navKeys[comb] = { keywords: {} }
                    }

                    matchingKeywords.forEach(nm => {
                        const { index, title } = nm
                        if (comb === '1-') {

                        }


                        const fnd = categoryKeywords.filter(f => comb.split('-').filter(f => f !== '').includes(f.index))


                        fnd.forEach(ds => {
                            const c = ds ? true : false

                            if (c) {
                                if (navKeysWithCatKeys[comb] === undefined) {
                                    navKeysWithCatKeys[comb] = { keywords: {} }
                                }

                                if (navKeysWithCatKeys[comb].keywords[title] === undefined) {

                                    navKeysWithCatKeys[comb].keywords[title] = { count: 1, index, c, imageUrls: [{ src: imageUrl, title: object.title, marka }] }
                                }
                                else {
                                    const count = navKeysWithCatKeys[comb].keywords[title].count
                                    const imageUrls = navKeysWithCatKeys[comb].keywords[title].imageUrls

                                    navKeysWithCatKeys[comb].keywords[title] = { count: count + 1, index, c, imageUrls: [...imageUrls, { src: imageUrl, title: object.title, marka }] }
                                }
                            }

                        })



                        if (navKeys[comb].keywords[title] === undefined) {

                            navKeys[comb].keywords[title] = { count: 1, index }
                        }
                        else {
                            const count = navKeys[comb].keywords[title].count
                            navKeys[comb].keywords[title] = { count: count + 1, index }
                        }

                    })

                })

                matchingKeywords.forEach(nm => {
                    const { index, title } = nm

                    if (navKeys['0-'].keywords[title] === undefined) {

                        navKeys['0-'].keywords[title] = { count: 1, index, c: false }
                    }
                    else {
                        const count = navKeys['0-'].keywords[title].count
                        navKeys['0-'].keywords[title] = { count: count + 1, index, c: false }
                    }
                })


            }


        }

    }
})//end dataCollection


parentPort.postMessage(JSON.stringify({ navKeys, navKeysWithCatKeys, catCounter }))


