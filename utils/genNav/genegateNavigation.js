


console.log('--------------GEN NAV DATA STARTED-------------')
const {
  parentPort, workerData
} = require('node:worker_threads');

const { functionName,gender } = workerData

genNav({ functionName,gender })

async function genNav({ functionName,gender }) {



  const path = require('path')
  const makeDir = require('make-dir');
  const plimit = require('p-limit')
  const limit = plimit(5);
  const { workerIndex } = require('./dataCollWorker/workerIndex')
  const fs = require('fs')
  const folder = path.join(process.cwd(), `${gender}/_files/data/${functionName}`)

  const files = await fs.readdirSync(folder)


  console.log('files.length', files.length)

  const dataCollection = []
  for (let file of files) {
    try {
      const data = fs.readFileSync(`${folder}/${file}`, { encoding: 'utf8' })

      const dataObjectArr = JSON.parse(data)
      dataCollection.push(...dataObjectArr)
    } catch (error) {
      console.log('folder is empty')
    }

  }

  const { productTitleMatch } = require('../../assets/productTitleMatch')

  const allkeywords = require("../../assets/keywords.json")
  const categoryKeywords = allkeywords.filter(f => f.keywordType === 'category' && f.groupName !== 'Fiyat' && f.functionName === functionName)

  let navKeys = { ['0-']: { matchingKeywords: [], keywords: {} } }
  let navKeysWithCatKeys = {}
  let catImages = {}
  let catCounter = {}
  dataCollection.forEach(async (object) => {


    const { title, priceNew, imageUrl, marka } = object



    if (title) {

      const keywords = allkeywords

      if (keywords && keywords.length > 0) {
        //--------------------------FIND MATCHING KEYWORDS WITHING PRODUCT NAME
        const matchingKeywords = keywords.map((m) => {

          return { ...m, index: m.index.toString() + '-' }
        }).filter((kws) => {


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

            return parseInt(f.index.replace('-', '')) === parseInt(index)
          })

          //   if (match && k.functionName === functionName) {
          if (match) {

            if (catCounter[groupName] === undefined) {
              catCounter[groupName] = {}
            }
            if (catCounter[groupName][k.title] === undefined) {
              catCounter[groupName][k.title] = { count: 1, imageUrls: [{ src: imageUrl, title: object.title, marka }] }//--------------------------------------------------------------------------
            } else {
              const imageUrls = catCounter[groupName][k.title].imageUrls

              catCounter[groupName][k.title] = { count: catCounter[groupName][k.title].count + 1, imageUrls: [...imageUrls, { src: imageUrl, title: object.title, marka }] }

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



              const fnd = categoryKeywords.filter(f => comb.split('-').filter(c => c !== '').map(m => m.toString()).includes(f.index.toString()))


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
  })//end

  try {


    for (let f in navKeysWithCatKeys) {
  
      //find category index
      const categoryIndexes = f.split('-').filter(f => f !== '')
      const fnd = categoryKeywords.find(fd => categoryIndexes.includes(fd.index.toString()))

      const current = navKeysWithCatKeys[f]
      const keywords = current.keywords

      for (let k in keywords) {

        const cur = keywords[k]
        const randomImage = cur.imageUrls.length === 1 ? 0 : generateRandomInteger(cur.imageUrls.length)

        if (catImages[fnd.index] === undefined) {
          catImages[fnd.index] = { [cur.index]: { count: cur.count, keywordTitle: k, imageUrl: cur.imageUrls[randomImage] } }

        } else {

          if (catImages[fnd.index][cur.index] === undefined) {

            catImages[fnd.index] = { ...catImages[fnd.index], [cur.index]: { count: cur.count, keywordTitle: k, imageUrl: cur.imageUrls[randomImage] } }
          }

        }

      }


    }

  } catch (error) {
    console.log(error)

  }



  console.log('nav gen complete')

  let regrouped = []




  for (let nk in navKeys) {

    const { keywords } = navKeys[nk]

    const map = Object.entries(keywords).map((m) => { return { ...m[1] } }).map(m => {

      return [m.count, m.index]
    })


    const id = parseInt(nk.replace(/-/g, '').trim())

    regrouped.push({ i: nk, k: map, id })

  }

  const sorted = regrouped.sort((a, b) => {


    return a.id - b.id
  })


  const mapped = sorted.map(s => {
    const { id } = s
    const fn = id % 2
    return { ...s, fn }

  })

  const firstPart = mapped.filter((f) => f.fn === 0).map(m => { return { i: m.i, k: m.k } })
  const secondPart = mapped.filter((f) => f.fn === 1).map(m => { return { i: m.i, k: m.k } })







  const savePathDir = path.join(process.cwd(), `${gender}/_files/key/${functionName}`)
  makeDir.sync(savePathDir)

  const path0 = path.join(process.cwd(), `${gender}/_files/key/${functionName}`, '0-keywords.json')
  const path1 = path.join(process.cwd(), `${gender}/_files/key/${functionName}`, '1-keywords.json')

  if (fs.existsSync(path0)) {
    fs.unlinkSync(path0)
  }
  if (fs.existsSync(path1)) {
    fs.unlinkSync(path1)
  }

  fs.appendFileSync(path0, JSON.stringify(firstPart));
  fs.appendFileSync(path1, JSON.stringify(secondPart));




  parentPort.postMessage(JSON.stringify({ catCounter, catImages }))


}



function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}



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


function splitToChunks(array, parts) {
  let result = [];
  for (let i = parts; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
}
function generateRandomInteger(max) {
  return Math.floor(Math.random() * max);
}



module.exports = { getCombinations }