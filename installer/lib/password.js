/** PASSWORD GENERATOR */

/** PASSWORD PROPERTIES **/

var randomPassword;
const passwordLength = 8;


/** FUNCTIONAL **/

/**
 * @param {String} chars chars
 * @return random char
 */
function randomChar(chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"){
    const number = Math.floor((Math.random() * chars.length));
    return chars.charAt(number);
}

/**
 * @return random password
 */
function generatePassword(){
    randomPassword = "";//Reset the value
    for (let i = 0; i < passwordLength; i++) randomPassword += randomChar();
    return randomPassword;
}