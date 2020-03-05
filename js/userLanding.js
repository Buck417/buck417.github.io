
window.addEventListener('load', function () {
        
    var attempts = [];
    var globalPortId = 45458;
    var currentAttempt = 0;
    var attemptScoreLocation = 0;
    let eventsList = [];
    let userList = [];
    let selectedAttempt = [];
    let averageUserData = [];
    let globalUserId = -1;
    let globalEventId = -1;

    //$('.datepicker').pickadate({

    //    onSet:function(context) {
    //        $("#userLandingUserInput").css("display", "none");
    //        var $input = $('.datepicker').pickadate();
    //        var picker = $input.pickadate('picker');
    //         console.log('Just set stuff:', context);
    //         let a = picker.get('value');
    //         console.log(a);
    //         loadEvents();
    //    }
            
    //});

    function getEventListing() {
        $.ajax({
            url: $.Api.getAllFormEvents(),
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                eventsList = data;
                loadEvents(data);
            },
            error: function (request, error) {
                console.error("Could not Retrieve events");
            }
        });
    };

    function getUsersByEvent(eventId) {
        console.log("getUserAttemptData fired");
        $.ajax({
            //http://52.222.21.67:8881/api/GetSimpleFormAttemptsByFormEventUser?FormEventID=1&UserID=1
            url: $.Api.getFormAttemptsByEvent(eventId), //TODO: the formEventId is hardcoded to 1 - WILL NEED to be changed based on the event selected
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                //userList = getUsersFromFormAttempts(data);
                loadUsers(data);
            },
            error: function (request, error) {
                console.error("unable to retrieve top user attempts");
            }
        });
    }

    function filterEventsByDate(date)
    {
        loadEvents(data);
    }

    function loadEvents() {
        $("#userLandingEventDropdown").css("display", "block");
        let eventDropdown = $("#userLandingEventDropdown");
        eventDropdown.empty();
        var eventList = "";
        eventList += "<option class='event' value='-1' >" + "Choose" + "</option>";
        for (const record of eventsList) {
            // eventList += "<option class='event' value='" + record.Event_ID + "' label='" + record.Event_Name.replace("'", "") + "'> <p class='smallTitle'> stats</p></option>";
            eventList += "<option class='event' value='" + record.FormEvent_ID + "' >" + record.FormEvent_Name.replace("'", "") + "</option>";
        }
        $(eventList).appendTo('#userLandingEventDropdown');
    }

    window.selectEvent = function selectEvent() {

        var selectDropdown = document.getElementById("userLandingEventDropdown");
        globalEventId = selectDropdown.options[selectDropdown.selectedIndex].value;

        console.log("Event selected was " + globalEventId);
        if (globalEventId == -1) {
            $("#userLandingUserInput").hide();
        }
        else {
            //if (selectDropdown.options[0].value == -1) {
            //    selectDropdown.remove(0);
            //}    
            getUsersByEvent(globalEventId);
        }
    };

    function getUsersFromFormAttempts(attemptData) {
        return userList = [...new Set(attemptData.map(attempt => attempt.User.Callsign))];
    }

    function loadUsers(data)
    {
        $("#userLandingUserInput").css("display", "block");
        let userDropdown = $("#userLandingUserInput");
        userDropdown.empty();

        var flags = {};
        var distinctUsers = [];
        for (var i = 0; i < data.length; i++)
        {
            if (!flags[data[i].User.Callsign])
            {
                flags[data[i].User.Callsign] = true;
                distinctUsers.push({ id: data[i].User.User_ID, data: data[i], label: data[i].User.Callsign});
            }
        }

        //NEED TO TEST IF KEYBOARD SHOWS UP ON MOBILE
        $('#userLandingUserInput').autocomplete({
                source: distinctUsers,
                autoFocus: true,
                select: function( event , ui ) {
                    globalUserId = ui.item.id;
                    localStorage.setItem("userCallsign", ui.item.label);
                    console.log("User id selected is: ", globalUserId);
                    $("#userLandingSubmit").show();
                },
                response: function( event, ui) {

                    $("#userLandingSubmit").hide();
                }
        });
    }

    window.navigateToUserStats = function navigateToUserStats() {
        console.log("navigation fired");
        localStorage.setItem("userId", globalUserId);
        localStorage.setItem("eventId", globalEventId);
        window.location.href = "userStats.html";
    }

    // window.selectUser = function selectUser() {

    //     var selectDropdown = document.getElementById("userLandingUserInput");
    //     globalUserId = selectDropdown.options[selectDropdown.selectedIndex].value;

    //     console.log("User selected was " + globalUserId);
    //     const userIndex = (element) => element.User_ID == globalUserId;
    //     if (globalUserId == -1) {
    //         $("#userLandingUserInput").hide();
    //     }
    //     else {
    //         if (selectDropdown.options[0].value == -1) {
    //             selectDropdown.remove(0);
    //         }    
            
    //     }
    //     selectedUser = globalUserId
        
    // };

    getEventListing();

    var $htmlOrBody = $('html, body'), // scrollTop works on <body> for some browsers, <html> for others
        scrollTopPadding = 8;

    $('userLandingUserInput').focus(function () {
        console.log("this stuff fired");
        // get textarea's offset top position
        var textareaTop = $(this).offset().top;
        // scroll to the textarea
        $htmlOrBody.scrollTop(textareaTop - scrollTopPadding);
    });
    
    $(document).ready(() => {
        document.getElementById("userLandingUserInput").value = "";
    }) 

});


