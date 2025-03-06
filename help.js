const {GoogleGenerativeAI} = require("@google/generative-ai");
require("dotenv").config()

const fs = require("fs");

const path = require("path");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

function filetoGenerativePath(path,mimetype){
    return {
        inlineData:{
            data: Buffer.from(fs.readFileSync(path).toString('base64')),
            mimetype
        }
    }
}


async function processMedicalBill(path){
    try{
        const model = genAI.getGenerativeModel({model:"gemini-1.5-flash"});
        const prompt = "Analyze this medical bill and summarize key expenses. Identify possible ways to save costs.";
        const imageParts =  filetoGenerativePath(path,"image/jpeg");

        //const result = await model.generateContent(prompt,imageParts);
        const result = await model.generateContent({
            contents:[{role:"user" , parts: [{text:prompt}, imageParts]}]
        });
        //const response = await result.response;

        //const text = response.text();

        console.log(result.response.text());

        return result.response.text()
    }
    catch(e){
        console.log("Gimini Api errror",e);
        throw new Error("Failed to analyse the bill");
    }

}

module.exports = { processMedicalBill };