const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;

    const data={
        members:[
            {
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:firstName,
                LNAME:lastName
            }
        }
        ]
    }
    const JSONdata=JSON.stringify(data);

    const url="https://us7.api.mailchimp.com/3.0/lists/41efb6574d"
    const options={
        method:'POST',
        auth:"kp:bcf9a63858e66f708ea07a63a6556978-us7"
    }
    const request=https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on('data',function(data){
           console.log(JSON.parse(data));    
        });
    });
    request.write(JSONdata);
    request.end();

});

app.listen(process.env.PORT || 3000,function(){
    console.log("Running at port 3000");
});

//API Key: bcf9a63858e66f708ea07a63a6556978-us7
//listid: 41efb6574d