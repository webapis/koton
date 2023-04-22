








(async () => {
  const fnNames = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'diger']


  // for (let functionName of fnNames) {
  navKeygenAuto({ functionName: 'one', gender: 'kadin' })
  // }
})()
function navKeygenAuto({ functionName, gender }) {



  const path = require('path')
  const fs = require('fs')
  const folder = path.join(process.cwd(), `${gender}/_files/data/${functionName}`)
  const files = fs.readdirSync(folder)
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



  
  let navKeys = { ['0-']: { matchingKeywords: [], keywords: {} } }
  let navKeysWithCatKeys = {}
  let catImages = {}
  let catCounter = {}
  dataCollection.forEach((object) => {


    const { title } = object

    if (title) {

      let perm = [];
      let items = title.substring(0, title.indexOf('_')).split(' ').filter((f, i) => f !== '' && i < 7)
      
      // for generating different lengths of permutations
      for (let i = 0; i < items.length; i++) {
        
        permutations(2, "", [], items, perm);
      }

      console.log(perm);
      
    }



    


  })//end





}







function permutations(k, curr_perm, included_items_hash, items, perm) {
  console.log("perm", perm)
  if (k == 0) {
    perm.push(curr_perm);
    return;
  }


  for (let i = 0; i < items.length; i++) {

    // so that we do not repeat the item, using an array here makes it O(1) operation
    if (!included_items_hash[i]) {
      included_items_hash[i] = true;
      const rs = curr_perm + ' ' + items[i]

      permutations(k - 1, rs, included_items_hash, items, perm);
      included_items_hash[i] = false;
    }

  }
}








