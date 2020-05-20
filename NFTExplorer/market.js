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

var APIDataJson = [];
var currentTable = "";
var loggedIn = false;
var currentUser = "";
var currentSort = -1;

// fetches actual data
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
// returns relevant data
function sortData(data) {
        let JSONdata = [];
        var counter = 0;
        for (i = data.length - 1 ; i > - 1; i--) { 
            JSONdata.push({});
            JSONdata[counter].seller = data[i].account;
            JSONdata[counter].nftId = data[i].nftId;
            switch(currentTable) {
                case 'STAR': 
                    JSONdata[counter].card = data[i].grouping.class + ": "+ data[i].grouping.type;
                    break;
                case 'CITY': 
                    JSONdata[counter].name = data[i].grouping.name;
                    break;
            }
            JSONdata[counter].price = parseFloat(data[i].price) 
			JSONdata[counter].priceSymbol = data[i].priceSymbol;
            // reorder to show _id first
            counter++;
        }
    return JSONdata;
}

// loads the UI elements
async function loadMarket() {
    clearTableData();
    let table = document.querySelector("#game").value
    currentTable = table;
    table = table + "sellBook";
    // get all data not only first 1000
    let offSet = 0;
    await getData("nftmarket", table, offSet).then( function(result){APIDataJson = sortData(result)});
    let isMore = false;
    // if bigger than thousand enters loop with offset
    if (APIDataJson.length == 1000) {
            isMore = true;
            offSet += 1000;
        }
    while (isMore) {
        let length1 = APIDataJson.length;  
        let APIDataJsonOld = APIDataJson;
        await getData("nftmarket", table, offSet).then( function(result){ 
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
    $("#searchField").val("");
    buildTable(APIDataJson);
}

function clearTableData() {
    APIDataJson = [];
}

//builds the actual table and adds data
function buildTable(marketData) {
    // Get data for table header. 
    var col = [];
    for (var i = 0; i < marketData.length; i++) {
        for (var key in marketData[i]) {
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
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");// TABLE HEADER.
        th.innerText = col[i];
        tr.appendChild(th);   
    }
    var th = document.createElement("th");
    th.innerText = "Options";
    tr.appendChild(th);
    
    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < marketData.length; i++) {
        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) {    
            var tabCell = tr.insertCell(-1);
            tabCell.innerText = marketData[i][col[j]];                   
        }
        // build the send button
        var tabCell = tr.insertCell(-1);
        var btn = document.createElement('button');
        btn.type = "button";
        btn.className = "buy-btn";
        btn.value = JSON.stringify(marketData[i]); // save data as string
        btn.addEventListener('click', function() {
            buyNFT(this.value);
        }, false);
        btn.innerText = "Buy";  
        if (loggedIn) {
            btn.disabled = false;
        }
        else {
            btn.disabled = true;
        }
        tabCell.appendChild(btn);           
    }
    
    // Show search input field
    let searchField = document.querySelector('#searchField');
    searchField.style.visibility = "visible";
    searchField.placeholder="Search market..."
    searchField.addEventListener('keyup', filterTable, false);
       
    // ADD TABLE TO DOC
    document.querySelector("#marketTable").innerHTML = "";
    document.querySelector("#marketTable").appendChild(table);;
	
  
    
	// add sort click listeners
	headers = document.getElementsByTagName("th");
	headers[0].addEventListener("click", function(){ sortTableString(0); }); 
	headers[2].addEventListener("click", function(){ sortTableString(2); }); 
	headers[4].addEventListener("click", function(){ sortTableString(4); }); 
	headers[1].addEventListener("click", function(){ sortTableNumber(1); }); 
	headers[3].addEventListener("click", function(){ sortTableNumber(3); }); 
    
}   // end build table

// Search table and filter
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
        if (countCol[0].indexOf(filter) > -1 || countCol[1].indexOf(filter) > -1 || countCol[2].indexOf(filter) > -1 || countCol[3].indexOf(filter) > -1 || countCol[4].indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
            }     
        }
}
  
// builds and broadcasts transaction
function buyNFT(button) {
    button = JSON.parse(button); // data is stored as string, now converts to json
    let tx = {};
    tx.contractName = "nftmarket";
    tx.contractAction = "buy";
    tx.contractPayload = {};
    tx.contractPayload.symbol = currentTable;
    tx.contractPayload.nfts = [];
    tx.contractPayload.nfts.push(button.nftId);
    tx.contractPayload.marketAccount = "oceanwallet";
    message = "Buy " + button.card + " with ID " + button._id;
                hive_keychain.requestCustomJson(currentUser, "ssc-mainnet-hive", "Active", JSON.stringify(tx), message, function(response) {
	               if (response.success) {
                       alert("Succesfully bought NFT!");
                       $("#searchField").val("");
                       if (currentSort == 1 || currentSort == 3) {
                           sortTableNumber(currentSort);
                       }
                       loadMarket();
                       }
                    else {
                        alert('Transaction failed, please try again!');
                    }
                });  
}

// logs in, allows buying
function login() {
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
            loadMarket();
           }
    });
}

// sorts table 
function sortTableString(columnNumber) {
	if (currentSort == columnNumber) {
		reverseTableRows();
		return;
	}
    var tbl = document.getElementById("jsonDataTable").tBodies[0];
    var store = [];
    for(var i=0, len=tbl.rows.length; i<len; i++){
        var row = tbl.rows[i];
        var sortstr = row.cells[columnNumber].innerText;
        if(!isNaN(sortstr)) store.push([sortstr, row]);
    }
    store.sort(function(x,y){
        return x[0] > y[0];
    });
    for(var i=0, len=store.length; i<len; i++){
        tbl.appendChild(store[i][1]);
    }
    store = null;
	currentSort = columnNumber;
}

function sortTableNumber(columnNumber){
    if (currentSort == columnNumber) {
		reverseTableRows();
		return;
	}
    var tbl = document.getElementById("jsonDataTable").tBodies[0];
    var store = [];
    for(var i=0, len=tbl.rows.length; i<len; i++){
        var row = tbl.rows[i];
        var sortnr = parseFloat(row.cells[columnNumber].innerText);
        if(!isNaN(sortnr)) store.push([sortnr, row]);
    }
    store.sort(function(x,y){
        return x[0] - y[0];
    });
    for(var i=0, len=store.length; i<len; i++){
        tbl.appendChild(store[i][1]);
    }
    store = null;
    currentSort = columnNumber;
}

function reverseTableRows() {
    var table = document.getElementById("jsonDataTable"),
        newTbody = document.createElement('tbody'),
        oldTbody = table.tBodies[0],
		
        rows = oldTbody.rows;
		newTbody.appendChild(rows[0]);
        i = rows.length - 1;

    while (i >= 1) {
        newTbody.appendChild(rows[i]);
        i -= 1;
    }
    oldTbody.parentNode.replaceChild(newTbody, oldTbody);
}




