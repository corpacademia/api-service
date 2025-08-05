const app = require('./src/app')

const PORT = process.env.PORT;
app.listen(PORT,(err)=>{
    if(err){
        console.log("Error running api-gateway service")
    }
    else{
        console.log(`api gateway is running on PORT:${PORT}`);
    }
    
});