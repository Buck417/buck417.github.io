/*
 * IMPORTANT  
 *      In the HTML page file, the import of config.js MUST happen immediately AFTER loading jquery.min
 *      and BEFORE loading any other javascript files that we write
 */

$(function() {
    /**
     *  will load and be available as a function to any Javascript Element
     *  example: $myObject.isInViewport();
     *  checks to see if the element is in the visible window.
     */
    $.fn.isInViewport = function () {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();

        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    $.fn.getMinutesAndSeconds = function (dateString) {
        var removedMillis = dateString.split('.')[0];
        var minutes = removedMillis.split(':')[1];
        var seconds = removedMillis.split(':')[2];
        return minutes + ":" + seconds;
    }

    //make the graph a global object that can be accessed anywhere
    $.Plotly = $.Plotly || {};

    /** SERVICES CONFIGURATION **/
    var serverUrl = 'http://52.222.21.67';
    var port = '8888';
    var otherPort = '8881';
    var path = 'Api';
    $.Api = $.Api || {};

    /** use to backup the user request for later use - can be accessed from more than 1 js file since the cache lives in the jQuery namespace*/
    var requestCache = [];
    $.Api.getRequestCache = function(){
        return requestCache;
    }

    $.Api.setRequestCache = function(data){
        requestCache = data;
    }

    //jquery space cache, pass in a key and whatever data you want to cache for the session
    //then use the getCache to get it, usefull when accessing info on separate files
    var genericCache = {};
    $.Api.setCache = function(key, data){
        genericCache[key] = null;
        genericCache[key] = data;
    }

    $.Api.getCache = function(key){
        return genericCache[key];
    }

    //generic api calls
    $.Api.getAllEvents =  function() {
        return serverUrl + ':' + port + '/' + path + '/GetAllEvents';
    }

    $.Api.getAllEventsOtherPort =  function() {
        return serverUrl + ':' + otherPort + '/' + path + '/GetAllFormEvents';
    }

    $.Api.getAttemptsByEventUser = function(eventId, userId) {
        return serverUrl + ':' + port + '/' + path + '/GetAttemptsByEventUser?EventID=' + eventId + '&UserID=' + userId;
    }

    $.Api.getScore = function(eventId) {
        return serverUrl + ':' + port + '/' + path + '/Score?eventID=' + eventId;
    }

    $.Api.getUser = function(userId) {
        return serverUrl + ':' + port + '/' + path + '/User/' + userId;
    }

    $.Api.getAllUsers = function() {
        return serverUrl + ':' + port + '/' + path + '/GetAllUsers';
    }

    $.Api.getEventById = function(eventId) {
         return serverUrl + ':' + port + '/' + path + '/GetEventById?eventID=' + eventId;
    }

    /**
     * @param FormEventID event id 
     */
    $.Api.getRecentAttemptsDate = function(eventId){
        return serverUrl + ':' + otherPort + '/' + path + '/GetLastRecentFormAttemptDateTimeByFormEvent?FormEventID=' + eventId;
    }

    $.Api.getTopAttemptsDate = function (eventId) {
        return serverUrl + ':' + otherPort + '/' + path + '/GetLastTopFormAttemptDateTimeByFormEvent?FormEventID=' + eventId;
    }

    $.Api.getAttemptsByEvent = function(){
        return serverUrl + ':' + otherPort + '/' + path + '/GetFormAttemptsByFormEvent'; 
    }

    $.Api.getAttemptsByUser = function(){
        return serverUrl + ':' + otherPort + '/' + path + '/GetFormAttemptsByUser'; 
    }

    $.Api.getAttemptsByEventAndUser = function(eventId, userId){
        return serverUrl + ':' + otherPort + '/' + path + '/GetSimpleFormAttemptsByFormEventUser?FormEventID=' + eventId + '&UserID=' + userId; 
    }

    $.Api.getFormAttemptsByEvent = function (eventId) {
        return serverUrl + ':' + otherPort + '/' + path + '/GetSimpleFormAttemptsByFormEvent?FormEventID=' + eventId;
    }

    /** Returns the top 6 scores - used with the graph page */
    $.Api.getTopAttemptsByEvent = function (eventId){
        return serverUrl + ':' + otherPort + '/' + path + '/GetTopFormAttemptsByFormEvent?FormEventID=' + eventId;
    }

    /** Returns the recent 8 attempts  */
    $.Api.getRecentAttemptsByEvent = function(eventId){
        return serverUrl + ':' + otherPort + '/' + path + '/GetRecentFormAttemptsByFormEvent?FormEventID=' + eventId;
    }

    /** User by Plotly */
    $.Api.getLatestAttemptByUser = function(userId) {
        return serverUrl + ':' + otherPort + '/' + path + '/GetLatestFormAttemptByUser?UserID=' + userId;
    }

    /** Used by Plotly */
    $.Api.getDetailFormAttemptsByFormEventUser = function(eventId, userId){
        return serverUrl + ':' + otherPort + '/' + path + '/GetDetailFormAttemptsByFormEventUser?FormEventID=' + eventId +'&UserID=' + userId;
    }

    /** Returns the average score and its form scores for an event */
    $.Api.getAverageFormAttemptByFormEvent = function (eventId, userId) {
        return serverUrl + ':' + otherPort + '/' + path + '/GetAverageFormAttemptByFormEvent?FormEventID=' + eventId;
    }

    //use for testing only
    $.Api.getThreeEvents = function() {
        return serverUrl + ':' + otherPort + '/' + path + '/GetThreeEvents';
    }

    //use for testing only
    $.Api.getThreeAttempts = function () {
        return serverUrl + ':' + otherPort + '/' + path + '/GetThreeAttempts';
    }

    /** Returns all form events */
    $.Api.getAllFormEvents = function (eventId, userId) {
        return serverUrl + ':' + otherPort + '/' + path + '/GetAllFormEvents';
    }
});