window.addEventListener('load', function () {
    var recentScoresDate = '-1';
    var shouldUpdate = false;
    var currentIndex = 0;
    var plotlyTotalAnimationFrames = 0;
    var plotlyCountAnimationFrames = 0;
    var usePlotlyCache = false;
    var MILLISECONDS_BETWEEN_PLAYS = 5000;
    var globalEventId = 1;
    var userData = [];
    var averageUserData = [];


    function main() {
        $.when(getDateOfLastUpdate()).done(() => {
            if (shouldUpdate) {
                rebuildTablesAndGraph();
            }
            else {
                setActive();
            }
        })
    }

    function rebuildTablesAndGraph()
    {
        userData = [];
        averageUserData = [];
        $.when(getUserAttemptData(), getAverageFormAttemptByFormEvent()).done(() => {
            removeEmptyAttempts();
            if(userData.length > 0)
            {
                clearTables();
                loadTopScoresTable();
                setActive();
            }
            else {
                showNoDataMessage();
            }
        });
    }

    function removeEmptyAttempts()
    {
        userData = userData.filter((attempt) => {
            return attempt.SimpleFormScores.length > 0;
        });

    }

    function showNoDataMessage()
    {
        var purgeGraph = jQuery.Event('purgeGraph');
        purgeGraph.containerDiv = 'graphArea';
        $(window).trigger(purgeGraph);
        $('#graphArea').empty();
        $("#leaderboard > tbody").html("");
        $("#tableData > tbody").html("");
        $('#graphArea').html('<div class="noDataDiv">NO DATA FOUND</div>');
        
    }


    function getDateOfLastUpdate() {
        console.log("getDateOfLastUpdate fired");
       return $.ajax({
            url: $.Api.getTopAttemptsDate(globalEventId),
            type: 'GET',
            dataType: 'json',
           success: function (date) {
               if (recentScoresDate !== date) {
                   recentScoresDate = date;
                   shouldUpdate = true;
               }
               else {
                   shouldUpdate = false;
               }
               
            },
            error: function (request, error) {
                console.error("unable to retrieve last attempts update date");
            }
        });
    }

    function getUserAttemptData() {
        console.log("getUserAttemptData fired");
        return $.ajax({
            url: $.Api.getTopAttemptsByEvent(globalEventId), //TODO: the formEventId is hardcoded to 1 - WILL NEED to be changed based on the event selected
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                userData = data;
                //$.Api.setRequestCache(data);
            },
            error: function (request, error) {
                console.error("unable to retrieve top user attempts");
            }
        });
    }
    function getAverageFormAttemptByFormEvent() {
        console.log("getDateOfLastUpdate fired");
        return $.ajax({
            url: $.Api.getAverageFormAttemptByFormEvent(globalEventId),
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                averageUserData = data;
            },
            error: function (request, error) {
                console.error("unable to retrieve average scores for event data");
                showNoDataMessage();
            }
        });
    }

    function getEventListing() {
        $.ajax({
            url: $.Api.getAllEventsOtherPort(),
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                loadEvents(data);
            },
            error: function (request, error) {
                console.error("Could not Retrieve events");
            }
        });
    };

    function clearTables() {
        var $topScoresTable = $('.user-scores-target');
        var $userStatsTable = $('#tableData');

        var fadeoutTime = 0; //on page load we dont want the unnecessary wait, only for after pageload we want to wait

        if ($topScoresTable.children().length > 0) {
            fadeoutTime = 0;
        }

        $userStatsTable.fadeOut(fadeoutTime, function () {
            $userStatsTable.empty();
            $topScoresTable.empty();

            //the fadeOut causes the parent to display:none, need to we need to display the parent even though at this point it is empty
            //if we leave it at display:none and then just fadeIn, it still does not make it visible, need to be set visible manually first
            $userStatsTable.show();
            $topScoresTable.show();
        });
    }

    function loadTopScoresTable() {
        var markup = '';
        var $target = $('.user-scores-target');
        for (var i = 0; i < userData.length; i++) {
            if (userData[i].Total_Score) {
                markup += '<tr class="user-item" data-attr-index="' + i;
                markup += '" data-attr-user-id="' + userData[i].User_ID + '">';
                markup += '<td>' + (i+1) + '</td>';
                markup += '<td>' + userData[i].User.Callsign + '</td>';
                markup += '<td>' + parseInt(userData[i].Total_Score) + '</td>';
                markup += '</tr>';
            }

        }
        $(markup).appendTo($target).hide().fadeIn(2000,null);
        markup = '';
    }

    function loadUserStatsTable() {

        var $tableTarget = $('#tableData');
        $tableTarget.empty();
        var tableMarkup = generateTableMarkup();
        $(tableMarkup).appendTo($tableTarget).hide().fadeIn(500);
        tableMarkup = '';         
        
    }

    function generateTableMarkup() {
        console.log("generateTableMarkup fired");
     
        var markupBody = '<tbody>';
        markupBody += '<tr >';
        markupBody += '<td colspan="4">';
        markupBody += '<table class="headerTable" style="width:100%"><tr>';
        markupBody += '<td>AVG DISTANCE: </td>';
        //markupBody += '<td>' + userData[currentIndex].Avg_Distance + '</td>';
        markupBody += '<td>MAX SPEED: </td>';
        //markupBody += '<td>' + userData[currentIndex].Max_Speed + '</td>';
        markupBody += '<td>MAX GFORCE: </td>';
        //markupBody += '<td>' + userData[currentIndex].Max_G + '</td>';
        markupBody += '</tr >';

        markupBody += '<tr >';
        markupBody += '<td>' + userData[currentIndex].Avg_Distance + ' ft' + '</td>';
        markupBody += '<td>' + userData[currentIndex].Max_Speed + ' kts' + '</td>';
        markupBody += '<td>' + userData[currentIndex].Max_G + ' G' + '</td>';
        markupBody += '</tr >';
        
        markupBody += '</table >  </td > ';
        markupBody += '</tr>';


        markupBody += '<tr>';
        markupBody += '<td>SPEEDBRAKE ACTIVATIONS: </td>';
        markupBody += '<td>' + userData[currentIndex].Total_Speedbrake + '</td>';
        markupBody += '<td>SPEEDBRAKE TIME: </td>';
        markupBody += '<td>' + $.fn.getMinutesAndSeconds(userData[currentIndex].Time_Speedbrakes) + '</td>';
        markupBody += '</tr>';
        markupBody += '<tr>';
        markupBody += '<td>TIMES IN FRONT OF LEAD: </td>';
        markupBody += '<td>' + userData[currentIndex].Total_Ahead39Line + '</td>';
        markupBody += '<td>TIME SPENT IN FRONT OF LEAD: </td>';
        markupBody += '<td>' + $.fn.getMinutesAndSeconds(userData[currentIndex].Time_39Violations) + '</td>';
        markupBody += '</tr>';
        markupBody += '<tr>';
        markupBody += '<td>AFTERBURNER ACTIVATIONS: </td>';
        markupBody += '<td>' + userData[currentIndex].Total_Afterburner + '</td>';
        markupBody += '<td>TIME IN AFTERBURNER: </td>';
        markupBody += '<td>' + $.fn.getMinutesAndSeconds(userData[currentIndex].Time_Afterburner) + '</td>';
        markupBody += '</tr>';
        markupBody += '<tr>';
        markupBody += '<td>TOTAL COLLISIONS: </td>';
        markupBody += '<td>' + userData[currentIndex].Total_Collision + '</td>';
        markupBody += '<td>TIME SPENT INVERTED: </td>';
        markupBody += '<td>' + $.fn.getMinutesAndSeconds(userData[currentIndex].Time_Inverted) + '</td>';
        markupBody += '</tr>';
        markupBody += '</tbody>';
        return markupBody;
    }

    function setActive(updateTable) {
        console.log("setActive fired");
        //We need to check if the next user and their stats are not null/undefined
        if (userData[currentIndex] && userData[currentIndex].Total_Score) {

            var loadPlotlyGraph = jQuery.Event('loadPlotlyGraph');
            updateTable = updateTable || false;
            var $userItems = $('.user-item');
            var $currentActiveItem = $('.user-item.active');

            //For initial load, adds active class to first item in top user score list
            if ($userItems.length > 0 && $currentActiveItem.length === 0) {
                $($userItems[0]).addClass('active');
            }

            else if ($userItems.length > 0 && $currentActiveItem.length === 1) {
                //every time after pageload
                $currentActiveItem.removeClass('active');
                if (parseInt($currentActiveItem.attr('data-attr-index')) === $userItems.length - 1) {
                    currentIndex = 0;
                    loadPlotlyGraph.currentUserIndex = currentIndex;
                    //$($userItems[currentIndex]).addClass('active');
                    return main();
                }
                else {
                    currentIndex = parseInt($currentActiveItem.attr('data-attr-index')) + 1;
                    $($userItems[currentIndex]).addClass('active');
                }
            }

            loadUserStatsTable();

            //event payload available in plotlyGraph.js
            loadPlotlyGraph.usePlotlyCache = usePlotlyCache;
            loadPlotlyGraph.currentUserIndex = currentIndex;
            loadPlotlyGraph.formEventId = globalEventId; //TODO : figureout what this actually needs to be 
            loadPlotlyGraph.containerDiv = 'graphArea';
            loadPlotlyGraph.userData = userData;
            loadPlotlyGraph.averageUserData = averageUserData;
            $(window).trigger(loadPlotlyGraph);

        }
    }

    function loadEvents(data) {
        
        let eventDropdown = $("#popupEventDropdown");
        eventDropdown.empty();
        var eventList = "";
        eventList += "<option class='event' value='-1' >" + "Choose" + "</option>";
        for (const record of data) {
            // eventList += "<option class='event' value='" + record.Event_ID + "' label='" + record.Event_Name.replace("'", "") + "'> <p class='smallTitle'> stats</p></option>";
            eventList += "<option class='event' value='" + record.FormEvent_ID + "' >" + record.FormEvent_Name.replace("'", "") + "</option>";
        }
        $(eventList).appendTo('#popupEventDropdown');
    }

    window.selectEvent = function selectEvent() {
        var selectDropdown = document.getElementById("popupEventDropdown");
        globalEventId = selectDropdown.options[selectDropdown.selectedIndex].value;

        console.log("Event selected was " + globalEventId);
        $('.eventPopup').hide();
        rebuildTablesAndGraph();
        
    };

    $(".triggerEventPopup").click(function () {
        getEventListing();
        $('.eventPopup').show();
     });

     $('.popupCloseButton').click(function(){
         $('.eventPopup').hide();
     });

    // $('.datepicker').pickadate({
    //    onSet:function(context) {
    //        var $input = $('.datepicker').pickadate();
    //        var picker = $input.pickadate('picker');
    //         console.log('Just set stuff:', context);
    //         let a = picker.get('value');
    //         console.log(a);
    //         getEventListing();
    //    }
            
    //});

    

    //on this event, start the playback
    $(window).on('plotlyRenderComplete', function (e) {
        console.log("plotlyRenderComplete fired");
        plotlyTotalAnimationFrames = e.animationFrames - 1;
        plotlyCountAnimationFrames = 0;
    });

    //when the graph playback completes, select next user and replay
    $(window).on('plotly_sliderchange', function (e) {
        console.log("plotly_sliderchange fired");
        plotlyCountAnimationFrames++;
        if(plotlyTotalAnimationFrames === plotlyCountAnimationFrames){          
            setTimeout(function () {
                //change the active user on the scoreboard - change data on the table
                setActive(true);
            }, MILLISECONDS_BETWEEN_PLAYS);
             
        }
    });

    console.log("outside of all functions fired");
    main();
});