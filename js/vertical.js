window.addEventListener('load', function () {
    var eventSlidesToShow = 7; //how many slides to show on carousel

    
    function getAllEvents() {
        $.ajax({
            url: $.Api.getAllEvents(),
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                loadEventsIntoSlider(dataCheck(data));
            },
            error: function (request, error) {
                console.error("unable to retrieve all the events");
            }
        });
    }

    function loadEventsIntoSlider(eventsData) {
        var eventCards = '';
        for (var i = 0; i < eventsData.length; i++) {
            eventCards += '<div class="event-card" data-attr-index="' + i + '" data-attr-eventid="' + eventsData[i].Event_ID + '">';
            eventCards += '<div class="event-image"/>'
            eventCards += '<div class="event-name">' + eventsData[i].Event_Name + '</div>';
            eventCards += '</div>';
        }

        $(eventCards).appendTo('div.slick-carousel');
        loadCarousel();
    }

    /**
     * For the carousel scrolling to work properly it needs to have at least this many elements: (displayed event in carousel) + 1
     * 
     * The fix is this: 
     *  when we are data.length == eventSlidesToShow, we just concat a copy of data to make it seem to the carousel like we have more
     *  so it scrolls properly
     *  
     *  when we have data.length < eventSlidesToShow we still double the number of elements, but also change the number of eventSlidesToShow
     *  so we display the lesser number of slides, we dont want to display copies of the same slides, we want the copies to be in the background
     * 
     */
    function dataCheck(data) {
        if (data.length < eventSlidesToShow) {
            eventSlidesToShow = data.length;
        }

        if (data.length <= eventSlidesToShow) {
            data = data.concat(data);
        }
        return data;
    }

    //https://kenwheeler.github.io/slick/
    function loadCarousel() {
        $('.slick-carousel').slick({
            infinite: true,
            vertical: true,
            verticalSwiping: false,
            slidesToShow: eventSlidesToShow,
            slidesToScroll: 1,
            respondTo: 'window',
            mobileFirst: true,
            speed: 300,
            accessibility: true,
            prevArrow: $('.top-arrow'),
            nextArrow: $('.bottom-arrow')
        });

        // scroll wheel implementation
        $('.slick-carousel').on('wheel', (function (e) {
            e.preventDefault();

            if (e.originalEvent.deltaY < 0) {
                $(this).slick('slickNext');
            } else {
                $(this).slick('slickPrev');
            }
        }));

        //keyboard arrow implementation
        $(window).on('keydown', function (e) {
            switch (e.keyCode) {
                case 38:
                    //up
                    $('.top-arrow').click();
                    break;
                case 40:
                    //down
                    $('.bottom-arrow').click();
                    break;
            }
        });

        //on click on a event card
        $('.event-image, .event-name').on('click', function () {
            var clickedIndex = $(this).parent().attr('data-slick-index');
            var slideSpot;
            $('.slick-active').each(function (i, e) {
                if ($(e).attr('data-slick-index') === clickedIndex) {
                    slideSpot = i;
                }
            });

            if (slideSpot < 2) { //go to previous
                $('.slick-carousel').slick('slickPrev');
                if (slideSpot === 0) {
                    setTimeout(function () {
                        $('.slick-carousel').slick('slickPrev')
                    }, 300);
                }
            } else if (slideSpot > 2) { //go to next
                $('.slick-carousel').slick('slickNext');
                if (slideSpot == 4) {
                    setTimeout(function () {
                        $('.slick-carousel').slick('slickNext')
                    }, 300);
                }
            }
        });
    }


    function loadEventDetails(eventId) {
        
        $.ajax({
            url: $.Api.getEventById(eventId),
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                var eventMarkup = '<div class="event-detail-name">' + data.Event_Name + '</div>';
                eventMarkup += '<div class="event-detail-scenario">' + data.Scenario.Scenario_Name + '</div>';
                eventMarkup += '<div class="event-detail-attempts">Number of Attempts: ' + data.Attempts.length + '</div>';

                $(eventMarkup).appendTo('div.event-data-target');
            },
            error: function (request, error) {
                console.error("unable to retrieve all the events");
            }
        });
    }

    /*
    * by default the slick-current class always goes to the top slide - we want it on the middle slide
    * remove the slick current from wherever it may be and then resign it
    */

    $('.slick-carousel').on('init afterChange', function () {
        var activeSpotOnCarousel = 3;
        $('.event-data-target').empty();
        $($('.slick-active')[activeSpotOnCarousel]).addClass('my-active-slide');
        loadEventDetails($('.my-active-slide').attr('data-attr-eventid'));
    });

    $('.slick-carousel').on('beforeChange', function () {
        $('.slick-active').removeClass('my-active-slide');
    });

    $('.top-arrow, .bottom-arrow').on('click', function () {
        $('.slick-active').removeClass('my-active-slide');
    });

    getAllEvents();

});
