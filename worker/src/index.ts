import { createClient } from "redis";

const client  = createClient();

async function submission(submit:string){
    const {id,code,lang} = JSON.parse(submit);
    console.log(`Received submission: ID=${id}, Language=${lang} code=${code}`);
    await new Promise(resolve=> setTimeout(resolve, 1000)); // Simulate processing delay
    console.log(`Processed submission: ID=${id}, Language=${lang} code=${code}`);
}
async function startworker(){
    try {
        await client.connect();
        console.log("Redis client connected successfully");

        while(true){
            try {
                const submit = await client.brPop("problems",0);
                // @ts-ignore
                await submission(submit.element)
            } catch (error) {
                console.log('Error processing submission:', error);
            }
        }
    } catch (error) {
        console.log('Error connecting redis:', error);
    }
}
startworker();