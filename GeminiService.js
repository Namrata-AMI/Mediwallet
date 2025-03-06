const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const pdf2img = require("pdf-poppler");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Convert PDF to Images
async function pdfToImg(pdfPath) {
  const outputDir = path.resolve(__dirname, "output");
  const opts = {
    format: "jpeg",
    out_dir: outputDir,
    out_prefix: "page",
    scale: 2.0,
  };

  try {
    await pdf2img.convert(pdfPath, opts);
    console.log("PDF converted to images.");

    // Wait until images are available (polling instead of setTimeout)
    let retries = 10;
    while (retries-- > 0) {
      const imageFiles = fs.readdirSync(outputDir)
        .filter(file => file.endsWith(".jpeg"))
        .map(file => path.join(outputDir, file));

      if (imageFiles.length > 0) return imageFiles;
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retrying
    }

    throw new Error("No images found after conversion!");
  } catch (error) {
    console.error("Error converting PDF:", error);
    return [];
  }
}

// Convert Image to Generative AI Format
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType,
    },
  };
}

// Analyze Medical Bill
async function analyzeBill(imagePath) {
  try {
    const imagePart = fileToGenerativePart(imagePath, "image/jpeg");

    const prompt = "Analyze this medical bill and suggest ways to minimize medical expenses, such as insurance coverage, discounts, alternative treatments, or cost-effective options.";

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    console.log(`Analysis for ${imagePath}:\n`, responseText);
    return responseText;
  } catch (error) {
    console.error("Error analyzing image:", error);
    return "Error analyzing bill.";
  }
}

// Process Medical Bill
async function processMedicalBill(pdfPath) {
  const images = await pdfToImg(pdfPath);
  if (images.length === 0) {
    console.log("No images found.");
    return ["No images found."];
  }

  console.log("Analyzing images...");

  // Process images in parallel for faster execution
  const analysisResults = await Promise.all(images.map(image => analyzeBill(image)));

  // Cleanup images after processing
  images.forEach(image => fs.unlinkSync(image));

  return analysisResults;
}

// Export Function
module.exports = { processMedicalBill };
