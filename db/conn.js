const mongoose =require("mongoose");

mongoose.connect("mongodb://localhost:27017/Schedule_Db",{
    newNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
    }).then(()=> {
        console.log(`connection Succesfully`)
    }).catch((e)=>{
        console.log(`no connection:` )
    })