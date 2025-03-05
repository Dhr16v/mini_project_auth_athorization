const cookieParser = require('cookie-parser');
const express = require('express');
const userModel=require('./model/user');
const postModel=require('./model/post')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const PORT = 3000;
const app = express();

app.set("view engine", "ejs"); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  


app.get('/', (req, res) => {
    res.render("app");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/logout', (req, res) => {
    res.cookie("token","");
    res.redirect("/login");
});

app.get('/profile',isLoggedIn, async(req, res) => {
   
    let user=await userModel.findOne({email:req.user.email});

    let {content}=req.body;
    
    postModel.create({
        user:user._id,
        content
    })

    user.posts.push(post._id);
    await user.save();

    res.redirect("/profile")

});

app.post('/post',isLoggedIn, async(req, res) => {
   
    let user=await userModel.findOne({email:req.user.email});
    console.log(user);

    res.render("profile",{user})

});

app.post('/register',async(req,res)=>{
    let {email,password,username,name,age}=req.body;

    let user=await userModel.findOne({email});

    if(user) return res.status(200).send("user already exists")

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
         let user= await userModel.create(
            {
                username,
                email,
                age,
                name,
                password:hash
            });

            let token=jwt.sign({email:email, userid:user._id},"shhhh");
            console.log(token);
            res.cookie("token",token);

            res.redirect("/login");
        })
    })


})

app.post('/login',async(req,res)=>{
    let {email,password}=req.body;

    let user=await userModel.findOne({email});

    if(!user) return res.status(500).send("Something went wrong");

    bcrypt.compare(password,user.password,(err,result)=>{
        if(result) {
            let token=jwt.sign({email:email, userid:user._id},"shhhh");
            res.cookie("token",token);

            res.status(200).send("you can login");

        }
        else {
            res.redirect('/login')
        };
    })
})



function isLoggedIn(req,res,next){
    if(req.cookies.token==="")
    {
        res.redirect("/login")
    }
    else{
        let data=jwt.verify(req.cookies.token,"shhhh");
        req.user=data
        next();
    }

}

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
