       // Opens the pop up
function sendNFT(buttonData) {
            buttonData = JSON.parse(buttonData);
            document.querySelector("#broadcastTXButton").onclick = broadcastSendTX;
            document.querySelector("#broadcastTXButton").value = buttonData._id;
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

        // Broadcasts tx (transfer)
function broadcastSendTX() {
            var input = document.querySelector("#toAccountInput").value;
            // check for username errors (wrong ones can still be entered, but this is to prevent mistakes like entering @)
            input = input.toLowerCase();
            if (input.indexOf('@') > -1 || input.length < 3 || input.length > 16 || /\s/.test(input) || input.indexOf('!') > -1 || input.indexOf('"') > -1 || input.indexOf(',') > -1) {
                alert('Check the entered username!');
            }
	    else if(input === "null") {
                alert('Sending to null: burning');
                var transaction = {};
                transaction.contractName = "nft";
                transaction.contractAction = "burn";
                transaction.contractPayload = {};
                transaction.contractPayload.nfts = [];
                transaction.contractPayload.nfts[0] ={};
                transaction.contractPayload.nfts[0].symbol = currentTable;
                transaction.contractPayload.nfts[0].ids = [];
                transaction.contractPayload.nfts[0].ids.push(document.querySelector("#broadcastTXButton").value);

                message = "Burn " + currentTable + " NFT with ID " + document.querySelector("#broadcastTXButton").value;
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

// nft is string containing json data of nft to sell
function sellNFT(nft, price, priceSymbol) {
    nft = JSON.parse(nft);
    
    // building transaction step by step
                var transaction = {};
                transaction.contractName = "nftmarket";
                transaction.contractAction = "sell";
                transaction.contractPayload = {};
                transaction.contractPayload.symbol = currentTable;
                transaction.contractPayload.nfts = [String(nft._id)];
                transaction.contractPayload.price = price;
                transaction.contractPayload.priceSymbol = priceSymbol;
                transaction.contractPayload.fee = 250;
                
                message = "Sell " + currentTable + " NFT with ID " + nft._id + "(" + nft.type + ")" + " for " + price + " " + priceSymbol;
                hive_keychain.requestCustomJson(document.querySelector('#usernameInput').value, "ssc-mainnet-hive", "Active", JSON.stringify(transaction), message, function(response) {
	               if (response.success) {
                       $("#modalDialogContent").append('<p id="sellResponse" style="font-weight: bold"> Successfully placed sell order! </p>');
                        console.log(response);
                       }
                    else {
                        alert('Transaction failed, please try again!');
                    }
                });
}

// sells nfts
// nfts is array with ids as strings
function sellmultipleNFTs(nfts, price, priceSymbol) {
 
    // building transaction step by step
                var transaction = {};
                transaction.contractName = "nftmarket";
                transaction.contractAction = "sell";
                transaction.contractPayload = {};
                transaction.contractPayload.symbol = currentTable;
                transaction.contractPayload.nfts = nfts;
                transaction.contractPayload.price = price;
                transaction.contractPayload.priceSymbol = priceSymbol;
                transaction.contractPayload.fee = 250;
                
                message = "Sell NFTs with IDs: " + nfts + " for " + price + " " + priceSymbol;
                hive_keychain.requestCustomJson(document.querySelector('#usernameInput').value, "ssc-mainnet-hive", "Active", JSON.stringify(transaction), message, function(response) {
	               if (response.success) {
                       $("#modalDialogContent").append('<p id="sellResponse" style="font-weight: bold"> Successfully placed sell order(s)! </p>');
                        console.log(response);
                       }
                    else {
                        alert('Transaction failed, please try again!');
                    }
                }); 
}
