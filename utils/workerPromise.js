
const {
    Worker, isMainThread
} = require('node:worker_threads');
function workerPromise({ buffers,workerId }) {

    if (isMainThread) {

        return new Promise((resolve, reject) => {
            const encode_worker = new Worker(`${process.cwd()}/node_modules/biraradamoda/utils/fetchRemoteImages`, { workerData: { buffers,workerId } });

            // encode_worker.on('message', (transcode_data) => {
            //     log.info("%o", transcode_data);
            //     resolve(transcode_data);
            // });

            encode_worker.on('error', (err) => {

                reject(err);
            });

            encode_worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Encoding stopped with exit code [ ${code} ]`));
                }

                global.navItems = global.navItems + buffers.length
                console.log('worker complete', global.navItems)
                console.log('worker left', global.itemsTotal - global.navItems)
                resolve(true);
            });

        });

    } else {
        // should return a promise from all calling paths
        return Promise.reject(new Error("Can only call encode() from main thread"));
    }

}

module.exports = { workerPromise }