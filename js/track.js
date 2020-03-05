$(function () {
    var userName = window.location.href.split('?user=')[1];

    function getUserData() {
        $.ajax({
            url: "/userData?user=" + userName,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                loadResults(data);
            },
            error: function (request, error) {
                console.error("Could not Retrieve Leaderboard scores");
            }
        });
    }

    function loadResults(data) {
        //something something
    }

    $(window).bind("load", function () {
        //getUserData();
    });
});