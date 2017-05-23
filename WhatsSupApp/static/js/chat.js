$(function(){
    $(document).ready(function () {
        $(".wrap").fadeOut(700);
    })
    var myName = $("#me").data("username");
    var RSAkey;
    var PublicKeyString;

    var socket = new WebSocket("ws://" + window.location.host + "/chat/");
    socket.onmessage = function(e) {
        var data = JSON.parse(e.data);
        var contact_conv = $("#chat_with_" + data.sender);
        if (contact_conv.length === 0){
            contact_conv = $('<div/>', {
                id: "chat_with_" + data.sender,
                class: "messages_container"
            });
            $("#conv_container").append(contact_conv)
            $("#conv_title").text(data.username);
            $("#receiver_user_id").val(data.sender);
            $("#chat_container").show();
        }
        if (contact_conv.css("display") === "none"){
            alert("Nouveau message de " + data.username)
            $(".messages_container").hide();
            contact_conv.show();
        }
        var decrypted = decrypt(data.message)
        switch(decrypted.code) {
            case 0:
                alert("Etrange.. non signé!")
                createMessage(decrypted.message, data.username, data.sender);
                break;
            case 1:
                createMessage(decrypted.message, data.username, data.sender);
                break;
            case 2:
                alert("Message modifié !!")
                break;
            default:
                createMessage(decrypted.message, data.username, data.sender);
        }
    };

    $("#search_user_form").submit(function (e) {
        e.preventDefault();
        var search_query = $("#search_query").val();
        if (search_query.trim().length){
            var contact_container = $("#contact_container");
            contact_container.html("");
            $.ajax({
                type: 'POST',
                url: '/app/search_user/',
                async: true,
                data: 'q=' + search_query,
                success: function (res) {
                    if (res.users.length === 0){
                        contact_container.append($('<p/>', {
                            text: "Pas de résultat",
                        }));
                        return;
                    }
                    $.each(res.users, function (i, user) {
                        var contact_btn = $('<div/>', {
                            text: user.first_name,
                            class: "contact-btn col-md-12",
                            "data-id": user.id,
                            "data-username": user.first_name
                        });
                        contact_container.append(contact_btn)
                    })
                },
                error: function(error) {
                    alert("Erreur lors de la recherche")
                }
            });
        }
    });

    $(document).on("click", ".contact-btn", function () {
        $("#chat_container").show();
        var conv = $(this).data("username");
        var room = $(this).data("id");
        $("#conv_title").text(conv);
        $("#receiver_user_id").val(room);
        $(".messages_container").hide();
        var contact_conv = $("#chat_with_" + room);
        if (contact_conv.length){
            contact_conv.show();
        }
        else {
            contact_conv = $('<div/>', {
                id: "chat_with_" + room,
                class: "messages_container"
            });
            $("#conv_container").append(contact_conv)
        }
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

    function randomString(size) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!:;,ù*$=)°+£%µ§/.?&é\"\'(-è_çà";

        for (var i = 0; i < size; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function createKey() {
        RSAkey = cryptico.generateRSAKey(randomString(200), 2048);
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
                console.log(error);
            }
        });
    }

    function crypto(message, pub_key) {
        var result = cryptico.encrypt(message, pub_key, RSAkey);
        console.log(result);
        if (result.status === "success"){
            return result.cipher.toString();
        } else {
            return "error";
        }
    }

    function decrypt(message) {
        var result = cryptico.decrypt(message, RSAkey);
        var code = 0;
        var messageText = result.plaintext;
        console.log(result);
        if (result.status === "success") {
            if (result.signature === "verified") {
                //good
                code = 1
            } else if (result.signature === "forged") {
                // not good
                code = 2
            } else {
                // strange - not found
                code = 0
            }
        } else {
            messageText = "Error, can't view the message"
        }
        return {message: messageText, code: code};
    }

    loadKey();
});