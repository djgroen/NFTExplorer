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
    $("#body").append('<p id = "loading"> Loading. Please wait. </p>')
	getAll().then( () => loaded()  );
}

// runs when the page has loaded
function loaded() {
		clear();
		countFans(data);
		buildData();
        createDownload();
		showData();
}

//clears the page
function clear() {
	$("#loading").remove()
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

    // $("#body").append('<div id = "stats"><p>' +  + '</p></div>')
    for (let i = 0; i < result.length; i++) {
        let userdata = '<span class = "user">' + result[i].split(":")[0] + '</span>'
        userdata += '<span class = "fans">' + result[i].split(":")[1] + '</span>'
        userdata += '<br>'
        $("#list").append(userdata);
    }
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

function createDownload() {
    var currentdate = new Date(); 
    var datetime = "" + currentdate.getDate() + 
                + (currentdate.getMonth()+1)  +  
                + currentdate.getFullYear() +   
                + currentdate.getHours() +   
                + currentdate.getMinutes()
    $("#actionArea").prepend('<a id="downloadLink" class = "button" href="#" download="risingstarTopFans' + datetime +'.txt">DOWNLOAD RAW DATA</a>') 
    $("a#downloadLink").click(function() {
        this.href = "data:text/plain;charset=UTF-8," + result.join('\r\n');
    });
}

