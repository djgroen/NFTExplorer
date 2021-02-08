$.when(
    $.getScript( "https://cdn.datatables.net/fixedheader/3.1.7/js/dataTables.fixedHeader.min.js"),
    $.getScript( "https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"),
    $.getScript( "https://cdn.datatables.net/select/1.3.1/js/dataTables.select.min.js"),
    $.getScript( "https://cdn.datatables.net/searchbuilder/1.0.1/js/dataTables.searchBuilder.min.js"),
    $.Deferred(function( deferred ){
        $( deferred.resolve );
    })
).done(function(){
});

function makeDT() {
    var table = $('#marketTable').DataTable({
        "dom": 'lfrtip',
        "paging":   false,
        "fixedHeader": true,
        "order": [[ "4", "desc" ]], 
        "searchPanes": false,
        columnDefs: [
            {targets: "name",
             render: function(data, type, row) {
                 return data;
             }
            },
             {targets: ["type"],
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
            {targets: "age",
             render: function(data, type, row) {
                 color = getAgeRatingColor(data);   
                 return '<span style="color:' + color + '">' + Math.round(data) + '</span>';
                }
            },
            {targets: ["overall_strength","goal_os", "def_os", "mid_os", "att_os"],
                    render: function (data, type, row ) {
                        color = getRatingColor(data);
                        return '<span style="color:' + color + '">' + Math.round(data) + '</span>';
                    }
               }, 
            {targets: ["goalkeeping", "defending", "passing", "dribbling", "shot", "headball", "form", "speed", "cleverness", "teamplayer", "endurance", "vulnerability"],
             render: function(data,type, row) {
                 color = getRatingColor(data);
                 // return '<span style="color:' + color + '">' + Math.round(data) + '</span>';
                 return Math.round(data);
                 // add class=" highlightStat" later to highlight position specific skill. Split up the targets for that (?)
             }  
            },
            {targets: "price",
             render: function(data) {
                return data/100000000;
             }
            },
             // {className: "highlightStat", "targets": ["goalkeeping", "defending", "passing", "dribbling", "shot", "headball", "form", "speed", "cleverness", "teamplayer", "endurance", "vulnerability"]}
        ]
        });
    
    $('#controls').keyup( function() {
        table.draw();
    } );
    
    $(":checkbox").change(function() {
        console.log("check")
        table.draw();
    });
    
  $("#controls").css("display", "inline-block");
}

$.fn.dataTable.ext.search.push(
    // Age filtering
    function( settings, data, dataIndex ) {
        var min = parseInt( $('#minAge').val());
        var max = parseInt( $('#maxAge').val());
        var age = parseFloat( data[3] ) || 0; // age column
 
        if ( ( isNaN( min ) && isNaN( max ) ) ||
             ( isNaN( min ) && age <= max ) ||
             ( min <= age   && isNaN( max ) ) ||
             ( min <= age   && age <= max ) )
        {
            return true;
        }
        return false;
    }    
);

$.fn.dataTable.ext.search.push(
    // OS filtering
    function( settings, data, dataIndex ) {
        var min = parseInt( $('#minOS').val());
        var max = parseInt( $('#maxOS').val());
        var os = parseFloat( data[4] ) || 0; // os column
 
        if ( ( isNaN( min ) && isNaN( max ) ) ||
             ( isNaN( min ) && os <= max ) ||
             ( min <= os   && isNaN( max ) ) ||
             ( min <= os   && os <= max ) )
        {
            return true;
        }
        return false;
    }   
);

$.fn.dataTable.ext.search.push(
    // pos filtering
    function( settings, data, dataIndex ) {
        var goal = $('#goalBox').prop('checked');
        var def = $('#defBox').prop('checked');
        var mid = $('#midBox').prop('checked');
        var att = $('#attlBox').prop('checked');
        var pos =  data[1]; // pos column
        if (goal == true) {
            if (pos == "Goal") {
                return true;
                }        
            }
        if (def == true) {
            if (pos == "Def") {
                return true;
                }        
            }
        if (mid == true) {
            if (pos == "Mid") {
                return true;
                }        
            }
        if (att == true) {
            if (pos == "Att") {
                return true;
                }        
            }
        return false;
    }   
);

