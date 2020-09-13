const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const ddb = require('../server.js');
const nodemailer = require("nodemailer");
const { param } = require('./users.controller.js');
var CryptoJS = require("crypto-js");
const { Sequelize } = require('sequelize');
var jwt_decode = require('jwt-decode');
const { v4: uuidv4 } = require('uuid');
module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    forget,
    resetPassword
};

async function authenticate({ username, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
    router.get('/', authorize(), getAll);


}

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
console.log(params.body+ "body",params.files)
     if (await db.User.findOne({ where: { username: params.body.username } })) {
         throw 'Username "' + params.body.username + '" is already taken';
     }

    // hash password
    if (params.body.password) {
        params.body.hash = await bcrypt.hash(params.body.password, 10);
    }
//img upload 
    const file = params.files.imgPath;
    const  name = uuidv4()+'.'+file.name.split('.')[1];
    file.mv("./uploads/"+ name, function (err, result) {
        if (err)
            throw err;
    })
    // save user

    var dataPost = {
        firstName: params.body.firstName,
        lastName: params.body.lastName,
        username: params.body.username,
        hash: params.body.hash,
        phoneNo: params.body.phoneNo,
        imgPath: name
    };

    await db.User.create(dataPost);

}

async function update(id, params) {
    const user = await getUser(id);

    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function forget(params) {
    console.log(params,"params");
    
   var data = await db.User.findOne({ where: { username: params.email }});
console.log(data,"data")
    if (data != "" &&  data != null ) {
        emailSend(params);
        //throw 'link sent';
    }
    else{
        throw 'Email does not match with any eamil.';
    }

   // return omitHash(user.get());
}

async function  resetPassword(params) {
    //var email = jwt_decode(params.body.id,{payload:true});
    var email = params.body.id;
    //console.log(email.payload.email.email,'1');
    const sequelize = new Sequelize('gameshow', 'root', null, {
        dialect: 'mysql'
      })
     // console.log(email.payload.email,'2');
       const pass = await bcrypt.hash(params.body.password, 10);
      const records = await sequelize.query(`UPDATE users SET hash='${pass}' WHERE username='${email}'`, {
          //type: QueryTypes.UPDATE

        }); 
       console.log(email,'3');
//console.log(JSON.stringify(records[0], null, 2));

}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
   
console.log(user,".......");
    return userWithoutHash;
}


async function emailSend(d) {
    
    const payload = {email:d}
    
    const token = jwt.sign({payload},'mykey');
    console.log(d,'1')
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '',
          pass: '18anatomytj2'
        }
      });
      console.log(d,'2')
      var mailOptions = {
        from: 'your email',
        to: d.email,
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://localhost:3000/resetpassword \n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      console.log(d,'3')
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error,"error");
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
  }