var ssc;

$.when(
    $.getScript( "https://cdn.jsdelivr.net/npm/sscjs@latest/dist/ssc.min.js" ),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
    ssc = new SSC('https://api.hive-engine.com/rpc');  
});

var data = [];
var players = [];
var fans = [];
var	result = [];

window.onload = function() {
	document.getElementById("body").innerText = "Loading. Please wait.";
	getAll().then( () => loaded()  );
}

// runs when the page has loaded
function loaded() {
		clear();
		countFans(data);
		buildData();
		showData();
}

//clears the page
function clear() {
	document.getElementById("body").innerText = "";
}

// builds a single array from the players and fans arrays to sort and show it
function buildData() {
		for (let i = 0; i < players.length; i++) {
					result[i] = players[i] + ":" + fans[i];
		}
}

// visually represents the array that contains the matched fans and player data
function showData() {
	// sorts by name
	// result.sort()
	
	// sorts by fans number
	result.sort(function(a, b){return a.split(":")[1] - b.split(":")[1]});
	result.reverse();

	document.getElementById("body").innerText = result.join('\r\n');	
}

function countFans(data) {
    var playerexists;
	for(let j = 0; j < data.length; j++) {
        playerexists = false;
        if (!["energyboost","xpboost", "fuel", ""].includes(data[j].properties.class)) {
            for(let i = 0; i < players.length; i++) {
                  
                if(players[i] == data[j].account ) {
                    fans[i] += parseInt(data[j].properties.stats.split(",")[0]);
                    playerexists = true; break;
                } 	
            }
            if(!playerexists) {
                players.push(data[j].account);
                fans.push(0);
                j--;
            }   
        }	
    }
}

var getData = function(contract, table, offSet) {
    return new Promise(function(resolve, reject) {  
        ssc.find(contract, table, {}, 1000, offSet, [], (err, result) => {          
            if (result) {
                APIDataJson = result;
                resolve(result);
            } else {
				document.getElementById("body").innerText = "Failed to get the blockchain data, please reload the page to try again. ";
                reject(Error("Failed to get JSON data!")); 
            }
        });
    });
}

async function getAll() {
	var length = 1000;
	var offset = 0;
	while (length > 999) {
		await   getData("nft","STARinstances", offset).then(function(result){ length = result.length; offset += 1000; data = data.concat(result); }) 
	}
}

