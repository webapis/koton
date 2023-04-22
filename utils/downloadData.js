

(async () => {
    const { downloadCollection } = require('./uploadCollection')
    const genders = [{ gender: 'kadin', gender1: 'kadin' }, { gender: 'erkek', gender1: 'erkek' }, { gender: 'kcocuk', gender1: 'kiz-cocuk' }, { gender: 'ecocuk', gender1: 'erkek-cocuk' }]
    console.log('process.env.marka', process.env.marka)
    for (let g of genders) {
        const { gender, gender1 } = g
        await downloadCollection(gender, gender1, process.env.marka)
    }
//
})()
