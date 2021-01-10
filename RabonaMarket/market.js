$.when(
    $.getScript( "https://cdn.datatables.net/1.10.23/js/jquery.dataTables.min.js" ),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
    getMarketActive();
});

const apiserver = "http://api.rabona.io/";
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
        // DELETE LATER
            buildTable();
        //
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
        /* object.price = object.price /100000000;
        object.age = Math.round(object.age);
        object.defending = Math.round(object.defending);
        object.dribbling = Math.round(object.dribbling);
        object.endurance = Math.round(object.endurance);
        object.passing = Math.round(object.passing);
        object.goalkeeping = Math.round(object.goalkeeping);
        object.headball = Math.round(object.headball);
        object.shot = Math.round(object.shot);
        object.speed = Math.round(object.speed);
        object.overall_strength = Math.round(object.overall_strength); */ // Rounding done by datatables
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
        table.setAttribute('id', 'marketTable');
    
    // create header and add keys
        
        var thead = table.createTHead();
        var tr = thead.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            switch(col[i]) {
                case "overall_strength": th.innerText = "OS"; break;
                case "type": th.innerText = "position"; break;
                  
                case "goalkeeping": th.innerText = "GK"; break;
                case "defending": th.innerText = "DEF"; break;
                case "passing": th.innerText = "PAS"; break;
                case "dribbling": th.innerText = "DRI"; break;
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
            tr.appendChild(th);
        }
        
     // add player data 
    
        var tbody = table.createTBody();
    
        for (var i = 0; i < marketdata.length; i++) {

            tr = tbody.insertRow(0);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                switch(col[j]) {
                    case "overall_strength": 
                    default: tabCell.innerText = marketdata[i][col[j]]; break;       
                       }
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
    $('#marketTable').DataTable({
        "paging":   false,
        "order": [[ 4, "desc" ]],
        columnDefs: [
            {targets: 0,
             render: function(data, type, row) {
                 return data;
             }
            },
             {targets: 1,
             render: function(data, type, row) {
                 switch(data) {
                    case "Goal": return '<span style="' + 'color:' + "#72c0f5" + '">' + data + '</span>'; break; 
                     case "Def": return '<span style="' + 'color:' + "#72d66a" + '">' + data + '</span>'; break; 
                     case "Mid": return '<span style="' + 'color:' + "#e0c969" + '">' + data + '</span>'; break; 
                     case "Att": return '<span style="' + 'color:' + "#ee7a74" + '">' + data + '</span>'; break; 
                    default: return data; break;
                    }
                }
            },
            {targets: 3,
             render: function(data, type, row) {
                 color = getAgeRatingColor(data);   
                 return '<span style="color:' + color + '">' + Math.round(data) + '</span>';
                }
            },
            {targets: 4,
                    render: function (data, type, row ) {
                        color = getRatingColor(data);
                        return '<span style="color:' + color + '">' + Math.round(data) + '</span>';
                    }
               }, 
            {targets: [5,6,7,8,9,10,11,12,13,14,15,16],
             render: function(data,type, row) {
                 color = getRatingColor(data);
                 return '<span style="color:' + color + '">' + Math.round(data) + '</span>';
                 // add class=" highlightStat" later to highlight position specific skill. Split up the targets for that
             }  
            },
            {targets: 19,
             render: function(data) {
                return data/100000000;
             }
            },
            //{ className: "highlightStat", "targets": [5,6,7,8,9,10,11,12,13,14,15,16 ]}
        ]
        });
}

function arrayReplace(array, string, newstring) {
    var index = array.indexOf(string);

    if (index !== -1) {
        array[index] = newstring;
    }
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


