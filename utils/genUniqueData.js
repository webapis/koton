
debugger
const keywords = require(`${process.cwd()}/assets/keywords.json`).filter(f => f.keywordType === 'category')

const { walkSync } = require(`${process.cwd()}/utils/walkSync`)
const path = require('path')
const fs = require('fs')
let filePaths = []
walkSync(path.join(process.cwd(), `erkek/_files/data`), async (filepath) => {
    filePaths.push(filepath)
})
walkSync(path.join(process.cwd(), `kadin/_files/data`), async (filepath) => {
    filePaths.push(filepath)
})
walkSync(path.join(process.cwd(), `kiz-cocuk/_files/data`), async (filepath) => {
    filePaths.push(filepath)
})

walkSync(path.join(process.cwd(), `erkek-cocuk/_files/data`), async (filepath) => {
    filePaths.push(filepath)
})
let uData = []
for (let filepath of filePaths) {

    const data = JSON.parse(fs.readFileSync(filepath))

    if (data !== undefined) {
        const mapedTitle = data.map(m => m.title.replace(/[^\D]/g, '').replaceAll('_', '').toLowerCase()).join(' ').split(' ').filter(f => f.length > 2).map(m => m.replace(/[^\w]/g, '')).filter(f => f.length > 2)

        const uniqueData = [...new Set(mapedTitle)].sort()

        uData.push(...uniqueData)


    }





}
debugger
const hfed = [...new Set(uData)].sort().filter(b => !keywords.find(f => f.keywords.includes(b)))
console.log('hfed', hfed.length)
debugger
fs.writeFileSync(`${process.cwd()}/assets/uniqueData.json`, JSON.stringify(hfed))
debugger
// const mapedTitle = avva.map(m=>m.title).join(' ').split(' ')
// const uniqueData = [...new Set(mapedTitle)]


debugger

