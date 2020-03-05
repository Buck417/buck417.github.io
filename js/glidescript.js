document.addEventListener('glideLoad', function (e) {

    function coverflow(i, el) {
        el.removeClass('pre following')
            .nextAll()
            .removeClass('pre following')
            .addClass('following')
            .end()
            .prevAll()
            .removeClass('pre following')
            .addClass('pre');
    }

    $('#Glide').glide({
        type: 'slider',
        startAt: 1,
        perView: 5,
        animationDuration: 100,
        width: 1,
        slideWidth: 1,
        wrapperWidth: 1,
       
        paddings: '1%',
        afterInit: function (event) {
            coverflow(event.index, event.current);
        },
        afterTransition: function (event) {
            coverflow(event.index, event.current);
        }
    });
}, false);

var slideWidth = function (Glide, Components, Events) {
    return {
        mount() {
            // Here you can access `Sizes` module
            console.log(Components.Sizes)
        }
    }
}

new Glide('.glide').mount({
    'slideWidth': 50
})

