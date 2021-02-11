// builds and broadcasts transaction
function buyNFT(item) {
    let tx = {};
    tx.contractName = "nftmarket";
    tx.contractAction = "buy";
    tx.contractPayload = {};
    tx.contractPayload.symbol = currentTable;
    tx.contractPayload.nfts = [item.toString()];
    tx.contractPayload.marketAccount = "oceanwallet";
    message = "Buy NFT with ID " + item;
                hive_keychain.requestCustomJson(currentUser, "ssc-mainnet-hive", "Active", JSON.stringify(tx), message, function(response) {
	               if (response.success) {
                       alert("Succesfully broadcasted transaction!");
                       loadMarket();
                       }
                    else {
                        alert('Transaction failed, please try again!');
                    }
                });  
}

function cancelSellOrder(item) {
    let tx = {};
    tx.contractName = "nftmarket";
    tx.contractAction = "cancel";
    tx.contractPayload = {};
    tx.contractPayload.symbol = currentTable;
    tx.contractPayload.nfts = [item.toString()];
    message = "Cancel sell order for NFT with ID " + item;
                hive_keychain.requestCustomJson(currentUser, "ssc-mainnet-hive", "Active", JSON.stringify(tx), message, function(response) {
	               if (response.success) {
                       alert("Succesfully broadcasted transaction!");
                       loadMarket();
                       }
                    else {
                        alert('Transaction failed, please try again!');
                    }
                });  
}

function multipleCancelButton() {
    let selected = getSelected();
    let items = [];
    selected.forEach(function(item) {
        items.push(item[0].toString())    
    });
    console.log(items)
    console.log(selected)
    let tx = {};
    tx.contractName = "nftmarket";
    tx.contractAction = "cancel";
    tx.contractPayload = {};
    tx.contractPayload.symbol = currentTable;
    tx.contractPayload.nfts = items;
    message = "Cancel buy order(s) for NFT(s) with ID(s): " + items;
                hive_keychain.requestCustomJson(currentUser, "ssc-mainnet-hive", "Active", JSON.stringify(tx), message, function(response) {
	               if (response.success) {
                       alert("Succesfully broadcasted transaction!");
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


function multipleBuyButton() {
    let selected = getSelected();
    let items = [];
    selected.forEach(function(item) {
        items.push(item[0].toString())    
    });
    let tx = {};
    tx.contractName = "nftmarket";
    tx.contractAction = "buy";
    tx.contractPayload = {};
    tx.contractPayload.symbol = currentTable;
    tx.contractPayload.nfts = items;
    tx.contractPayload.marketAccount = "oceanwallet";
    message = "Buy NFT(s) with ID(s): " + items;
                hive_keychain.requestCustomJson(currentUser, "ssc-mainnet-hive", "Active", JSON.stringify(tx), message, function(response) {
	               if (response.success) {
                       alert("Succesfully broadcasted transaction!");
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


// Gets called when the item selection changes
function updateActionButtons() {
    let selected = getSelected()
    if(selected.length > 0) {
        switch(checkSelection()) {
            case "buy":
                if (!document.getElementById("buyMultipleButton")) {
                    let btn = document.createElement("button");
                    btn.id = "buyMultipleButton";
                    btn.className = "mainButton";
                    btn.addEventListener("click", multipleBuyButton,false);
                    btn.innerText = "Buy selected";
                    document.getElementById("stickyMenu").append(btn);    
                }
                break;
            case "cancel": 
                if (!document.getElementById("cancelMultipleButton")) {
                    let btn = document.createElement("button");
                    btn.id = "cancelMultipleButton";
                    btn.className = "mainButton";
                    btn.addEventListener("click", multipleCancelButton,false);
                    btn.innerText = "Cancel selected";
                    document.getElementById("stickyMenu").append(btn);    
                }
                break;
            default: 
                if (document.getElementById("buyMultipleButton")) {
                        $("#buyMultipleButton").remove()
                }
                if (document.getElementById("cancelMultipleButton")) {
                        $("#cancelMultipleButton").remove()
                }
                    break;
               }
       }
    else {
        if (document.getElementById("buyMultipleButton")) {
            $("#buyMultipleButton").remove();
        }
        if (document.getElementById("cancelMultipleButton")) {
            $("#cancelMultipleButton").remove();
        }
    } 
}


function checkSelection() {
    buyable = true;
    cancelable = true; 
    
    let selected = getSelected()
    
    if (selected.length < 1) {
        return "null";
        }

    for (let i = 0; i < selected.length; i++) {
        if (currentUser == selected[i][1]) {
                buyable = false;       
            }   
        if ( !(currentUser == selected[i][1]) ) {
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


// logs in, allows buying
function login() {
    var name = $("#loginAccountName").val();
    hive_keychain.requestSignBuffer(name, "Login", "Posting", function(response) {
        if(response.success == true) {
            loggedIn = true;
            localStorage["loggedOut"] = "false";
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
            
            // Disable button so you dont try to load the table twice
            document.getElementById("loadButton").disabled = true;
            
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
    if (localStorage["loggedOut"] == "true") {
            return;
        }
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
    localStorage["loggedOut"] = "true";
    location.reload();
    return false;
}
