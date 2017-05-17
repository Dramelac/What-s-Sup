var RSAkey;
var PublicKeyString;


function createKey() {
    RSAkey = cryptico.generateRSAKey("", 2048);
    PublicKeyString = cryptico.publicKeyString(RSAkey);

    document.cookie = "pub_key="+PublicKeyString;
    document.cookie = "rsa_key="+RSAkey;
}

function loadKey() {
    if (!PublicKeyString && !RSAkey){
        console.log("Creating key");
        createKey();
    }
    console.log("Key loaded !", PublicKeyString);
}

function crypto(message, pub_key) {
    var result = cryptico.encrypt(message, pub_key);

    if (result.success == "success"){
        return result.cipher;
    } else {
        return "error";
    }
}

function decrypt(message) {
    var result = cryptico.decrypt(message, RSAkey);

    if (result.success == "success"){
        return result.plaintext;
    } else {
        return "error";
    }
}


loadKey();