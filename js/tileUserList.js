window.addEventListener('load', function () {
    $('div#upArrow').css('display', 'none');
    var topsOfRows = [];
    var $allTiles; 

    /**
     *      TILE RELATED FUNCTIONS
     * */

    function startLoadingUsers() {
        $.ajax({
            url: $.Api.getAllUsers(),
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                createTiles(data);
            },
            error: function (request, error) {
                console.error("unable to retrieve all the users");
            }
        });
    }


    function createTiles(userData) {
        var imageTilesToPreload = 20; //hardcoded to preload the first 20 user images, all after will be lazy loaded as the tiles become visible
        var htmlMarkup = '';

        for (var i = 0; i < userData.length; i++) {
            // -- User Tile --//
            htmlMarkup += '<div id="userTile" title="Click to view user profile" ';

            if (i === 0) {
                htmlMarkup += 'class="first-tile" ';
            } else if (i === userData.length - 1) {
                htmlMarkup += 'class="last-tile" ';
            }

            htmlMarkup += 'data-attr-userid="' + userData[i].User_ID + '" ';

            //TODO: to test this will need the PTN guys to set some image URLS for testing
            if (userData[i].Image && userData[i].Image.Image) {
                if (i < imageTilesToPreload) {
                    htmlMarkup += 'style="background-image: url(\'' + userData[i].UserImage + '\')"';
                } else {
                    htmlMarkup += 'data-attr-background="' + userData[i].UserImage + '"';
                }
            } else {
                //use default image if there is no image set use the default
                //htmlMarkup += 'style="background-image: url(\'/images/refresh.png\')"';
                htmlMarkup += 'class=""';
                //TODO: change this later to what the default icon should be
            }

            htmlMarkup += '>';


            htmlMarkup += '<div class="icon">';
            htmlMarkup += '<div class="userIcon">';

           
            htmlMarkup += '</div>';
            htmlMarkup += '</div>';
            htmlMarkup += '<div class="userCallsign">' + userData[i].Callsign + '</div>';
            htmlMarkup += '</div>';
        }

        $(htmlMarkup).appendTo('#tileTarget');
        $allTiles = $('div#userTile');
        getRowTopLocations();
        attachClickListener();
        arrowClickHandle();
    }

    //lazy load - make it so images only load when there is a scroll event
    // dont want to load all the images on page load, but only as the user scrolls or resizes
    $(window).on('resize scroll', function () {
        var $tiles = $('div#userTile');
        $tiles.each(function () {
            var $tile = $(this);
            if ($tile.isInViewport() && $tile.css('background-image') === 'none' && $tile.attr('data-attr-background') !== undefined) {
                var tileImagePath = $tile.attr('data-attr-background');
                $tile.css('background-image', 'url("' + tileImagePath + '")');
            }

            handleScrollArrowDisplay();
        });
    });

    $(window).on('debound resize', function () {
        getRowTopLocations();
    });
    /*
     * SCROLL ARROW FUNCTIONS
     * */
    function handleScrollArrowDisplay() {
        var $upIndicator = $('.first-tile');
        var $downIndicator = $('.last-tile');
        var $upArr = $('div#upArrow');
        var $downArr = $('div#downArrow');


        if ($upIndicator.isInViewport()) {
            //if the up indicator is in viewport, hide the up arrow - we are at the top
            $upArr.css('display', 'none');
        } else {
            $upArr.css('display', 'block');
        }

        if ($downIndicator.isInViewport()) {
            //if the down indicator is in viewport, hide the Down arrow - we are at the bottom
            $downArr.css('display', 'none');
        } else {
            $downArr.css('display', 'block');
        }
    }

    //this is the Y coordinates for each row on display
    function getRowTopLocations() {
        var previousTop = 0;
        $('div#userTile').each(function () {
            var topVal = $(this).offset().top;
            if (topVal !== previousTop && !topsOfRows.includes(topVal)) {
                topsOfRows.push(topVal)
            }
        });
    }

    //where to scroll when the arrow is clicked
    function getWhereToScroll() {
        var firstTop = 0;
        var lastTop = 0;
        var foundFirstVisibleTile = false;
        var elHeight = 0;
        $allTiles.each(function () {
            var $el = $(this);
            if ($el.isInViewport()) {
                if (!foundFirstVisibleTile) {
                    firstTop = $el.offset().top;
                    foundFirstVisibleTile = true;
                }
                elHeight = $el.height();
                lastTop = $el.offset().top;
            }
        });

        var howManyRowsAreVisble = topsOfRows.indexOf(lastTop) - topsOfRows.indexOf(firstTop);
        var scrollUpToRowIndex = topsOfRows.indexOf(firstTop) - howManyRowsAreVisble;

        if (scrollUpToRowIndex < 0) {
            scrollUpToRowIndex = 0
        }

        return { first: topsOfRows[scrollUpToRowIndex], last: lastTop + elHeight };
    }

    function arrowClickHandle() {
        $('div#upArrow').on('click', function (e) {
            $("html, body").animate({
                scrollTop: getWhereToScroll().first
            }, 250);
            return false;
        });


        $('div#downArrow').on('click', function (e) {
            $("html, body").animate({
                scrollTop: getWhereToScroll().last
            }, 250);
            return false;
        });
    }


    function attachClickListener() {
        $('div#userTile').each(function (index, tile) {
            $(tile).on('click', function () {
                var userId = $(this).attr('data-attr-userid');
                window.location.href = '/userprofile.html?userId=' + userId;
            })
        });
    }

    startLoadingUsers();
});