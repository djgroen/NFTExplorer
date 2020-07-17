let ssc = new SSC('https://api.hive-engine.com/rpc');  
init();

var lastBlock;
var blocks = [];
var lastlenghth;
var tx = [];

function init() {
    lastBlock = getLastBlock();
}

function getLastBlock() {   
    ssc.getLatestBlockInfo((err, result) => {
        lastBlock =  result.blockNumber;
    });
}

var getData = function() {
    var data = [];
    return new Promise(function(resolve, reject) { 
        for (let i = 0; i < 100; i++) {
            ssc.streamFromTo(lastBlock, lastBlock, (err, result) => {
                data.push(result);
            },0)
            lastBlock--; 
        }
        resolve(data);
    })
}

async function buildHistory() {
        getData().then(function(result) {
            if(blocks.length > 0) {
                var newArray = blocks.concat(result);
                blocks = newArray;   
            } 
            else {
                for (x in result) {
                    console.log(x)
                    blocks.push(x);
                }
            }
    });
}