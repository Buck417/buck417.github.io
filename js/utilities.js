/*
 * IMPORTANT - in the HTML files, the import of utilities.js MUST happen AFTER loading jquery.min
 *      and BEFORE loading any other files with that pages Javascript that we write
 */

window.addEventListener('load', function () {

    //Should load and be available as a function to any Javascript Element
    // myObject.isInViewport();
    $.fn.isInViewport = function () {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();

        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    // configuration
    $.Config = $.Config || {};
    $.Config.timeInterval = function() {
        return 5000; //TODO: change this to the actual timeout later
    }

    /** SERVICES CONFIGURATION **/
    var serverUrl = 'http://52.222.21.67';
    var port = '8888';
    var otherPort = '8881';
    var path = 'Api';
    $.Api = $.Api || {};

    //generic api calls
    $.Api.getAllEvents =  function() {
        return serverUrl + ':' + port + '/' + path + '/GetAllEvents';
    }

    $.Api.getAttemptsByEventUser = function() {
        return serverUrl + ':' + port + '/' + path + '/GetAttemptsByEventUser';
    }

    $.Api.getScore = function() {
        return serverUrl + ':' + port + '/' + path + '/Score';
    }

    $.Api.getUser = function() {
        return serverUrl + ':' + port + '/' + path + '/User';
    }

    $.Api.getAllUsers = function() {
        return serverUrl + ':' + port + '/' + path + '/GetAllUsers';
    }

    $.Api.getEventById = function() {
         return serverUrl + ':' + port + '/' + path + '/GetEventById';
    }

    /**
     * @param FormEventID event id 
     */
    $.Api.getAttemptsDate = function(eventId){
        return serverUrl + ':' + otherPort + '/' + path + '/GetLastFormAttemptDateTimeByFormEvent?FormEventID=' + eventId;
    }

    $.Api.getAttemptsByEvent = function(){
        return serverUrl + ':' + otherPort + '/' + path + '/GetFormAttemptsByFormEvent'; 
    }

    $.Api.getAttemptsByUser = function(){
        return serverUrl + ':' + otherPort + '/' + path + '/GetFormAttemptsByUser'; 
    }

    $.Api.getAttemptsByEventAndUser = function(){
        return serverUrl + ':' + otherPort + '/' + path + '/GetFormAttemptsByFormEventUser'; 
    }

    //for testing only
    $.Api.getThreeEvents = function() {
        return serverUrl + ':' + otherPort + '/' + path + '/GetThreeEvents';
    }

    //for testing only
    $.Api.getThreeAttempts = function () {
        return serverUrl + ':' + otherPort + '/' + path + '/GetThreeAttempts';
    }    
});