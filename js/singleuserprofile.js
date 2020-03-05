window.addEventListener('load', function () {

    /* NOTE: this is the correct API but the service is broken, need to get it fixed
    function getUserData(userId) {
        $.ajax({
            url: 'http://52.222.21.67:8888/Api/User/' + userId,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                createMarkup(data);
            },
            error: function (request, error) {
                console.error("unable to retrieve all the users");
            }
        });
    } 
    */


    //NOTE: this function is TEMPORARY until the correct service is fixed service
    // when the service is fixed, use the function above this one and delete this one
    // it is placeholder for now
    function getUserData(userId) {
        $.ajax({
            url: 'http://52.222.21.67:8888/Api/GetAllUsers',
            type: 'GET',
            dataType: 'json',
            success: function (userData) {
                //manually edit the data - this should not be needed in the final version
                for (var i = 0; i < userData.length; i++) {
                    if (userData[i].User_ID === userId) {
                        console.log(userData[i]);
                        createMarkup(userData[i]);
                        i = userData.length + 1;
                    } else {
                        continue;
                    }

                }

            },
            error: function (request, error) {
                console.error("unable to retrieve all the users");
            }
        });
    }


    function loadDefaultNoUserMarkup() {

    }


    //TODO: accessing values in userData object will need to be modified 
    //  when the service where the data comes from is fixed
    function createMarkup(userData) {
        var htmlMarkup = '</div class="user-data-container">';
        htmlMarkup += '<div class="userContainer"><div class="userImage">pic</div><div class="userName"><h1>' + userData.Callsign + '</h1></div>';
        htmlMarkup += '</div>';
     
        if (userData.Attempts && userData.Attempts.length > 0) {
            htmlMarkup += '<div id="attemptsContainer" class="eventContainer">';
            htmlMarkup += '<h1>Attempts</h1>'

            for (var i = 0; i < userData.Attempts.length; i++) {
                htmlMarkup += '<div class="attemptContainer">' ;
                htmlMarkup += '<div class="event-name">Event Name: ' + userData.Attempts[i].Event.Event_Name + '</div>';
                htmlMarkup += '<div class="event-tgt">Time On Target: ' + userData.Attempts[i].TimeOnTarget + '</div>';
                htmlMarkup += '</div>';
            }

            htmlMarkup += '</div>';
        } else {
            htmlMarkup += '<div class=attemptsData>No Attempts Made</div>';
        }
        htmlMarkup += '</div>';
        loadMarkupOnPage(htmlMarkup);
    }


    function getUserIdQueryParam() {
        if (window.location.href.indexOf('?') > -1) {
            getUserData(parseInt(window.location.search.split('=')[1]));
        } else {
            loadDefaultNoUserMarkup();
        }
        
    }

    function loadMarkupOnPage(htmlMarkup) {
        $(htmlMarkup).appendTo('div#userDataLoadTarget');
    }

    getUserIdQueryParam();
});