//import mysql
var mysql = require('mysql');
var bodyParser = require('body-parser');
var express=require('express');
//use for sendind mails
const nodemailer = require('nodemailer');
//create session
const session = require('express-session');
// line 10 to 21 database connectivity
var con = mysql.createConnection({
	
	host:"localhost",
	user:"root",
	password:"",
	database:"blood"
});
con.connect(function(err){
	
	if(err) throw err;
	console.log("Connected");
});
module.exports = function(app){
   //line 24 to 29 session created 
  app.use(session({
        secret: 'asbdgjgljsdg45gs4fdsnfd',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // set secure to true for HTTPS
      }));
    // express middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.urlencoded({extended:false}));
    app.get('/', function(req,res){
        res.render("login");
    })
    //login//
    app.get('/login', function(req,res){
        res.render("login");
       
    })
    app.post('/userlogin', function(req,res){
        con.query("select *  from detail where  email=? and pass=?",[req.body.name,req.body.pass],(err,result)=>{
            if(err) throw err;
            
            
            if(result.length!=0){
                
                const email =req.body.name;
                req.session.email = email;  
                    res.redirect("/index");
            } 
            else{
                 
                 res.redirect("login")
                }
    })

    })
   
    app.get('/logout', (req, res) => {
        req.session.destroy(err => {
          if (err) {
            console.log(err);
          } else {
            res.redirect('login');
          }
        });
      });
    app.get('/aboutus', function(req,res){
        res.render("aboutus");
    })
    //contact//
    app.get('/contact', function(req,res){
        res.render("contact");
    })
    app.post('/contact',function (req,res){

       const fullname=req.body.name; //variable ban aaya
       const email=req.body.email;
       const subject=req.body.subject;
       const message=req.body.message;

       async function sendMail() {
        // create reusable transporter object using the default SMTP transport (by default code)
        const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
              user: 'yessenia.cartwright@ethereal.email',
              pass: 'NE682RB1uDNHmPuvan'
                }
          });
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: 'yessenia.cartwright@ethereal.email', // sender address
          to:"akshitakapoor2003@gmail.com", // list of receivers
          subject:subject, // Subject line
          text:`This message is from user ${email} `+ message, // plain text body
        });
      }
     
      sendMail().catch(console.error);//call send mail that we create above line 84 to 101
      res.redirect("contact") 

    })
    app.get('/index', function(req,res){ 
        const email = req.session.email;
        // If the session does not exist or is empty, redirect to the login page
        if (!email) {
          res.redirect('login');
          return;
        }
        res.render("index");
    })
    //register//
    app.get('/register', function(req,res){
        res.render("register");
    })
    app.post('/register', function(req,res){
       
       const fullname=req.body.name;
       const email=req.body.email;
       const phn=req.body.phn;
       const dob=req.body.dob;
       const gender=req.body.gender;
       const bloodgroup=req.body.bloodgroup;
       const weight=req.body.weight;
       const address=req.body.add1+req.body.add2;
       const country=req.body.country;
       const city=req.body.city;
       const region=req.body.region;
       const code=req.body.code;
       const pass=req.body.pass;
       const cpass=req.body.cpass;
       
     //check pass and confirm pass are same  if same data object will be created
    if (pass == cpass){
        const data = {
          name: fullname,
          email:email,
          phn:phn,
          dob:dob,
          gender: gender,
          bloodgroup:bloodgroup,
          weight:weight,
          address:address,
          country:country,
          city:city,
          region: region,
          code:code,
          pass:pass
        };

        const query = 'INSERT INTO detail SET ?';
        con.query(query, data, (error, results, fields) => {
          if (error) throw error;
          
          res.redirect('login');
        });
      }
      else{
        
        res.redirect('register');
      }
    
    })
    app.get('/learn', function(req,res){
        res.render("learn");
    })
    app.get('/blog', function(req,res){
        res.render("blog");
    })

    //accept//
    app.get('/accept', function(req,res){
      const que = "SELECT * from accept " ;
      const data=[];
      con.query(que, (error, result, fields) => {
        if (error) throw error;
        if(result.length!=0){
          
          
          result.forEach((rows) =>{
            if(rows.status==='pending') //check status of each row(data)
            {
              data.push(rows); //add data in the  table
            }
            
          }) 
          res.render('accept',{result:result,data:data}) //render and data pass kr rhe hai accept wale doc ko
          
        }
        else{
          res.render("accept") //accept pg khol rhe hai
        }
      })

  })

    //bloodbank//
    app.get('/bloodbank', function(req,res){
        res.render("bloodbank");
    })
    app.post('/bloodbank', function(req,res){
       
      
      const state=req.body.state;
     
      

      const query = 'SELECT name ,address ,ph,email From bloodbank where state=?' ;
      
      con.query(query, [state], (error, result, fields) => {
        if (error) throw error;
        if(result.length!=0){
          
          res.render('bloodbank',{result});
        }
        else{
          const data=true;//jab data na ho
          res.render('bloodbank',{data});
        }
      
      });
}) 
    //find donor
    app.get('/finddonor', function(req,res){
        res.render("finddonor");
    })
    app.post('/finddonor', function(req,res){
       
      
      const bloodgroup=req.body.bloodgroup;
      const city=req.body.city;
      const region=req.body.region;

      const query = 'SELECT name ,phn,bloodgroup,address From detail where bloodgroup=? and city=? and region=?';
      
      con.query(query, [bloodgroup,city,region], (error, result, fields) => {
        if (error) throw error;
        if(result.length!=0){
          
          res.render('finddonor',{result});
        }
        else{
          const data=true;
          res.render('finddonor',{data});
        } 
      
      });
}) 
      

    //campaign//
    app.get('/campaign', function(req,res){
        res.render("campaign");
    })
    app.post('/campaign', function(req,res){
       
      
      const state=req.body.state;
      const date=req.body.date;
      

      const query = 'SELECT Date,CampName,State,District,Conductedby,Organised,Time,Address,phn From campaign where State=? and Date=?' ;
      
      con.query(query, [state,date], (error, result, fields) => {
        if (error) throw error;
        if(result.length!=0){
          
          res.render('campaign',{result});
        }
        else{
          const data=true;
          res.render('campaign',{data});
        }
      
      });
}) 
    app.get('/registration', function(req,res){
      res.render("registration");
   })
   app.get('/screening', function(req,res){
    res.render("screening");
   })
   app.get('/news', function(req,res){
    res.render("news");
   })
   app.get('/refreshment', function(req,res){
    res.render("refreshment");
   })
   app.get('/donation', function(req,res){
    res.render("donation");
   })
   app.get('/team', function(req,res){
    res.render("team");
  })

  //adminlogin//
  app.get('/adminlogin', function(req,res){
    res.render("adminlogin");
  })
  app.post('/adminlogin',function(req,res){
    const name=req.body.name;
    const pass=req.body.pass;

    const que = 'SELECT * from adminlogin where username=? and pass=?';
    con.query(que,[name,pass] ,(error, result) => {
      if (error) throw error;
      if(result.length!=0){
        
        res.redirect('accept')
        
      }
      
    })
    
    
  })

  //useraccept//
  app.get('/useraccept', function(req,res){
   
    const que = 'SELECT * from accept';
      con.query(que, (error, result, fields) => {
        if (error) throw error;
        if(result.length!=0){
          
          res.render('useraccept',{result})
          
        }
        else{
          res.render("useraccept")
        }
      })
      
 })
    //request//
    app.get('/request', function(req,res){
        res.render("request");

    })
    app.post('/request', function(req,res){
       
      const pname=req.body.pname;
      const dname=req.body.dname;
      const bloodgroup=req.body.bloodgroup;
      const hname=req.body.hname;
      const state=req.body.state;
      const district=req.body.district;
      const area=req.body.area;
      const cname=req.body.cname;
     
      const phn=req.body.phn;
      const date=req.body.date;
      const priority=req.body.priority
      const email=req.body.email;
      
      const data = {
        Pname: pname,
        Dname: dname,
        Bloodgroup:bloodgroup,
        Hname:hname,
        state:state,
        district:district,
        area:area,
        Cname:cname,
        phn:phn,
        date:date,
        priority:priority,
        email:email
      };

      const query = 'INSERT INTO requestblood SET ?';
      
      con.query(query, data, (error, results, fields) => {
        if (error) throw error;
        async function sendMail() {
          // create reusable transporter object using the default SMTP transport
          const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'monte.beahan@ethereal.email',
                pass: '1ghheebNN641eaqmnS'
                  }
            });
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: 'monte.beahan@ethereal.email', // sender address
            to:email, // list of receivers
            subject: 'Confirmation', // Subject line
            text: `Hello This is your confirmation email regarding your blood request `, // plain text body
          });
        }
       
        sendMail().catch(console.error);
       
      }); 
      const acceptdata={
        name:pname,
        bloodgroup:bloodgroup,
        phn:phn,
        priority:priority,
        status:"pending"
      }
      const que = 'INSERT INTO  accept SET ?';
      con.query(que, acceptdata , (error, results, fields) => {
        if (error) throw error;
        res.render("request")
      })
      
  
   
   })
  
 
  app.post('/accepted',function(req,res){
    const name=req.body.Name;
    const phn=req.body.MobileNumber;
    const bloodgroup=req.body.BloodGroup;
    const priority=req.body.Priority;

    const que = 'update accept set status=? where name=? and phn=? and bloodgroup=? and priority=?';
      con.query(que,["accepted",name,phn,bloodgroup,priority], (error, result) => {
        if (error) throw error;
        if(result.length!=0){
          
          res.redirect('accept')
          
        }
        
      })
  })

  app.post('/rejected', function(req,res){
    
    const name=req.body.Name;
    const phn=req.body.MobileNumber;
    const bloodgroup=req.body.BloodGroup;
    const priority=req.body.Priority;
     
    
    const que = 'update accept set status=? where name=? and phn=? and bloodgroup=? and priority=?';
      con.query(que,["rejected",name,phn,bloodgroup,priority], (error, result) => {
        if (error) throw error;
        if(result.length!=0){
          
          res.redirect('accept')
          
        }
        
      })
  
  })
}
