var RSAkey;
var PublicKeyString;

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

    document.cookie = "pub_key=" + PublicKeyString;
    document.cookie = "rsa_key=" + RSAkey;
}

function loadKey() {
    if (!PublicKeyString && !RSAkey) {
        console.log("Creating key");
        createKey();
    }
    console.log("Key loaded !", PublicKeyString);
}

function crypto(message, pub_key) {
    var result = cryptico.encrypt(message, pub_key);

    if (result.success == "success") {
        return result.cipher;
    } else {
        return "error";
    }
}

function decrypt(message) {
    var result = cryptico.decrypt(message, RSAkey);
    var code = 0;
    var messageText = result.plaintext;

    if (result.success == "success") {
        if (result.signature == "verified") {
            //good
            code = 1
        } else if (result.signature == "forged") {
            // not good
            code = 2
        } else {
            // strange - not found
            code = 0
        }
        console.log(result.publicKeyString);
        return {message: result.plaintext, code: 0};
    } else {
        messageText = "Error, can't view the message"
    }
    return {message: messageText, code: code};
}

loadKey();