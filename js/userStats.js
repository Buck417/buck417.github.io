window.addEventListener('load', function () {
    var globalEventId = 1;
    var globalUserId = -1;
    var globalUserData = [];
    var averageUserData = [];
    var globalCurrentIndex = 0;

    function main() {
        globalEventId = localStorage.getItem("eventId");
        globalUserId = localStorage.getItem("userId");
        $("#userStatsLabel").text(localStorage.getItem("userCallsign"));
        $.when(getUserAttemptsByEventIdAndUserId(globalEventId, globalUserId), getAverageFormAttemptByFormEvent(globalEventId)).done(() => {
            removeEmptyAttempts();
            constructUserPage();
        });

    }

    function constructUserPage()
    {
        clearTable();
        loadUserStatsTable();
        loadUserGraph();
        buildAttemptNavigationButtons(globalUserData.length);
    }

    function removeEmptyAttempts()
    {
        globalUserData = globalUserData.filter((attempt) => {
            return attempt.SimpleFormScores.length > 0;
        });

    }

    function getUserAttemptsByEventIdAndUserId(eventId, userId)
    {
        console.log("getUserAttemptsByEventIdAndUserId fired");
        return $.ajax({
            url: $.Api.getAttemptsByEventAndUser(eventId, userId), //TODO: the formEventId is hardcoded to 1 - WILL NEED to be changed based on the event selected
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                globalUserData = data;
            },
            error: function (request, error) {
                console.error("unable to retrieve last user attempts");
            }
        });
    }


    function getAverageFormAttemptByFormEvent(eventId) {
        console.log("getDateOfLastUpdate fired");
        return $.ajax({
            url: $.Api.getAverageFormAttemptByFormEvent(eventId),
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                averageUserData = data;
            },
            error: function (request, error) {
                console.error("unable to retrieve average scores for event data");
            }
        });
    }

    function loadUserGraph()
    {
        Plotly.purge('graphArea');
        //check here if we have an attempt with valid data
        if(globalUserData[globalCurrentIndex].SimpleFormScores.length > 0)
        {
            let conDiv = 'graphArea';
            setGraphData(globalUserData, averageUserData, conDiv, globalCurrentIndex);
        }
        else {
            console.log("no data found for this attempt");
        }

    }

    function loadUserStatsTable() {
        currentIndex = 0;
        var $tableTarget = $('#tableData');
        $tableTarget.empty();
        var tableMarkup = generateTableMarkup();
        $(tableMarkup).appendTo($tableTarget).hide().fadeIn(500);
        tableMarkup = '';
        $('#attemptScore').text(parseInt(globalUserData[globalCurrentIndex].Total_Score));
    }

    function generateTableMarkup() {
        console.log("generateTableMarkup fired");

        var markupBody = '<tbody>';
        markupBody += '<tr >';
        markupBody += '<td colspan="4">';
        markupBody += '<table class="headerTable" style="width:100%"><tr>';
        markupBody += '<td>AVG DISTANCE: </td>';

        //markupBody += '<td>' + 'NULL' + '</td>';
        markupBody += '<td>MAX SPEED: </td>';
        //markupBody += '<td>' + 'NULL' + '</td>';
        markupBody += '<td>MAX GFORCE: </td>';
        //markupBody += '<td>' + 'NULL' + '</td>';
        markupBody += '</tr >';

        markupBody += '<tr >';
        markupBody += '<td>' + globalUserData[currentIndex].Avg_Distance + ' ft' + '</td>';
        markupBody += '<td>' + globalUserData[currentIndex].Max_Speed + ' kts' + '</td>';
        markupBody += '<td>' + globalUserData[currentIndex].Max_G + ' G' + '</td>';
        markupBody += '</tr >';


        markupBody += '</tr ></table >  </td > ';
        markupBody += '</tr>';
        markupBody += '<tr>';
        markupBody += '<td>SPEEDBRAKE ACTIVATIONS: </td>';
        markupBody += '<td>' + globalUserData[globalCurrentIndex].Total_Speedbrake + '</td>';
        markupBody += '<td>SPEEDBRAKE TIME: </td>';
        markupBody += '<td>' + $.fn.getMinutesAndSeconds(globalUserData[globalCurrentIndex].Time_Speedbrakes) + '</td>';
        markupBody += '</tr>';
        markupBody += '<tr>';
        markupBody += '<td>TIMES IN FRONT OF LEAD: </td>';
        markupBody += '<td>' + globalUserData[globalCurrentIndex].Total_Ahead39Line + '</td>';
        markupBody += '<td>TIME SPENT IN FRONT OF LEAD: </td>';
        markupBody += '<td>' + $.fn.getMinutesAndSeconds(globalUserData[globalCurrentIndex].Time_39Violations) + '</td>';
        markupBody += '</tr>';
        markupBody += '<tr>';
        markupBody += '<td>AFTERBURNER ACTIVATIONS: </td>';
        markupBody += '<td>' + globalUserData[globalCurrentIndex].Total_Afterburner + '</td>';
        markupBody += '<td>TIME IN AFTERBURNER: </td>';
        markupBody += '<td>' + $.fn.getMinutesAndSeconds(globalUserData[globalCurrentIndex].Time_Afterburner) + '</td>';
        markupBody += '</tr>';
        markupBody += '<tr>';
        markupBody += '<td>TOTAL COLLISIONS: </td>';
        markupBody += '<td>' + globalUserData[globalCurrentIndex].Total_Collision + '</td>';
        markupBody += '<td>TIME SPENT INVERTED: </td>';
        markupBody += '<td>' + $.fn.getMinutesAndSeconds(globalUserData[globalCurrentIndex].Time_Inverted) + '</td>';
        markupBody += '</tr>';
        markupBody += '</tbody>';
        return markupBody;
    }

    function clearTable() {
        var $userStatsTable = $('#tableData');
        var fadeoutTime = 0; //on page load we dont want the unnecessary wait, only for after pageload we want to wait
        $userStatsTable.fadeOut(fadeoutTime, function () {
            $userStatsTable.empty();
            $userStatsTable.show();

        });
    }

    window.clickAttemptNavigation = function clickAttemptNavigation(navEvent) {
        let totalAttempts = globalUserData.length;
        switch (navEvent) {
            case "first":
                globalCurrentIndex = 0;
                break;
            case "previous":
                globalCurrentIndex--;
                break;
            case "next":
                globalCurrentIndex++;
                break;
            case "last":
                globalCurrentIndex = totalAttempts-1;
                break;

        }

        document.getElementById("buttonNavigation").style.display = "flex";
        buildAttemptNavigationButtons(totalAttempts);
        
        constructUserPage();
    };

    function buildAttemptNavigationButtons(totalAttempts) {
        if (globalCurrentIndex === 0) {
            if (totalAttempts === 1) {
                document.getElementById("prevAttempt").style.visibility = "hidden";
                document.getElementById("firstAttempt").style.visibility = "hidden";
                document.getElementById("nextAttempt").style.visibility = "hidden";
                document.getElementById("lastAttempt").style.visibility = "hidden";
            }
            else {
                document.getElementById("prevAttempt").style.visibility = "hidden";
                document.getElementById("firstAttempt").style.visibility = "hidden";
                document.getElementById("nextAttempt").style.visibility = "visible";
                document.getElementById("lastAttempt").style.visibility = "visible";
            }

        } else if (globalCurrentIndex < (totalAttempts - 1)) {
            //if attemptScoreLocation is in the middle (say its the 2nd record of 5 total records)
            document.getElementById("prevAttempt").style.visibility = "visible";
            document.getElementById("firstAttempt").style.visibility = "visible";
            document.getElementById("nextAttempt").style.visibility = "visible";
            document.getElementById("lastAttempt").style.visibility = "visible";
        } else if (globalCurrentIndex === (totalAttempts - 1)) {
            console.log("made it to the end of the list");
            //if attemptScoreLocation is the last record
            document.getElementById("prevAttempt").style.visibility = "visible";
            document.getElementById("firstAttempt").style.visibility = "visible";
            document.getElementById("nextAttempt").style.visibility = "hidden";
            document.getElementById("lastAttempt").style.visibility = "hidden";
        }

    }

    console.log("outside of all functions fired");
    main();



});
