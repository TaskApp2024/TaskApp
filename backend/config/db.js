const moongoose=require('mongoose');

const connectDB=async()=>{
    try{
        await moongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
           
        });
        console.log('MongoDb Connected Successfully');

    }
    catch(err){
        console.log('MongoDB connection failed:',err.message);
        process.exit();
    }
}

module.exports=connectDB;