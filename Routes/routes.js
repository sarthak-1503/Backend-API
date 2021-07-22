let bcrypt = require('bcrypt');
let express = require('express');
let async = require('async');
let bodyParser = require('body-parser').json();
let router = express.Router();
let User = require('../Models/UserModel');
let insertRecords = require('../OperationsModules/insert');
let generateAccessToken = require('../OperationsModules/generateAccessToken');

router.get('/',(req,res)=> {

    res.status(200).send('Welcome to API Operations!');
});

// router.get('/signup',(req,res)=> {
//     res.render('signup');
// }); 

router.post('/signup',bodyParser,async(req,res)=> {

    // let fname = req.body.fname;
    // let lname = req.body.lname;
    // let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    
    let records = User.find({}).catch(err=>{
        console.log(err);
    });

    let saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds).catch(err=> {
        console.log('salt-error : ', err);
    });
    let hash = await bcrypt.hash(password,salt).catch(err=> {
        console.log('hash-error : ', err);
    });;

    let details = {
        // fname,
        // lname,
        // username: username,
        email,
        password: hash
    };
    
    insertRecords(req,res,details);
    console.log('signup successful!');
    // console.log('Username assigned to you is',details.username);

    // res.redirect('/');
}); 

// router.get('/login',(req,res)=> {
//     res.render('login');
// }); 

router.post('/login',bodyParser,async(req,res)=> {
    // console.log(req.body);

    // User.find({}).then(records => {
    //     console.log(records);
    // }).catch(err=> {
    //     console.log(err);
    // });

    let email = req.body.email;
    let password = req.body.password;
    
        
    let searchRecord = {
        email: email,
        password: password
    };

    let record = await User.findOne({email:email}).catch((err)=> {
        console.log(err);
    });


    if(record == undefined) {
        res.status(401).send('Email not found!');
    } else {
        console.log(record);

        bcrypt.compare(password,record.password,(err,check)=> {
            if(err) {
                console.log(err);
            } else {
                console.log(password, record.password);
                console.log(check);

                if(check == false) {
                    res.status(401).send('Unauthorized access');
                } else {
                    console.log('Login successful!');

                    const token = generateAccessToken(searchRecord);
                    res.status(201).send({"key":token});
                    
                }
            }
        });
    }
}); 

module.exports = router;