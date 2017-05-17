$(function(){
    var myName = $("#me").data("username");
    var RSAkey;
    var PublicKeyString;

    var socket = new WebSocket("ws://" + window.location.host + "/chat/");
    socket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        if ($("#chat_with_" + data.sender).css("display") === "none"){
            alert("Nouveau message de " + data.username)
        }
        //TODO handle error code
        createMessage(decrypt(data.message).message, data.username, data.sender);
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
            // Get contact PUB Key
            $.ajax({
                type: 'POST',
                url: '/app/get_pub_key/',
                async: true,
                data: 'user_id=' + receiver_user_id,
                success: function (ContactPublicKeyString) {
                    var encrypted_msg = crypto(msg, ContactPublicKeyString);
                    socket.send(JSON.stringify({
                        message: encrypted_msg,
                        username: myName,
                        to: receiver_user_id
                    }));
                    $("#write_zone").val("");
                    createMessage(msg, myName, receiver_user_id)
                },
                error: function(error) {
                    alert("L'utilisateur n'est pas connecté")
                }
            });
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


    //////////////////////////////////////
    //              CRYPTO              //
    //////////////////////////////////////

    function createKey() {
        RSAkey = cryptico.generateRSAKey("", 2048);
        PublicKeyString = cryptico.publicKeyString(RSAkey);
    }

    function loadKey() {
        if (!PublicKeyString && !RSAkey){
            createKey();
        }
        // Store PUB Key
        $.ajax({
            type: 'POST',
            url: '/app/store_pub_key/',
            async: true,
            data: {pub_key: PublicKeyString},
            error: function(error) {
                console.log(error)
                alert(error)
            }
        });
    }

    function crypto(message, pub_key) {
        var result = cryptico.encrypt(message, pub_key);
        if (result.status == "success"){
            return result.cipher.toString();
        } else {
            return "error";
        }
    }

    function decrypt(message) {
        var result = cryptico.decrypt(message, RSAkey);
        if (result.status == "success"){
            return result.plaintext;
        } else {
            return "error";
        }
    }


    loadKey();
});