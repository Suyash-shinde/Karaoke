import express from "express"

const app=express();
const port=process.env.PORT;

app.listen(port,()=>{
    console.log(`App is listening on port: http://localhost:${port}`);
})