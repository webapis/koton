


function dataIsNew() {
    const fs = require('fs')

    if (!fs.existsSync(`${process.cwd()}/log-date.text`)) {
      
        const date = Date.now()
        fs.writeFileSync(`${process.cwd()}/log-date.text`, date.toString());
        return false
    } else {
     
        const date = fs.readFileSync(`${process.cwd()}/log-date.text`, { encoding: 'utf8' })
        const date1 = new Date(parseInt(date));
        const date2 = new Date();
        const diffTime = Math.abs(date2 - date1);
        var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);
        console.log(diffTime + " milliseconds");
        console.log(diffDays + " days");

        return diffDays === 0 ? true : false

    }
}

const result =dataIsNew()
debugger