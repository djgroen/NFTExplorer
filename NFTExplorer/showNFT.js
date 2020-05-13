let ssc = new SSC('https://api.hive-engine.com/rpc');   
        var JsonGlobal = []  
        var getData = function(contract, table, account) {
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
                        case 'APIinstances': JSONdata[i] = JSON.parse(JSON.stringify( JSONdata[i].properties, ["x", "info"])); break;
                        
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
		
            
        function buildTable(JSON) {
            // Get data for table header. 
            var col = [];
            for (var i = 0; i < JSON.length; i++) {
                for (var key in JSON[i]) {
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
            for (var i = 0; i < JSON.length; i++) {

                tr = table.insertRow(-1);

                for (var j = 0; j < col.length + 1; j++) {
                    if (j < col.length) {
                            var tabCell = tr.insertCell(-1);
                            tabCell.innerHTML = JSON[i][col[j]];
                        } 
                    else {
                        var tabCell = tr.insertCell(-1);
                        var btn = document.createElement('button');
                        btn.type = "button";
                        btn.className = "send-btn";
                        btn.value = JSON[i]._id;
                        btn.addEventListener('click', function() {
                            sendNFT(this.value)
                            }, false);
                        btn.innerHTML = '<img src="images/send.png" />';
                        tabCell.appendChild(btn); 
                    }
                    
                }
            let searchField = document.querySelector('#searchField');
            searchField.style.visibility = "visible";
            searchField.placeholder="Search for _id..."
            searchField.placeholder="Search for _id..."
            searchField.addEventListener('keyup', filterTable, false);
            }
            
            // ADD TABLE TO DOC
            document.getElementById("dataTable").innerHTML = "";
            document.getElementById("dataTable").appendChild(table);;
            
            
        } // end create table function
        
        function loadDataButton() {
            var textHeader = document.getElementById("topText"); 
			textHeader.innerText = "NFTs for account: @" + document.getElementById("userInput").value
            
        }
        
        function buildButtonClicked() { 
            getJson();
            setTimeout(() => {  buildTable(JsonGlobal);}, 100); 
            
        }

        async function getJson() {
            await getData('nft', document.getElementById("game").value, document.getElementById("userInput").value).then( result => JsonGlobal = result);
         }
        
        function clearTable() {
            JSONdata = [];
        }

        function sendNFT(button) {
            alert("Send button works! + NFT ID: " + button);
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
  