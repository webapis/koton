
const {
    Worker, isMainThread
} = require('node:worker_threads');
async function workerPromise({ functionName,gender }) {
console.log('workerPromise functionName--',functionName)
    if (isMainThread) {

        return new Promise((resolve, reject) => {
            const encode_worker = new Worker(`${process.cwd()}/utils/genNav/genegateNavigation.js`, { workerData: { functionName ,gender} });

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

    } else {
        
        // should return a promise from all calling paths
        return Promise.reject(new Error("Can only call encode() from main thread"));
    }

}

module.exports = { workerPromise }