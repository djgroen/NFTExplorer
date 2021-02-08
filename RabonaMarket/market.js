$.when(
    $.getScript( "./datatable.js" ),
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
        buildTable(); // Build table
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
        
        // get os for all positions
        let stats = getOS(object)
        object["goal_os"] = stats.goal;
        object["def_os"] = stats.def;
        object["mid_os"] = stats.mid;
        object["att_os"] = stats.att;
        
        switch(object.type) {
            case "1": object.type = "Goal";break;
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
            marketdata = JSON.parse(JSON.stringify( marketdata, ["name", "type", "country", "age", "overall_strength", "goal_os", "def_os", "mid_os", "att_os", "goalkeeping", "defending", "passing", "dribbling", "shot", "headball","form", "speed", "cleverness", "teamplayer", "endurance", "vulnerability", "salary", "nft", "price", "user"]));
            for (var key in marketdata[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            } 
        }
    
    // create table with id markettable
        var table = document.createElement("table");
        table.setAttribute('id', 'marketTable');
    
    // create header and add keys
        
        var thead = table.createTHead();
        var tr = thead.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            switch(col[i]) {
                case "overall_strength": th.innerText = "OS";  break;
                case "type": th.innerText = "position";  break;
                case "goalkeeping": th.innerText = "GK";  break;
                case "defending": th.innerText = "DEF";  break;
                case "passing": th.innerText = "PAS";  break;
                case "dribbling": th.innerText = "DRI";  break;
                case "shot": th.innerText = "SHT"; break;
                case "headball": th.innerText = "HB"; break;
                case "form": th.innerText = "FRM"; break;
                case "speed": th.innerText = "SPD"; break;
                case "cleverness": th.innerText = "CLV"; break;    
                case "teamplayer": th.innerText = "TP"; break;
                case "endurance": th.innerText = "END"; break;
                case "vulnerability": th.innerText = "VUL"; break;                
                default: th.innerText = col[i]; break;
            }
            th.className = col[i]; // for addressing through class name in datatables target list
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
    
    $("#loading").remove()
    
    // add table to div
        var divContainer = document.getElementById("tableArea");
        divContainer.appendChild(table);
    // make it a datatable
        makeDT();   
}



function getRatingColor(rating) {
    var color = '#grey'; // grey
    if (rating >= 15 && rating < 30) {
        color = '#fe0e00'; // red
    } 
    else if (rating >= 30 && rating < 60) {
        color = '#fe7903'; // orange
    }
    else if (rating >= 60 && rating < 80 ) {
        color = '#8dc961'; // greenish
    }
    else if (rating >= 80 && rating < 95) {
        color = "#34ebcc" // blue
    }
    else if (rating >= 95) {
        color = "#d042f3" // purple
    }
    return color;
}

function getAgeRatingColor(age) {
    var color = '#grey'; // grey
    if (age >= 15 && age < 20) {
        color = '#d042f3'; // purple
    } 
    else if (age >= 20 && age < 25) {
        color = "#34ebcc" // blue
    }
    else if (age >= 25 && age < 30 ) {
        color = '#8dc961'; // greenish
    }
    else if (age >= 30 && age < 35) {
        color = '#fe7903'; // orange
    }
    else if (age >= 35) {
        color = '#fe0e00'; // red
    } 
    return color;
}

function getRatingColorByPostion (rating, position) {
    return getRatingColor(rating);
}

function getOS(player) {
    let stats = new Object();
    stats.goal = (0.6 * player.goalkeeping + 0.1 * player.passing + 0.1 * player.speed + 0.2 * player.endurance);
    stats.def = (0.4 * player.defending + 0.25 * player.passing + 0.05 * player.dribbling + 0.1 * player.speed + 0.2 * player.endurance);
    stats.mid = (0.2 * player.defending + 0.2 * player.passing + 0.2 * player.dribbling + 0.1 * player.shot  + 0.1 * player.speed + 0.2 * player.endurance);
    stats.att = (0.15 * player.defending + 0.2 * player.passing + 0.15 * player.dribbling + 0.2 * player.shot  + 0.1 * player.speed + 0.2 * player.endurance);
    return stats;
}