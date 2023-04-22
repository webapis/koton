


(async () => {
    require('dotenv').config()

    await generateKeyword()


    process.exit(0)

})()


async function generateKeyword() {
    const fs = require('fs')
    const uri = process.env.MONGODB_URL
    const { MongoClient } = require('mongodb');
    const makeDir = require('make-dir');
    
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect()
    await makeDir("erkek")
    await makeDir("kadin")
    await makeDir("erkek-cocuk")
    await makeDir("kiz-cocuk")
    const db = client.db("biraradamoda");

    let collection = db.collection('keywords');

    let datas = await collection.find({ $or: [{ disabled: { $exists: false } }, { disabled: { $eq: false } }] }).toArray()
    
    let categoryItems = datas.map((m, i) => {
        const mappedData = m
        delete mappedData['_id']
        return { ...mappedData, index: (i + 1).toString() }
    })



    


    const data = categoryItems

    await makeDir(`assets`)
    const exit = fs.existsSync(`assets/keywords.json`)
    
    if (exit) {
        
        fs.unlinkSync(`assets/keywords.json`)
    }
    fs.appendFileSync(`assets/keywords.json`, JSON.stringify(data))


    // if (fs.existsSync(`src/keywords.json`)) {
    //     fs.unlinkSync(`src/keywords.json`)
    // }
    // if (fs.existsSync(`public/keywords.json`)) {
    //     fs.unlinkSync(`public/keywords.json`)
    // }
    // if (fs.existsSync(`assets/category-nav.json`)) {
    //     fs.unlinkSync(`assets/category-nav.json`)
    // }

    const reduced = data.reduce((prev, curr) => {

        return {
            ...prev, [curr.index + "-"]: {
                groupName: curr.groupName, title: curr.title,
                keywordType: curr.keywordType, keywords: curr.keywords
            }
        }
    }, {})
    
    // fs.appendFileSync(`src/keywords.json`, JSON.stringify(reduced))
    // fs.appendFileSync(`public/keywords.json`, JSON.stringify(reduced))

    
    const mappedCatItems = categoryItems.filter(f => f.keywordType === 'category').map(m => {

        
        return { ...m, index: m.index + '-' }
    })
    
    const grouped = groupBy([...mappedCatItems, { title: 'diger', exclude: '', functionName: 'diger', groupName: 'diger', index: '0-' }], 'groupName')
    fs.writeFileSync(`erkek/category-nav.json`, JSON.stringify(grouped), { flag: 'w' })
    fs.writeFileSync(`kadin/category-nav.json`, JSON.stringify(grouped), { flag: 'w' })
    fs.writeFileSync(`erkek-cocuk/category-nav.json`, JSON.stringify(grouped), { flag: 'w' })
    fs.writeFileSync(`kiz-cocuk/category-nav.json`, JSON.stringify(grouped), { flag: 'w' })
}

function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};