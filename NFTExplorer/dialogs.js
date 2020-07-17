var symbolSuggestions = ["SWAP.HIVE", "SIM", "STARBITS", "DEC", "BEER", "BATTLE", "LEO", "PAL", "ATOM", "GAMER"];

function dialogClickHandler(e) {
    if (e.target.tagName !== 'DIALOG') {
        return;
    }

    const rect = e.target.getBoundingClientRect();

    const clickedInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
    );

    if (clickedInDialog === false)
        e.target.close();
}

function getDialog(type,data) {
    $("#modalDialog").html("");
    switch(type) {
        case 'singleSell': buildSingleSell(data); break;       
           }
    window.onclick = function(event) {   
        dialogClickHandler(event);
    }
    document.getElementById("modalDialogContent").showModal();
}

function buildSingleSell(data) {
    $("#modalDialog").append("<dialog id ='modalDialogContent'></dialog>"); 
            $("#modalDialogContent").append("<label for = 'priceInput' > Price:</label>");
            $("#modalDialogContent").append("<input class = 'inputField' id = 'priceInput' type='number' placeholder='Price' name='priceInput' required>");
            $("#modalDialogContent").append("<label for = 'priceSymbolInput' > Symbol:</label>");
            $("#modalDialogContent").append("<input class = 'inputField' id = 'priceSymbolInput' type='text' placeholder='Price Symbol' name='priceSymbolInput' required>");
            $("#modalDialogContent").append("<br>");
            $("#modalDialogContent").append("<br>");
            $("#modalDialogContent").append('<button class = "mainButton" id = "dialogButton"> Sell</button>');
            $( "#dialogButton" ).click(function() {
                sellNFT(data, $('#priceInput').val(), $('#priceSymbolInput').val());          
            });
            $("#priceSymbolInput").autocomplete({
                source: symbolSuggestions
            });
}
