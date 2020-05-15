let ssc = new SSC('https://api.hive-engine.com/rpc');  

var APIDataJson = [] 
var getData = function(contract, table, account) {
                currentTable = table;
                return new Promise(function(resolve, reject) {
               var JSONdata = [];
                table = table + "instances";
               ssc.find(contract, table, {account: account}, 1000, 0, [], (err, result) => {
				for (i = 0; i < result.length; i++) {
					JSONdata.push(result[i].properties);
					JSONdata[i]._id = result[i]._id;
                    // reorder to show _id first
                    switch(table) {
                        case 'STARinstances': 
                            JSONdata[i] = JSON.parse(JSON.stringify( JSONdata[i], ["_id", "class","stats","type"])); break;
                        case 'CITYinstances':  
                            
                            delete JSONdata[i].population; delete JSONdata[i].education; delete JSONdata[i].creativity; delete JSONdata[i].income; delete JSONdata[i].popularity; delete JSONdata[i].workers;
                            JSONdata[i] = JSON.parse(JSON.stringify( JSONdata[i], ["_id", "name"])); break; 
                        // case 'APIinstances': JSONdata[i] = JSON.parse(JSON.stringify( JSONdata[i].properties, ["x", "info"])); break;
                           }						
				}
			});
            JSONdataBackup = JSONdata;     
                    
            if (JSONdata != null) {
                    resolve(JSONdata);
            } else {
                    reject(Error("Failed to get JSON data!"));
                }
        });
            }
		
            
function buildTable(dataInJson) {
            // Get data for table header. 
            var col = [];
            for (var i = 0; i < dataInJson.length; i++) {
                for (var key in dataInJson[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
            }
            
             // CREATE DYNAMIC TABLE.
            var table = document.createElement("table");
            table.setAttribute("id", "jsonDataTable");          
              // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
            
            var tr = table.insertRow(-1);    
            
            for (var i = 0; i < col.length + 1; i++) {
                var th = document.createElement("th");      // TABLE HEADER.
                if (i < col.length) {
                    th.innerHTML = col[i];
                    tr.appendChild(th);
                }
                else {
                    th.innerText = "Manage";
                    tr.appendChild(th);
                }
                
            }
            
            // ADD JSON DATA TO THE TABLE AS ROWS.
            for (var i = 0; i < dataInJson.length; i++) {

                tr = table.insertRow(-1);

                for (var j = 0; j < col.length + 1; j++) {
                    if (j < col.length) {
                            var tabCell = tr.insertCell(-1);
                            tabCell.innerHTML = dataInJson[i][col[j]];
                        } 
                    else {
                        // build the send button
                        var tabCell = tr.insertCell(-1);
                        var btn = document.createElement('button');
                        btn.type = "button";
                        btn.className = "send-btn";
                        btn.value = JSON.stringify(dataInJson[i]);
                        btn.addEventListener('click', function() {
                            sendNFT(this.value);
                            }, false);
                        btn.innerHTML = '<img src="images/send.png" />';
                        tabCell.appendChild(btn); 
                    }
                    
                }
            let searchField = document.querySelector('#searchField');
            searchField.style.visibility = "visible";
            searchField.placeholder="Search table..."
            searchField.addEventListener('keyup', filterTable, false);
            }
    
            // ADD TABLE TO DOC
            document.getElementById("dataTable").innerHTML = "";
            document.getElementById("dataTable").appendChild(table);

        } // end create table function
        
async function buildButtonClicked() { 
            // get and set data
			clearTableData();
            await getData('nft', document.getElementById("game").value, document.getElementById("usernameInput").value).then( result => APIDataJson = result );
            // update account name
            var textHeader = document.getElementById("topText"); 
			textHeader.innerText = "NFTs for account: @" + document.getElementById("usernameInput").value
            // build table
            setTimeout(() => {  buildTableWithData(APIDataJson);}, 150); 
            
        }
		
function buildTableWithData(result) {
    buildTable(APIDataJson);
    let headerRow = document.querySelector('#jsonDataTable').rows[0];
    if (headerRow.cells.length > 1) {  
		return;
        }
    else {
		document.getElementById("dataTable").innerText = "Loading. Please wait.";
        setTimeout(() => {  buildTableWithData(APIDataJson);}, 50);
    }
}

async function getJson() {
          await getData('nft', document.getElementById("game").value, document.getElementById("usernameInput").value).then( result => APIDataJson = result);  
         }
        
function clearTableData() {
            APIDataJson = [];
        }
        
        // Opens the pop up
function sendNFT(buttonData) {
            buttonData = JSON.parse(buttonData);
            document.querySelector("#broadcastTXButton").value = buttonData._id;
            // Opening the pop up
            var modal = document.querySelector("#myModal");
            var span = document.querySelector(".close");
            modal.style.display = "block";
            span.onclick = function() {
                modal.style.display = "none";
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

        // Broadcasts tx (transfer)
function broadcastSendTX() {
            var input = document.querySelector("#toAccountInput").value;
            // check for username errors (wrong ones can still be entered, but this is to prevent mistakes like entering @)
            if (input.indexOf('@') > -1 || input.length < 3 || input.length > 16 || /\s/.test(input) || input.indexOf('!') > -1 || input.indexOf('"') > -1) {
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
                transaction.contractPayload.nfts[0].ids = [];
                transaction.contractPayload.nfts[0].ids.push(document.querySelector("#broadcastTXButton").value);
               
                message = "Send " + currentTable + " NFT with ID " + document.querySelector("#broadcastTXButton").value + " to: " + input;
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
        
function filterTable(event) {
            var filter = event.target.value.toUpperCase();
            var table = document.querySelector("#jsonDataTable")
            var rows = document.querySelector("#jsonDataTable tbody").rows;
            var cols = document.querySelector('#jsonDataTable').rows[0].cells.length
            cols -= 1 // - minus 1 so it ignores the buttons
             for (var i = 1; i < rows.length; i++) {
                 let countCol = [];
                 for (var j = 0; j < cols; j++) {
                    countCol[j] =  rows[i].cells[j].textContent.toUpperCase();         
                 }
                 // Switch so you can filter through all columns, instead of one. Working for upto 5
                 switch (cols) {
                     case 1: 
                         if (countCol[0].indexOf(filter) > -1) {
                            rows[i].style.display = "";
                         } else {
                            rows[i].style.display = "none";
                            } 
                         break;
                         
                     case 2: 
                         if (countCol[0].indexOf(filter) > -1 || countCol[1].indexOf(filter) > -1) {
                            rows[i].style.display = "";
                         } else {
                            rows[i].style.display = "none";
                            }          
                         break;
                     case 3: 
                         if (countCol[0].indexOf(filter) > -1 || countCol[1].indexOf(filter) > -1 || countCol[2].indexOf(filter) > -1) {
                            rows[i].style.display = "";
                         } else {
                            rows[i].style.display = "none";
                            }     
                         break;
                     case 4: 
                         if (countCol[0].indexOf(filter) > -1 || countCol[1].indexOf(filter) > -1 || countCol[2].indexOf(filter) > -1 || countCol[3].indexOf(filter) > -1) {
                            rows[i].style.display = "";
                         } else {
                            rows[i].style.display = "none";
                            }     
                         break;
                     case 5:
                         if (countCol[0].indexOf(filter) > -1 || countCol[1].indexOf(filter) > -1 || countCol[2].indexOf(filter) > -1 || countCol[3].indexOf(filter) > -1 || countCol[4].indexOf(filter) > -1) {
                            rows[i].style.display = "";
                         } else {
                            rows[i].style.display = "none";
                            } 
                         break;
                     case 6: 
                         if (countCol[0].indexOf(filter) > -1 || countCol[1].indexOf(filter) > -1 || countCol[2].indexOf(filter) > -1 || countCol[3].indexOf(filter) > -1 || countCol[4].indexOf(filter) > -1 || countCol[5].indexOf(filter) > -1) {
                            rows[i].style.display = "";
                         } else {
                            rows[i].style.display = "none";
                            } 
                         break;
                      case 7:
                         if (countCol[0].indexOf(filter) > -1 || countCol[1].indexOf(filter) > -1 || countCol[2].indexOf(filter) > -1 || countCol[3].indexOf(filter) > -1 || countCol[4].indexOf(filter) > -1 || countCol[5].indexOf(filter) > -1 || countCol[6].indexOf(filter) > -1) {
                            rows[i].style.display = "";
                         } else {
                            rows[i].style.display = "none";
                            } 
                         break;
                      case 8:
                         if (countCol[0].indexOf(filter) > -1 || countCol[1].indexOf(filter) > -1 || countCol[2].indexOf(filter) > -1 || countCol[3].indexOf(filter) > -1 || countCol[4].indexOf(filter) > -1 || countCol[5].indexOf(filter) > -1 || countCol[6].indexOf(filter) > -1 || countCol[7].indexOf(filter) > -1) {
                            rows[i].style.display = "";
                         } else {
                            rows[i].style.display = "none";
                            } 
                         break;
                      case 9:
                         if (countCol[0].indexOf(filter) > -1 || countCol[1].indexOf(filter) > -1 || countCol[2].indexOf(filter) > -1 || countCol[3].indexOf(filter) > -1 || countCol[4].indexOf(filter) > -1 || countCol[5].indexOf(filter) > -1 || countCol[6].indexOf(filter) > -1 || countCol[7].indexOf(filter) > -1 || countCol[8].indexOf(filter) > -1) {
                            rows[i].style.display = "";
                         } else {
                            rows[i].style.display = "none";
                            } 
                         break;
                      case 10:
                         if (countCol[0].indexOf(filter) > -1 || countCol[1].indexOf(filter) > -1 || countCol[2].indexOf(filter) > -1 || countCol[3].indexOf(filter) > -1 || countCol[4].indexOf(filter) > -1 || countCol[5].indexOf(filter) > -1 || countCol[6].indexOf(filter) > -1 || countCol[7].indexOf(filter) > -1 || countCol[8].indexOf(filter) > -1 || countCol[9].indexOf(filter) > -1) {
                            rows[i].style.display = "";
                         } else {
                            rows[i].style.display = "none";
                            } 
                         break;
                        }
                        }
            } 
  
