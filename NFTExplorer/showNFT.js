var ssc;

$.when(
    $.getScript( "https://cdn.jsdelivr.net/npm/@hivechain/hivejs/dist/hivejs.min.js" ),
    $.getScript( "https://cdn.jsdelivr.net/npm/sscjs@latest/dist/ssc.min.js" ),
    $.getScript( "./tableManager.js" ),
    $.getScript( "./dialogs.js" ),
    $.getScript( "./nftOperations.js" ),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
    ssc = new SSC('https://api.hive-engine.com/rpc');  
});

var APIDataJson = [] 
var currentTable = "";

var getRawData = function(contract, table, offSet) {
	currentTable = table;
    table = table + "instances";
    let account = document.getElementById("usernameInput").value;
	// Prevent account from using
	if (account == "tlundy47") {
		return null;
	}
    return new Promise(function(resolve, reject) {  
        ssc.find(contract, table, {account: account}, 1000, offSet, [], (err, result) => {          
            if (result) {
                APIDataJson = result;
                resolve(result);
            } else {
                reject(Error("Failed to get JSON data!")); 
            }
        });
    });
} 




var getData = function(result) {         
                var JSONdata = [];
                table = currentTable + "instances";
				for (i = 0; i < result.length; i++) {
                    // Show previous owner with modified text if it's bought or has no previous owner
                    switch(result[i].previousAccount) {
                        case undefined: result[i].properties.previousOwner = "First Owner"; break;
                        case 'nftmarket': result[i].properties.previousOwner = "Market"; break;
                        default: result[i].properties.previousOwner = result[i].previousAccount; break;
                           }
					JSONdata.push(result[i].properties);
					JSONdata[i]._id = result[i]._id;
                    // reorder to show _id first
                    switch(table) {
                        case 'STARinstances': 
                            JSONdata[i] = JSON.parse(JSON.stringify( JSONdata[i], ["_id", "class","type", "stats", "previousOwner"])); break;
			case 'FARMinstances': 
                            JSONdata[i] = JSON.parse(JSON.stringify( JSONdata[i], ["_id", "name", "edition", "previousOwner"])); break;
                        case 'CITYinstances':  
                            delete JSONdata[i].population; delete JSONdata[i].education; delete JSONdata[i].creativity; delete JSONdata[i].income; delete JSONdata[i].popularity; delete JSONdata[i].workers;
                            JSONdata[i] = JSON.parse(JSON.stringify( JSONdata[i], ["_id", "name", "previousOwner"])); break; 
                        // case 'APIinstances': JSONdata[i] = JSON.parse(JSON.stringify( JSONdata[i].properties, ["x", "info"])); break;
                           }						
				}
				return JSONdata;
            }
        
async function buildButtonClicked() { 
            resetUI();
            results = [];
            let offset = 0;
            let newData = 1000; 
            document.querySelector('#totalCardsLabel').innerText = "Loading... Please wait..."
            // get data and build table
            while (newData == 1000) {
                await getRawData('nft', document.getElementById("game").value, offset).then( function(result) {
                    results = results.concat(result);
                    newData = result.length;
                    offset += 1000;
			     });         
                } 
            buildTable(getData(results));
            // update account name
            var textHeader = document.getElementById("topText"); 
			textHeader.innerText = "NFTs for account: @" + document.getElementById("usernameInput").value     
        }
		

async function getJson() {
          await getData('nft', document.getElementById("game").value, document.getElementById("usernameInput").value).then( result => APIDataJson = result);  
         }
        
function clearTableData() {
            APIDataJson = [];
        }
        
 

// Gets called when a Checkbox is clicked and returns IDs of selected checkboxes
function getSelected() {
    selected = [];
    $("input:checkbox[name=sendCB]:checked").each(function(){
        selected.push($(this).val()); //
    });
    if(selected.length > 0) {
        document.getElementById("stickyMenu").style.visibility="visible";
        document.getElementById("checkboxButton").style.visibility="visible";
       }
    else {
        document.getElementById("stickyMenu").style.visibility="hidden"; 
        document.getElementById("checkboxButton").style.visibility="hidden";
    } 
    if (selected.length > 50) {
        alert('You can only transfer 50 NFTs in one transaction, please deselect your last checkbox or the transaction will fail');  
    }
    return selected;
}

// Function called when 'Send mutltiple NFTs' is clicked
function multipleSendButton() {
    document.querySelector("#broadcastTXButton").onclick = broadcastMultipleSendTX;
    // Opening the pop up
            var modal = document.querySelector("#transferPopUp");
            var span = document.querySelector(".close");
            modal.style.display = "block";
            span.onclick = function() {
                modal.style.display = "none";
                document.querySelector('#sendToLabel').innerText = "Send to:";
                document.querySelector('#succesIndicator').innerText = "";
            }
            window.onclick = function(event) {
            if (event.target == modal) {
                 modal.style.display = "none";
                 document.querySelector('#sendToLabel').innerText = "Send to:";
                 document.querySelector('#succesIndicator').innerText = "";
                }
            }
    // end pop up
}

function multipleSellButton() {
    var selected = getSelected();
    getDialog('multiSell',selected);
}

function broadcastMultipleSendTX() {
    selectedCB = getSelected();
    var input = document.querySelector("#toAccountInput").value;
            // check for username errors (wrong ones can still be entered, but this is to prevent mistakes like entering @)
            input = input.toLowerCase();
            if (input.indexOf('@') > -1 || input.length < 3 || input.length > 16 || /\s/.test(input) || input.indexOf('!') > -1 || input.indexOf('"') > -1 || input.indexOf(',') > -1) {
                alert('Check the entered username!');
            }
            else {
                // building transaction step by step
                var transaction = {};
                transaction.contractName = "nft";
                transaction.contractAction = "transfer";
                transaction.contractPayload = {};
                transaction.contractPayload.to = input;
                transaction.contractPayload.nfts = [];
                transaction.contractPayload.nfts[0] ={};
                transaction.contractPayload.nfts[0].symbol = currentTable;
                transaction.contractPayload.nfts[0].ids = selectedCB;
                
                message = "Send " + currentTable + " NFT with ID(s) " + selectedCB + " to: " + input;
                hive_keychain.requestCustomJson(document.querySelector('#usernameInput').value, "ssc-mainnet-hive", "Active", JSON.stringify(transaction), message, function(response) {
	               if (response.success) {
                        console.log(response);
                        document.querySelector('#sendToLabel').innerText = "Sent to:";
                        document.querySelector('#succesIndicator').innerText = "Transaction successfully broadcasted!";
                       }
                    else {
                        alert('Transaction failed, please try again!');
                    }
                });
            }
    
}

function resetUI() {
    document.getElementById("stickyMenu").style.visibility="hidden"; 
    document.getElementById("searchField").value = "";
    document.querySelector('#sendToLabel').innerText = "Send to:";
    document.querySelector('#succesIndicator').innerText = "";
    clearTableData();
}

function mainCBClciked() {
    // if (already selected) deselect all
    // if else (no seleceted) select first 50
}




        

  
