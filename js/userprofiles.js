start = function () {
    function getAllUsers() {
        $.ajax({
            url: 'http://52.222.21.67:8888/Api/GetAllUsers',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                loadUsersIntoSlider(data);
            },
            error: function (request, error) {
                console.error("unable to retrieve all the users");
            }
        });
    }

    function loadUsersIntoSlider(userData) {
        var usersAlreadyProcessed = [];
        for (var i = 0; i < userData.length; i++) {
            console.log(userData[i]);
            if (!usersAlreadyProcessed.includes(userData[i].User_ID)) {
                usersAlreadyProcessed.push(userData[i].User_ID);
                var slideHtml = '<li class="glide__slide">';
                slideHtml += '<div class="box" style="border: 1px solid red; background-color: ##COLOR##;">##TEXT##</div>';
                slideHtml += '</li>';

                slideHtml = slideHtml.replace('##COLOR##', '#c3c3c' + i);
                slideHtml = slideHtml.replace('##TEXT##', slideData(userData[i]));
                $(slideHtml).appendTo('ul.glide__track');
            } else {
                continue;
            }
            
        }
        

        var event = new Event('glideLoad');
        document.dispatchEvent(event);
        attachUserClickLink();
    }

    function slideData(user) {
        console.log(user, 'user');
        var markup = '<div id="userStatsContainer" data-attr-id="' + user.User_ID + '">';
        markup += '<div class="userImage"><img src="../images/player-silhouette.png"/></div>';
        markup += '<div class="userName">' + user.Callsign + '</div>';
        markup += '</div>';
        return markup;
    }

    function attachUserClickLink() {
        $('div#userStatsContainer').parent().each(function () {
            $(this).on('click', function () {
                var userId = $(this).find('#userStatsContainer').attr('data-attr-id');
                window.location.href = 'userprofile.html?userId=' + userId;
            });
        });
    }

    //start
    getAllUsers();
}

$(window).bind("load", function () {
    start();
});