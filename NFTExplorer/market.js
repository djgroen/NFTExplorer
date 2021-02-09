var ssc;
$.when(
    $.getScript( "https://cdn.jsdelivr.net/npm/@hivechain/hivejs/dist/hivejs.min.js" ),
    $.getScript( "https://cdn.jsdelivr.net/npm/sscjs@latest/dist/ssc.min.js" ),
    $.getScript( "https://cdn.datatables.net/plug-ins/1.10.22/pagination/input.js" ),
    $.getScript( "https://cdn.datatables.net/select/1.3.1/js/dataTables.select.min.js" ),
    $.getScript( "https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js" ),
    $.getScript( "./dialogs.js" ),
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

var page = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

window.addEventListener("load", function(){
    readCookie();
});

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
        if (page.includes("showMarket")) {
            currentTable = new URL(document.URL).searchParams.get("table"); 
        }
        for (let i = 0 ; i < data.length; i++) { 
			if (i == 1) {console.log(data[i])};
            JSONdata.push({});
            JSONdata[i].seller = data[i].account;
            JSONdata[i].nftId = data[i].nftId;
            switch(currentTable) {
                case 'STAR': 
                    // JSONdata[i].card = data[i].grouping.class + ": "+ data[i].grouping.type;
					JSONdata[i].class = data[i].grouping.class;
					JSONdata[i].type = data[i].grouping.type;
                    break;
                case 'CITY': 
                    JSONdata[i].name = data[i].grouping.name;
                    break;
				case "NFTSR":
					JSONdata[i].artSeries = data[i].grouping.artSeries;
					break;
            }
            JSONdata[i].price = parseFloat(data[i].price) 
			JSONdata[i].priceSymbol = data[i].priceSymbol;
        }
    return JSONdata;
}

// loads the UI elements
async function loadMarket() {
    clearTableData();
	$("#marketTable").text("Fetching data from blockchain...")
    let table = document.querySelector("#game").value
    currentTable = table;
    table = table + "sellBook";
    // get all data not only first 1000
    let offSet = 0;
    await getData("nftmarket", table, offSet).then( function(result){APIDataJson = sortData(result)});
    let isMore = false;
    // if bigger than thousand enters loop with offset
    if (APIDataJson.length == 1000) { // Should be: if 999
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
        if (length2 - length1 < 1000) { // Should be: if (length2 - length1 < 999)
            isMore = false;
            }
        else {
            offSet += 1000;
        }
    }
	$("#marketTable").text("Building basic table...");
    buildTable(APIDataJson);
}

function clearTableData() {
    uncheckBoxes();
    document.getElementById("buyMultipleButton").style.visibility="hidden";
    document.getElementById("cancelMultipleButton").style.visibility="hidden";
    document.getElementById("stickyMenu").style.visibility="hidden"; 
    currentSort = 0;
    APIDataJson = []; 
}

function uncheckBoxes() {
    $('#tableArea' + ' :checkbox:enabled').prop('checked', false);
    document.getElementById("buyMultipleButton").style.visibility="hidden";
    document.getElementById("cancelMultipleButton").style.visibility="hidden";
    document.getElementById("stickyMenu").style.visibility="hidden"; 
    if (document.getElementById("checkboxButton")) {
        document.getElementById("checkboxButton").style.visibility="hidden"; 
    }
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
	var thead = table.createTHead();
    var tr = thead.insertRow(-1);    
    
    for (var i = -1; i < col.length + 1; i++) {
                var th = document.createElement("th");      // TABLE HEADER.
                if (i == -1) { // check boxes
                    // th.innerHTML = '<input type="checkbox" id="mainCheck" name="checkAll" onclick="" style = "visibility: hidden">';
                    th.innerHTML = '<button type="button" id="checkboxButton" name="Uncheck" onclick="uncheckBoxes()" style = "visibility: hidden" > Uncheck </button>';
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
    
    let cbID = 1;
    // ADD JSON DATA TO THE TABLE AS ROWS.
	var tbody = table.createTBody();
	
    for (var i = 0; i < marketData.length; i++) {
        tr = tbody.insertRow(0);
        for (var j = -1; j < col.length; j++) {    
            if (j == -1) {
                        var tabCell = tr.insertCell(-1);
                        // add check box for multiple actions
                        $('<input />', { type: 'checkbox', id: 'cb'+ cbID + "-" + marketData[i].seller, name: 'sendCB', value: marketData[i].nftId, onclick: 'getSelected()' }).appendTo(tabCell);
                        cbID++;  
                        }
            else if (j < col.length) {
                            var tabCell = tr.insertCell(-1);
                            tabCell.innerHTML = marketData[i][col[j]];
                        } 
        }
        // build the send or cancel button
        var tabCell = tr.insertCell(-1);
            var btn = document.createElement('button');
            btn.type = "button";
            btn.className = "buy-btn";
            btn.value = JSON.stringify(marketData[i]); // save data as string    
        if (loggedIn && marketData[i].seller == currentUser) {
                btn.addEventListener('click', function() {
                    cancelSellOrder(this.value);
                }, false);
                btn.innerText = "Cancel";  
        }
        else {
            btn.addEventListener('click', function() {
                buyNFT(this.value);
            }, false);
            btn.innerText = "Buy";    
        }
        if (loggedIn) {
                btn.disabled = false;
            }
            else {
                btn.disabled = true;
            }
            tabCell.appendChild(btn);   
             
    }
       
    // ADD TABLE TO DOC
    document.querySelector("#marketTable").innerHTML= "";
    document.querySelector("#marketTable").appendChild(table);;
	
	let searchPaneCols;
	switch(currentTable) {
		case "STAR": searchPaneCols = [3,4,6]; break;
		case "CITY": searchPaneCols = [1,3,5]; break;
		case "NFTSR": searchPaneCols = [1,3,5]; break;
	}
	$('#jsonDataTable').DataTable({
		"dom": 'Plfrtip',
		"order": [[ 2, "desc" ]],
		"orderClasses": false,
		"pageLength": 100,
		"lengthMenu": [[10, 25, 100, 500, -1], [10, 25, 100, 500, "All (may cause lag)"]],
		"pagingType": 'input',
		"searchPanes": {
			"cascadePanes": true,
            "columns": searchPaneCols
        },
		"columnDefs": [
		{ "orderable": false, targets: 0 }
		]
	});
}   // end build table

  
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
    message = "Buy " + button.card + " with ID " + button.nftId;
                hive_keychain.requestCustomJson(currentUser, "ssc-mainnet-hive", "Active", JSON.stringify(tx), message, function(response) {
	               if (response.success) {
                       alert("Succesfully bought NFT!");
                       $("#searchField").val("");

                       loadMarket();
                       }
                    else {
                        alert('Transaction failed, please try again!');
                    }
                });  
}

function cancelSellOrder(button) {
    button = JSON.parse(button); // data is stored as string, now converts to json
    let tx = {};
    tx.contractName = "nftmarket";
    tx.contractAction = "cancel";
    tx.contractPayload = {};
    tx.contractPayload.symbol = currentTable;
    tx.contractPayload.nfts = [];
    tx.contractPayload.nfts.push(button.nftId);
    message = "Cancel sell order for" + button.card + " with ID " + button.nftId;
                hive_keychain.requestCustomJson(currentUser, "ssc-mainnet-hive", "Active", JSON.stringify(tx), message, function(response) {
	               if (response.success) {
                       alert("Succesfully cancelled sell order!");
                       $("#searchField").val("");
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
    hive_keychain.requestSignBuffer(name, "Login", "Posting", function(response) {
        if(response.success == true) {
            loggedIn = true;
            currentUser = name;
            let loginArea = $("#loginAreaFrame");
            loginArea.html("");
            
            // create name label
            var label = $("<label>");
            if(page.includes("showMarket")) {
                label.html('<a ' + 'target="_blank"' + 'href="' + window.location.href + '">'+ name +'</a>'); 
               }
            else {
                label.html('<a ' + 'target="_blank"' + 'href="./showMarket.html?table=' + document.querySelector("#game").value + '&account=' + name + '">'+ name +'</a>');     
            }
            label.css("margin", "10px");
            loginArea.append(label);
            
            // create logout button
            let button = $("<button>")
            button.text("Logout");
            button.click( () => logout());
            button.attr("class", "mainButton");
            loginArea.append(button);
            
            $("#searchField").val("");

            if(page.includes("showMarket")) {
                $("#loginMessage").html(""); 
                loadMarket2();
               }
            else {
                loadMarket();    
            }    
            document.cookie="account=" + name + "; expires=Thu, 03 Jan 2030 00:00:01 GMT;";
           }
    });
}

function readCookie() {
    if(!(document.cookie = "" )) {
        var name = document.cookie.split('=')[1];
        hive_keychain.requestSignBuffer(name, "Login", "Posting", function(response) {
        if(response.success == true) {
            loggedIn = true;
            currentUser = name;
            let loginArea = $("#loginAreaFrame");
            loginArea.html("");
            
            // create name label
            var label = $("<label>");
            if(page.includes("showMarket")) {
                label.html('<a ' + 'target="_blank"' + 'href="' + window.location.href + '">'+ name +'</a>'); 
               }
            else {
                label.html('<a ' + 'target="_blank"' + 'href="./showMarket.html?table=' + document.querySelector("#game").value + '&account=' + name + '">'+ name +'</a>');     
            }
            label.css("margin", "10px");
            loginArea.append(label);
            
            // create logout button
            let button = $("<button>")
            button.text("Logout");
            button.click( () => logout());
            button.attr("class", "mainButton");
            loginArea.append(button);;
            $("#searchField").val("");
            
            if(page.includes("showMarket")) {
                $("#loginMessage").html(""); 
                loadMarket2();
               }
           }
        });
    } 
}

function logout()  {
    document.cookie = "account" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    location.reload();
    return false;
}

// Gets called when a Checkbox is clicked and returns IDs of selected checkboxes
function getSelected() {
    selected = [];
    if (!loggedIn) {
        alert("Please login before trying to buy NFTs");
        uncheckBoxes();
        return; 
        }
    
    $("input:checkbox[name=sendCB]:checked").each(function(){
        selected.push($(this).val()); //
    });
    if(selected.length > 0) {
       document.getElementById("stickyMenu").style.visibility="visible";
        switch(boxesCheckedValid() ) {
            case "buy": 
                    document.getElementById("buyMultipleButton").style.visibility="visible";
                    document.getElementById("cancelMultipleButton").style.visibility="hidden"; break;
            case "cancel":
                    document.getElementById("buyMultipleButton").style.visibility="hidden";
                    document.getElementById("cancelMultipleButton").style.visibility="visible";  
                    break;
            default: 
                    document.getElementById("buyMultipleButton").style.visibility="hidden";
                    document.getElementById("cancelMultipleButton").style.visibility="hidden";
                    document.getElementById("stickyMenu").style.visibility="hidden"; 
                    break;
               }
        document.getElementById("checkboxButton").style.visibility="visible";
       }
    else {
        document.getElementById("buyMultipleButton").style.visibility="hidden";
        document.getElementById("cancelMultipleButton").style.visibility="hidden";
        document.getElementById("stickyMenu").style.visibility="hidden"; 
        document.getElementById("checkboxButton").style.visibility="hidden";
    } 
    if (selected.length > 50) {
        alert('You can only transfer 50 NFTs in one transaction, please deselect your last checkbox or the transaction will fail');  
    }
    return selected;
}

function multipleBuyButton() {
    selectedCB = getSelected();
    let tx = {};
    tx.contractName = "nftmarket";
    tx.contractAction = "buy";
    tx.contractPayload = {};
    tx.contractPayload.symbol = currentTable;
    tx.contractPayload.nfts = selectedCB;
    tx.contractPayload.marketAccount = "oceanwallet";
    message = "Buy NFT(s) with ID(s): " + selectedCB;
                hive_keychain.requestCustomJson(currentUser, "ssc-mainnet-hive", "Active", JSON.stringify(tx), message, function(response) {
	               if (response.success) {
                       alert("Succesfully bought NFT(s)!");
                       $("#searchField").val("");
                    // check the current page to know what load function to call
                       if(page == "market.html"){
                           loadMarket();
                       }
                       else {
                           loadMarket2();
                       }
                   }
                    else {
                        alert('Transaction failed, please try again!');
                    }
                }); 
}

function multipleCancelButton() {
    selectedCB = getSelected();
    let tx = {};
    tx.contractName = "nftmarket";
    tx.contractAction = "cancel";
    tx.contractPayload = {};
    tx.contractPayload.symbol = currentTable;
    tx.contractPayload.nfts = selectedCB;
    message = "Cancel buy order(s) for NFT(s) with ID(s): " + selectedCB;
                hive_keychain.requestCustomJson(currentUser, "ssc-mainnet-hive", "Active", JSON.stringify(tx), message, function(response) {
	               if (response.success) {
                       alert("Succesfully cancelled sell order!");
                       $("#searchField").val("");
                    // check the current page to know what load function to call
                       if(page == "market.html"){
                           loadMarket();
                       }
                       else {
                           loadMarket2();
                       }
                   }
                    else {
                        alert('Transaction failed, please try again!');
                    }
                });     
}

function boxesCheckedValid() {
    buyable = true;
    cancelable = true; 
    
    let selected = [];
    let names = [];
    
    $("input:checkbox[name=sendCB]:checked").each(function(){
        selected.push($(this).attr('id')); //
    });
    
    for(let i = 0; i < selected.length; i++) {
        selected[i] = selected[i].split('-')[1];
        names.push(selected[i]);
    }
    
    for (let i = 0; i < names.length; i++) {
        if (currentUser == names[i]) {
                buyable = false;       
            }   
        else if ( !(currentUser == names[i]) ) {
            cancelable = false;        
        } 
    }
    if (buyable == true) {
            return "buy";
        }
    else if (cancelable == true) {
            return "cancel";
    }
    else { 
        return "null";
    }             
}

       

        
                 
                 

