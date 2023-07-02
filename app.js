const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require('dotenv').config();

// const bodyParser = require("body-parser");

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

mailchimp.setConfig({
  apiKey: process.env.KEY,
  server: "us21"
});

app.get("/", (req,res)=> {
    res.sendFile(__dirname + "/index.html");
  });

app.post("/failure", (req,res) => {
    res.redirect("/");
});

app.post("/", (req,res)=> {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;
    const listId = "8e01553b40";

    console.log(fName);
    console.log(lName);
    console.log(email);

    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: fName,
            LNAME: lName
          }
        }).then((response) => {
          res.sendFile(__dirname + "/sucess.html")
        })
        .catch((error) => {
          res.sendFile(__dirname + "/failure.html")
          console.log(error)
        });
      }

      run();
});



app.listen(process.env.PORT || 3000, ()=> {
    console.log("The server is started in port 3000");
});


// api key
// e643525de89eace930a0d0b2f39c0d6d-us21

// id 
// 8e01553b40