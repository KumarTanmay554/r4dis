import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const client = createClient();
client.on('error',(err)=>{
  console.error('Redis Client Error', err);
});

app.post("/submit", async(req,res)=>{
    const id = req.body.id;
    const code = req.body.code;
    const lang = req.body.lang;

    try {
        await client.LPUSH("problems", JSON.stringify({code,lang,id}))
        res.status(200).json({message: "Problem submitted successfully"});
    } catch (error) {
        console.error('Error submitting problem:', error);
        res.status(500).json({message: "Internal Server Error"});
    }
})

async function startserver() {
    try {
        await client.connect();
        console.log("Redis client connected successfully");

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
}
startserver();