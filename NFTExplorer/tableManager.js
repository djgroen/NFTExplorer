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
            
            for (var i = -1; i < col.length + 1; i++) {
                var th = document.createElement("th");      // TABLE HEADER.
                if (i == -1) { // check boxes
                    th.innerHTML = '<input type="checkbox" id="mainCheck" name="checkAll" onclick="" style = "visibility: hidden">';
                    tr.appendChild(th);
                }
                else if (i < col.length) {
                    th.innerText = col[i];
                    tr.appendChild(th);
                }
                else {
                    th.innerText = "Options";
                    tr.appendChild(th);
                }
                
            }
            
            let cbID = 0;
            // ADD JSON DATA TO THE TABLE AS ROWS.
            for (var i = 0; i < dataInJson.length; i++) {
                
                tr = table.insertRow(-1);
                for (var j = -1; j < col.length + 1; j++) {  
                    if (j == -1) {
                        var tabCell = tr.insertCell(-1);
                        // add check box for multiple transfer                   
                        $('<input />', { type: 'checkbox', id: 'cb'+ cbID, name: 'sendCB', value: dataInJson[i]._id, onclick: 'getSelected()' }).appendTo(tabCell);
                        cbID++;
                        // checkCol.appendChild(btn);     
                        }
                    else if (j < col.length) {
                            var tabCell = tr.insertCell(-1);
                            tabCell.innerHTML = dataInJson[i][col[j]];
                        } 
                    else {
                        var tabCell = tr.insertCell(-1);
                        // build the send button
                        var btn = document.createElement('button');
                        btn.type = "button";
                        btn.className = "send-btn";
                        btn.value = JSON.stringify(dataInJson[i]);
                        btn.addEventListener('click', function() {
                            sendNFT(this.value);
                            }, false);
                        btn.innerHTML = '<img src="images/send.png" />';
                        tabCell.appendChild(btn); 
                        
                        var divider = document.createElement('div');
                        divider.className = "divider";
                        tabCell.appendChild(divider); 
                        
                        // build the sell button
                        var sellBtn = document.createElement('button');
                        sellBtn.type = "button";
                        sellBtn.className = "sell-btn";
                        sellBtn.value = JSON.stringify(dataInJson[i]);
                        sellBtn.addEventListener('click', function() {
                            getDialog("singleSell", this.value);
                            }, false);
                        sellBtn.innerHTML = '<img src="images/sell.png" />';
                        tabCell.appendChild(sellBtn); 
                    }
                    
                }
            let searchField = document.querySelector('#searchField');
            searchField.style.visibility = "visible";
            searchField.placeholder="Search wallet..."
            searchField.addEventListener('keyup', filterTable, false);
            }
    
            document.querySelector('#totalCardsLabel').innerText = "Total NFTs: " + dataInJson.length;
    
            // ADD TABLE TO DOC
            document.getElementById("dataTable").innerHTML = "";
            document.getElementById("dataTable").appendChild(table);

        } // end create table function

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