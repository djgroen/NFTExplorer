$.when(
    $.getScript( "https://cdn.datatables.net/1.10.23/js/jquery.dataTables.min.js" ),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
    getMarketActive();
});

const apiserver = "https://api.rabona.io/";
const marketapi = apiserver + "asks";

var marketdata;

function getMarketData(active, age_from, age_to, os_from, os_to) {
    $.getJSON( marketapi, {
        active: active,
        age_from: age_from,
        age_to: age_to,
        os_from: os_from,
        os_to
      }).done(function(data) {
        marketdata = data;
        adjustData();
        buildTable();
    });
}

function getMarketActive() {
    getMarketData(1, 0, 100, 0, 100);
}

// Modifies data to look better later
function adjustData() {
    marketdata.forEach(function(object) {
        if (object.nft == 0) {
            object.nft = "no";
        }
        else {
            object.nft = "yes";    
        }
        object.price = object.price /100000000;
        object.age = Math.round(object.age);
        object.defending = Math.round(object.defending);
        object.dribbling = Math.round(object.dribbling);
        object.endurance = Math.round(object.endurance);
        object.passing = Math.round(object.passing);
        object.goalkeeping = Math.round(object.goalkeeping);
        object.headball = Math.round(object.headball);
        object.shot = Math.round(object.shot);
        object.speed = Math.round(object.speed);
        object.overall_strength = Math.round(object.overall_strength);
        switch(object.type) {
            case "1": object.type = "Goal"; break;
            case "2": object.type = "Def"; break;
            case "3": object.type = "Mid"; break;
            case "4": object.type = "Att"; break;
        };
    });
}

function buildTable() {
    // get keys for header
        var col = [];
        for (var i = 0; i <= 1; i++) {
            marketdata = JSON.parse(JSON.stringify( marketdata, ["name", "type", "country", "age", "overall_strength", "goalkeeping", "defending", "passing", "dribbling", "shot", "headball","form", "speed", "cleverness", "teamplayer", "endurance", "vulnerability", "salary", "nft", "price", "user"]));
            for (var key in marketdata[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            } 
        }
    
    // create table with id markettable
        var table = document.createElement("table");
        table.setAttribute('id', 'marketTable')
    
    // create header and add keys
        
        var thead = table.createTHead();
        var tr = thead.insertRow(0);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            switch(col[i]) {
                case "overall_strength": th.innerText = "OS"; break;
                case "type": th.innerText = "position"; break;
                default: th.innerText = col[i]; break;
            }
            tr.appendChild(th);
        }
        
     // add player data 
    
        var tbody = table.createTBody();
    
        for (var i = 0; i < marketdata.length; i++) {

            tr = tbody.insertRow(0);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerText = marketdata[i][col[j]];
            }
        }
    
    // add table to div
        var divContainer = document.getElementById("tableArea");
        divContainer.appendChild(table);
    // make it a datatable
        makeDT();   
}

function makeDT() {
    $('#marketTable').DataTable( {
        "paging":   false,
        "order": [[ 4, "desc" ]]
    } );
}

function arrayReplace(array, string, newstring) {
    var index = array.indexOf(string);

    if (index !== -1) {
        array[index] = newstring;
    }
}

