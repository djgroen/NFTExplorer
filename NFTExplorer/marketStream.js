var ssc;

$.when(
    $.getScript( "https://cdn.jsdelivr.net/npm/@hivechain/hivejs/dist/hivejs.min.js" ),
    $.getScript( "https://cdn.jsdelivr.net/npm/sscjs@latest/dist/ssc.min.js" ),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
    ssc = new SSC('https://api.hive-engine.com/rpc');  
});

var currentTable = "";

var getData = function(contract, table, offSet) {
    return new Promise(function(resolve, reject) {  
        ssc.find(contract, table, {}, 1000, offSet, [], (err, result) => {          
            if (result) {
                APIDataJson = result;
                resolve(result);
            } else {
                reject(Error("Failed to get JSON data!")); 
            }
        });
    });
} 

async function loadStream() {
    if ($('#transactions').length){
        clearDiv("#transactions")
    } 
    currentTable = $("#game").val();
    table = currentTable + "tradesHistory"
    await getData('nftmarket', table, 0).then( function(result) {
        showData(result);
    });
}

function showData(data) {
    for (let i = 0; i < data.length; i++) {
        var div = jQuery('<div/>', {"class": 'tx-data'}).appendTo('#transactions');
        let buyer  = data[i].account;
        let buyerlink = "<a href='peakd.com/@'>" + buyer;
        let sellers = data[i].counterparties[0].account;
        let nfts = data[i].counterparties[0].nftIds[0];
        let price = parseFloat(data[i].price);
        let symbol = data[i].priceSymbol;
        $(div).append($('<p>' + '<a ' + 'target="_blank"' + ' href="https://peakd.com/@' + buyer + '">'+buyer+'</a>' + ' bought NFT with ID ' + nfts + ' from ' + '<a ' + 'target="_blank"' + ' href="https://peakd.com/@' + sellers + '">'+sellers+'</a>' + ' for ' + price + ' ' + symbol +  '</p>'));
    }
}

function clearDiv(div) {
    $(div).empty();
}