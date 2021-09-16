const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")

const app = express()

app.set('view engine', 'ejs'); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

mongoose.connect("mongodb://localhost:27017/foodDB", {useNewUrlParser: true});
// mongodb+srv://admin_user:manu123@cluster0.u03xe.mongodb.net/foodDB

const recipeSchema = {
    personName: {type:String},
    recipeName: {type:String},
    recipeCategory: {type:String, required:true},
    ingredient:{type:String},
    process: {type:String, required:true},
    calories: {type:Number,max:[3000, "We are not trying to kill someone"],required:true},
    unsplashURL: {type:String, required:true}
  };



const Post = mongoose.model("recipes", recipeSchema);

// const penneAllVodka = new Post(  {
//     recipeName: 'Penne Alla Russa',
//     recipeCategory: 'Pasta',
//     ingredient: 'Penne, Mushrooms, Pancetta, Prosciutto, Mascarpone, Parmesan, Tomato Paste, Passata, Garlic, Olive Oil, Vodka',
//     process: '1) Place olive oil, garlic and mushrooms in a frying pan on high heat\r\n' +
//       '2)Once cooked add Pancetta and Prosciutto\r\n' +
//       '3) Add full tub of mascarpone\r\n' +
//       '4) Add a small amount of passata and tomato paste till you get a nice orange colour\r\n' +
//       '5) Add parmesan to thicken the mixture up\r\n' +
//       '6) Add two caps off vodka and leave to simmer for thirty mins\r\n' +
//       '7) Add penne to sauce',
//     calories: 1000,
//     unsplashURL: 'https://images.unsplash.com/photo-1625944525803-d510d5a4a262?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1956&q=80'
//   })

// penneAllVodka.save()

// Post.find(function (err, recipes){
//     if (err){
//         console.log(err);
//     }
//     else{
//         mongoose.connection.close();

//         recipes.forEach(function (recipe){
//             console.log(recipe.recipeName)
//             console.log(recipe._id)
//         })
//     }

// })

// Post.updateOne({_id:"6136689c7abb9ddd1c534316"},{recipeName:"Penne Alla Russa"},function (err){
// if (err){
//     console.log(err)
// }
// else{
//     console.log("Successful")
// }
// })


// Post.deleteMany({},function (err){
//     if (err){
//         console.log(err)
//     }
//     else{
//         console.log("Successful")
//     }
//     }) 

app.get('/', (req,res)=>{
    res.render('index')
})

app.get('/burrito', (req, res)=>{
    Post.find({recipeCategory: "Burrito"}, function (err, recipes){
        res.render('burrito', {recipes: recipes});  
    })
})

app.get('/pasta', (req, res)=>{
    Post.find({recipeCategory: "Pasta"}, function (err, recipes){
        res.render('pasta', {recipes: recipes});  
    })
})

app.get('/pizza', (req, res)=>{
    Post.find({recipeCategory: "Pizza"}, function (err, recipes){
        res.render('pizza', {recipes: recipes});  
    })
})

app.get('/meat', (req, res)=>{
    Post.find({recipeCategory: "Meat"}, function (err, recipes){
        res.render('meat', {recipes: recipes});  
    })
})

app.get('/toastie', (req, res)=>{
    Post.find({recipeCategory: "Toastie"}, function (err, recipes){
        res.render('toastie', {recipes: recipes});  
    })
})

app.get('/dessert', (req, res)=>{
    Post.find({recipeCategory: "Dessert"}, function (err, recipes){
        res.render('dessert', {recipes: recipes});  
    })
})

app.get('/allfood', (req, res)=>{
    Post.find({}, function (err, recipes){
        res.render('allfood', {recipes: recipes});  
    })
})

app.get('/getintouch', (req,res)=>{
    res.render('getintouch')
})

app.get('/food', (req,res)=>{
    res.render('food')
})

app.get('/food/:recipeID', (req,res)=>{
    const requestedID = req.params.recipeID;

    Post.findOne({_id:requestedID}, function (err, recipes){
        if (err){
            console.log(err)
            res.redirect('/')
        }
        else{
        res.render('foodDetails', {recipes: recipes});  
        }
    })
    
})

app.get('/food/:recipeID/delete', (req,res)=>{
    const requestedID = req.params.recipeID;

    Post.findOne({_id:requestedID}, function (err, recipes){
        if (err){
            console.log(err)
            res.redirect('/')
        }
        else{
        res.render('foodDelete', {recipes: recipes});  
        }
    })
    
})

app.get('/food/:recipeID/update', (req,res)=>{
    const requestedID = req.params.recipeID;

    Post.findOne({_id:requestedID}, function (err, recipes){
        if (err){
            console.log(err)
            res.redirect('/')
        }
        else{
        res.render('foodUpdate', {recipes: recipes});  
        }
    })
    
})

app.get('/recipes',(req, res)=>{
    res.render('recipes')
})

app.post('/recipes', (req, res)=>{
    const userName = req.body.userName;
    const recipeName = req.body.recipeName;
    const recipeCategory = req.body.recipeCategory;
    const ingredient = req.body.ingredients;
    const process = req.body.process;
    const calories = req.body.calories;
    const unsplashURL = req.body.unsplashURL;

    const post = new Post({
        userName: userName,
        recipeName: recipeName,
        recipeCategory: recipeCategory,
        ingredient: ingredient,
        process: process,
        calories: calories,
        unsplashURL: unsplashURL
    })

    post.save();

    res.redirect('/'+recipeCategory)
    
    
})

app.post('/delete', (req, res)=>{
    const deleteItem = req.body.deleteButton
    console.log(deleteItem)

    Post.findByIdAndRemove(deleteItem, function(err){
        if (err){
          console.log(err);
        }
        else{
            console.log("Successful");
            res.redirect("/allfood")
        }
})

})

app.post('/update', (req, res)=>{
        const requestedID = req.params.recipeID;
        console.log(requestedID)
        const optionChange = req.params.recipeOption;
        const requestedChange = req.params.foodUpdate;
        console.log(requestedChange)
    
    Post.updateOne({_id:requestedID}, {optionChange: requestedChange},function (err, recipes){
        if (err){
            console.log(err)
            res.redirect('/')
        }
        else{
        res.render('foodUpdate', {recipes: recipes});  
        }
    })
})




app.listen(3000, (req,res)=>{
    console.log("Server is running on port 3000")
})

