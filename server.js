const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='micro';
var db
MongoClient.connect(url,{ useUnifiedTopology: true }, (err,database)=>{
    if(err) return console.log(err);
    db=database.db(dbName);
    console.log(`Database : ${dbName}`);
});
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('views'));
app.get('/', (req,res)=>{
    db.collection('books').find().toArray((err,result)=>{
    if(err) return console.log(err)
      res.render('home.ejs',{data :result})
    })
});
app.get('/create', (req,res)=>{
    res.render('add.ejs')
});
app.post('/AddData',(req,res)=>{
    db.collection('books').insertOne(({Product_Id:req.body.Product_Id,Product_Name:req.body.Product_Name,
Group_Name:req.body.Group_Name,Selling_Price:req.body.Selling_Price,Cost_Price:req.body.Cost_Price,Quantity:req.body.Quantity}),(error,result)=>{
    res.redirect('/')
})
});
app.get('/updatestock', (req,res)=>{
    res.render('update.ejs')
});
app.post('/update',(req,res)=>{
    db.collection('books').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i<result.length;i++){
            if(result[i].Product_Id==req.body.Product_Id){
                s=result[i].Quantity
                break
            }
        }
        db.collection('books').findOneAndUpdate({Product_Id:req.body.Product_Id},{
            $set:{Quantity: parseInt(s)+parseInt(req.body.Quantity)}},{sort:{_id:-1}},
            (err,result)=>{
            if(err) return console.log(err)
            res.redirect('/')
        })
    })
})
app.get('/deleteproduct', (req,res)=>{
    res.render('delete.ejs')
});
app.post('/delete',(req,res)=>{
    db.collection('books').findOneAndDelete({Product_Id:req.body.Product_Id},(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})
.listen(2000);