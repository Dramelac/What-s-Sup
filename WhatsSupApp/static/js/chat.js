$(function(){
    var myName = $("#me").data("username");

    // Note that the path doesn't matter for routing; any WebSocket
    // connection gets bumped over to WebSocket consumers
    var socket = new WebSocket("ws://" + window.location.host + "/chat/");
    socket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        if ($("#chat_with_" + data.sender).css("display") === "none"){
            alert("Nouveau message de " + data.username)
        }
        createMessage(data.message, data.username, data.sender);
    };

    $(".contact-btn").on("click", function () {
        $("#chat_container").show();
        var conv = $(this).data("username");
        var room = $(this).data("id");
        $("#conv_title").text(conv);
        $("#receiver_user_id").val(room);
        $(".messages_container").hide();
        $("#chat_with_" + room).show();
    });

    $("#chat_form").submit(function (e) {
        e.preventDefault();
        var msg = $("#write_zone").val();
        var receiver_user_id = $("#receiver_user_id").val();
        if (msg.trim().length){
            socket.send(JSON.stringify({
                message: msg,
                username: myName,
                to: receiver_user_id
            }));
            $("#write_zone").val("");
            createMessage(msg, myName, receiver_user_id)
        }
    });

    $("#write_zone").keypress(function(e){
        // Submit the form on enter
        if(e.which === 13) {
            e.preventDefault();
            $("#chat_form").trigger('submit');
        }
    });

    function createMessage(msg, user, conv_user_id){
        var who = "";
        if (user === myName){
            who = "my_msg";
        }
        else{
            who = "his_msg";
        }
        var msg_container = $('<div/>', {
            text: msg,
            class: who
        });
        msg_container.appendTo("#chat_with_" + conv_user_id)
    }
});