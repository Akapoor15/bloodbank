//build server
var express =require('express');
//import hbs file
const hbs=require('hbs');
//import module
var controller=require('./controller/controller');
//dynamic text on web pages
const { engine } = require('express-handlebars');

var app= express();

hbs.registerHelper('eq', function(a,b) {
    return (a == b);
});

//set up template engine
app.engine('handlebars', engine({ extname: '.hbs', defaultLayout: "main"}));
app.set('view engine','hbs')
//set static file path
app.use(express.static('./public'))

//call the controller 
controller(app);
//listen to port
const port=process.env.PORT || 3000
app.listen(port,()=>{
    console.log('server is listen to port:'+port)
})