
const {
    Worker, isMainThread
} = require('node:worker_threads');
async function workerIndex({ dataCollection,functionName }) {



        return new Promise((resolve, reject) => {
            const encode_worker = new Worker(`${process.cwd()}/utils/genNav/dataCollWorker/dataCollection.js`, { workerData: { dataCollection,functionName } });

            // encode_worker.on('message', (transcode_data) => {
            //     log.info("%o", transcode_data);
            //     resolve(transcode_data);
            // });

            encode_worker.on('error', (err) => {

                reject(err);
            });

            encode_worker.on('message', (data) => {

                this.data = data



            })

            encode_worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Encoding stopped with exit code [ ${code} ]`));
                }

                // global.navItems = global.navItems + buffers.length
                // console.log('worker complete', global.navItems)
                // console.log('worker left', global.itemsTotal - global.navItems)

                resolve(this.data);
            });

        });

  

}

module.exports = { workerIndex }