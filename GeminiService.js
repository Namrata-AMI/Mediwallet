
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const pdf2img = require("pdf-poppler");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function extractText(pdfPath) {
  try {
    const data = await pdfParse(fs.readFileSync(pdfPath));
    return data.text.trim() || null;
  } catch (error) {
    console.error("Error extracting text:", error);
    return null;
  }
}

async function convertPdfToImages(pdfPath) {
  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const opts = { format: "jpeg", out_dir: outputDir, out_prefix: "page", scale: 2.0 };
  try {
    await pdf2img.convert(pdfPath, opts);
    return fs.readdirSync(outputDir).filter(file => file.endsWith(".jpeg"));
  } catch (error) {
    console.error("Error converting PDF to images:", error);
    return [];
  }
}

function prepareImageForAI(filePath) {
  try {
    return { inlineData: { data: fs.readFileSync(filePath, "base64"), mimeType: "image/jpeg" } };
  } catch (error) {
    console.error("Error reading image file:", error);
    return null;
  }
}

async function analyzeImage(imagePath) {
  try {
    const imageData = prepareImageForAI(imagePath);
    if (!imageData) return "Error processing image.";
    
    const prompt = "Analyze this medical bill and suggest ways to reduce expenses.";
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }, imageData] }] });
    return result?.response?.text?.() || "No response generated.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    return "Error analyzing bill.";
  }
}

async function processMedicalBill(pdfPath) {
  if (!fs.existsSync(pdfPath)) return ["PDF file does not exist."];

  const extractedText = await extractText(pdfPath);
  if (extractedText) {
    const prompt = `Analyze this medical bill and suggest cost-saving options.\n\n${extractedText}`;
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    return [result?.response?.text?.() || "No response generated."];
  }

  console.log("Extracted text is empty. Converting PDF to images...");
  const images = await convertPdfToImages(pdfPath);
  if (!images.length) return ["No images found for analysis."];

  const results = await Promise.all(images.map(img => analyzeImage(path.join(__dirname, "output", img))));
  return results;
}

module.exports = { processMedicalBill };
