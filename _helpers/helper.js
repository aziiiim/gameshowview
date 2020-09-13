const jwt = require('jsonwebtoken');
var jwt_decode = require('jwt-decode');

//const bcrypt = require('bcrypt');
var path = require('path');
// const bcrypt = require('bcrypt');
const { secret } = require('config.json');
 //exports.secret = function () { return "click3" }

// exports.createToken = function (id) {

//     let expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30); //30 days from now
//     var token = jwt.sign({ user_id: id, exp: expirationDate }, setting.jwt.secret);
//     return token;

// }


// exports.createToken_Forget_Password = function (id) {
    
//         let expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24); //1 days from now
//         var token = jwt.sign({ user_id: id, exp: expirationDate }, setting.jwt.secret_forget_password);
//         return token;
    
// }



// exports.createToken_Verify_Email = function (id) {
    
//         let expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24); //1 days from now
//         var token = jwt.sign({ user_id: id, exp: expirationDate }, setting.jwt.secret_verify_email);
//         return token;
    
// }




// exports.JWD_Token_Destroy = function (token,type) {
    
       
    
// }


exports.Get_Token_Data = function (token) {


    var retinr_data = null;
    if (token.startsWith('bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    retinr_data = jwt_decode(token)
    //jwt.verify(token, exports.secret(), (err, decoded) => {
    // return err;
    // if(!err) {
    //     return decoded;
    // }
    // });
console.log(retinr_data)
    return retinr_data;

}

