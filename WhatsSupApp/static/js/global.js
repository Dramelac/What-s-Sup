/**
 * Created by axel on 21/01/17.
 */
$(document).ready(function () {

    // Chargement des pages dans les différentes divs
    // Méthodes ajax à refaire

    $.ajax({
            url : "chat",
            type : "GET",
            dataType : "json"
        }).done(function() {
            $("#chat").load('chat');
    });

    $.ajax({
            url : "contacts",
            type : "GET",
            dataType : "json"
        }).done(function() {
            $("#contacts").load('contacts');
    });
});