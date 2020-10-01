
// const formidable = require('formidable');
const fetch = require('node-fetch');
const userModel = require('../model/user');
const { OAuth2Client } = require('google-auth-library');
// const client = new OAuth2Client(CLIENT_ID);

const userSignIn = (req, res) => {
    console.log('req.body : ', req.body , req.body.token);
    // var obj = JSON.parse(req.body)
    // console.log('parse obj :', obj);
    var isSuccess = false;
    fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.token}`, { method: 'get' }).then(
        function (response) {
            console.log('typeof : ', response, 'response.status :', response.status);
            if (response.status == 200 && response.statusText == 'OK') {
                //return res.json({status:200 , message:'Success' , data : req.body})
                console.log('req.body.profile.name :', req.body.profile.name);
                const obj = {
                    email : req.body.profile.email,
                    username : req.body.profile.name,
                    googleId : req.body.profile.googleId
                }
                console.log('obj :',obj);
                userModel.find({email:req.body.profile.email},(error, user)=>{
                    console.log('in',user , !user);
                    if(error)
                    return res.json({status:400 , message : error.message})
                    else if(user.length==0){
                        console.log('in call ');
                        const saveUser = new userModel(obj);
                        saveUser.save();
                        console.log('saveuser :' , saveUser);
                        return res.status(200).json({message:'Successfully Login' , token : req.body.token , email : saveUser.email , username : saveUser.username})
                    }else{
                        console.log('in else');
                        // return res.status(200).json({message:'Successfully Login' , token : req.body.token , username : user.username , email : user.email })
                        return res.status(200).json({message:'Successfully Login' , token : req.body.token , username : req.body.profile.name , email : req.body.profile.email })
                    }
                })
            }else
            return res.status(response.status).json({message : response.statusText})
        })
        .catch(function (error) {
            console.log('error :', error);
        })
}

const verifyUserSignIn = async (req, res) => {
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
    }
    verify().catch(console.error);
}


module.exports = {
    userSignIn,
    verifyUserSignIn
}