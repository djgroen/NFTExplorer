var ssc;

$.when(
    $.getScript( "https://cdn.jsdelivr.net/npm/@hivechain/hivejs/dist/hivejs.min.js" ),
    $.getScript( "https://cdn.jsdelivr.net/npm/sscjs@latest/dist/ssc.min.js" ),
    $.getScript( "./market.js" ),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
    ssc = new SSC('https://api.hive-engine.com/rpc');  
    show();
});

var url = new URL(document.URL);
var url_params = url.searchParams; 
var APIDataJson = [];
var currentTable;
var loggedIn;
var currentUser;

var getData2 = function(table, account, offSet) {
    table = table + "sellBook";
    return new Promise(function(resolve, reject) {  
        ssc.find('nftmarket',table,{'account': account}, 1000, offSet, [], (err, result) => {          
            if (result) {
                resolve(result);
            } else {
                reject(Error("Failed to get JSON data!")); 
            }
        });
    });
} 


// loads the UI elements
async function loadMarket2(table, account) {
    clearTableData();
    currentTable = table;
    let offSet = 0;
    await getData2(table, account, offSet).then( function(result){APIDataJson = sortData(result)});
    let isMore = false;
    // if bigger than thousand enters loop with offset
    if (APIDataJson.length == 1000) {
            isMore = true;
            offSet += 1000;
        }
    while (isMore) {
        let length1 = APIDataJson.length;  
        let APIDataJsonOld = APIDataJson;
        await getData2(table, account, offSet).then( function(result){ 
            let newData = sortData(result);
            APIDataJson = [...APIDataJsonOld, ...newData];                    
        });
        
        
        let length2 = APIDataJson.length;
        if (length2 - length1 < 1000) {
            isMore = false;
            }
        else {
            offSet += 1000;
        }
    }
    buildTable(APIDataJson);
}

// logs in, allows buying
function login2() {
    var name = $("#loginAccountName").val();
    hive_keychain.requestSignBuffer(name, "Login", "Active", function(response) {
        if(response.success == true) {
            loggedIn = true;
            currentUser = name;
            let loginArea = $("#loginAreaFrame");
            loginArea.html("");
            var label = $("<label>");
            label.text(name); 
            loginArea.append(label);
            $("#searchField").val("");
            $("#loginMessage").html("");
            
            $(':button').attr('disabled', false);
           }
    });
}

function show() {
    var table = url_params.get('table');
    var account = url_params.get('account');
    loadMarket2(table, account);
    
}

