$.when(
    $.getScript( "https://cdn.jsdelivr.net/npm/@hivechain/hivejs/dist/hivejs.min.js" ),
    $.getScript( "https://cdn.jsdelivr.net/npm/sscjs@latest/dist/ssc.min.js" ),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
    ssc = new SSC('https://api.hive-engine.com/rpc');  
    setLastBlock();
});

var lastBlock;
var blockNumber = 0;
var txs = [];
var timestamps = [];



function getLastBlock() {   
    return new Promise(function(resolve,reject) {
        ssc.getLatestBlockInfo((err, result) => {
            if(result) {
                return resolve(result.blockNumber);
            }
            else {
                reject(Error("Failed to get data!"));    
            }
        });  
    });   
}

async function setLastBlock() {
    await getLastBlock().then( async function(result) {
            lastBlock = result;    
    });
}

var getBlock = function(block) {
    return new Promise(function(resolve,reject) {
        ssc.streamFromTo(block, block, (err, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(Error("Failed to get data!")); 
                }
            },0);
    });
}

// always gets the transfers from last 1000 blocks
async function getData() {
    $("#getDataButton").attr('disabled', true);
    for (i = 0; i < $("#loadNumber").val(); i++) {
        $("#statusIndicator").text(" Loading: " + i + "/" + $("#loadNumber").val());                
            await getBlock(lastBlock).then(function(result) {
                timestamps.push(result.timestamp);
                txs.push(result.transactions);     
            });   
        lastBlock--;
        }
        $("#statusIndicator").text("Ready"); 
        document.getElementById("getDataButton").innerText = 'Load more';
        $("#getDataButton").attr('disabled', false);
        filterNFTTransfers();
    blockNumber = lastBlock;
}   

function filterNFTTransfers() {
    // Have to add time because HE doesn't use Unix time
    const currentTimeStamp = new Date().getTime();
    for(j = 0; j < txs.length; j++) {
        console.log(timestamps[j] + "   " + (toTimestamp(timestamps[j])) ) ;
        for (i = txs[j].length - 1; i >= 0; i--) {
            var sender = txs[j][i].sender
            if (txs[j][i].contract == "nft") {
                if(txs[j][i].action == "transfer") {
                    transfersString = getTransferString(JSON.parse(txs[j][i].payload));
                    var txString = '<a ' + 'target="_blank"' + ' href="https://peakd.com/@' + sender + '">' + sender + '</a>' + " transfered " + transfersString + " <em>" + timeDifference(currentTimeStamp , toTimestamp(timestamps[j]) + 7200000) + "</em>";
                    appendText(txString); 
                }    
            }  
        }      
    }
    txs = [];
    timestamps = [];
}


function appendText(String) {
    $('<p>' + String + '</p>').appendTo('#transferText');   
}

function getTransferString(json) {
    text = json.nfts[0].symbol + " NFT(s) with ID(s) ";
    text += '<a ' + 'target="_blank"' + ' href="https://okean123.github.io/NFTExplorer/lookup.html?table=' + json.nfts[0].symbol + '&id=' + json.nfts[0].ids[0] + '">'+ json.nfts[0].ids[0] +'</a>' 
    for (y = 1; y < json.nfts[0].ids.length; y++) {
        text += ', <a ' + 'target="_blank"' + ' href="https://okean123.github.io/NFTExplorer/lookup.html?table=' + json.nfts[0].symbol + '&id=' + json.nfts[0].ids[y] + '">'+ json.nfts[0].ids[y] +'</a>' 
    }
    text += " to " + '<a ' + 'target="_blank"' + ' href="https://peakd.com/@' + json.to + '">' + json.to + '</a>';
    return text;
}


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' day(s) ago';   
    }

    else if (elapsed < msPerYear) {
        return  Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

function toTimestamp(strDate){
   var datum = Date.parse(strDate);
   return datum;
}

