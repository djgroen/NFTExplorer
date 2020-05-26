var ssc;

$.when(
    $.getScript( "https://cdn.jsdelivr.net/npm/@hivechain/hivejs/dist/hivejs.min.js" ),
    $.getScript( "https://cdn.jsdelivr.net/npm/sscjs@latest/dist/ssc.min.js" ),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
    ssc = new SSC('https://api.hive-engine.com/rpc');  
    findNFT();
});

var url = new URL(document.URL);
var search_params = url.searchParams; 
var nft = {};

var getData = function(table, id) {
    table = table + "instances";
    return new Promise(function(resolve, reject) {  
        ssc.findOne('nft',table,{_id: parseInt(id)}, (err, result) => {          
            if (result) {
                resolve(result);
            } else {
                reject(Error("Failed to get JSON data!")); 
            }
        });
    });
} 

async function findNFT() {
    var table = search_params.get('table');
    var id = search_params.get('id');
    await getData(table, id).then(function(result) { 
        nft = result;
        $("#cardData").append("<p> Card ID: " + nft._id + "</p>");
        $("#cardData").append("<p> Owner: " + nft.account + "</p>");
        $("#cardData").append("<p> Class: " + nft.properties.class + "</p>");
        $("#cardData").append("<p> Type: " + nft.properties.type + "</p>");
    });
    
    
    
}


                
               
