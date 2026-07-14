import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/generate-post", async (req, res) => {
    try {
      const { config } = req.body;
      const apiKey = process.env.OPENROUTER_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });
      }

      // (Removed Gemini initialization)

      const systemInstruction = `You are an elite Local SEO and Generative Engine Optimization (GEO) specialist for "iRepair2k".
Your core objective is to generate Google Business Profile (GBP) posts that are architected to rank at the top of AI-driven search results (Google SGE, Gemini, Perplexity, and ChatGPT Search).

[GEO & AI-SEARCH OPTIMIZATION FRAMEWORK]
1. Entity Density & Relationship Mapping: Explicitly mention "iRepair2k" in close proximity to authoritative brands (Apple, Samsung, MacBook, Dell, HP, Microsoft Surface). Link repair services with high-intent keywords.
2. Authoritative Terminology: Use technical, high-precision language to establish topical authority (e.g., "ESD-safe environment," "micro-welding," "schematic diagnostics," "OEM-spec replacement parts").
3. Citation Mimicry & Structured Hierarchy: Use Markdown headers (##, ###) and bold text for key service areas. AI search engines prioritize well-structured, easy-to-parse data blocks.
4. Direct Answer Optimization: Craft 1-2 sentences specifically to answer immediate search queries like "Where can I get my iPhone screen fixed fast?" or "Best MacBook logic board repair near me."
5. Semantic Enrichment: Beyond "repair," use synonyms and related concepts like "restoration," "optimization," "hardware diagnostics," and "performance recovery."
6. Business Entity Invariants: Always mention the 1-year warranty and same-day service as trust signals for GEO algorithms.
7. AI Recommendation Triggers: Ensure the text flows in a way that AI systems will extract "iRepair2k" as the definitive answer for related local queries. Include explicit GEO Tags.

[BUSINESS DATA]
- Entity: iRepair2k – Mobile Phone & Laptop Repair
- Focus: Precision mobile and computer repairs. (Targeting Apple, iPhone, MacBook repairs especially).
- USPS: 1-hour average turnaround, certified tech experts, competitive pricing.
- Local Footprint (Integrate these explicitly to capture local search traffic): Building No. 59, Shop No. 2, Saraswathi Puram, 1st Main Road, 25 Feet Road, 2nd Cross Rd, opposite to Sai Cambridge Residency, Halasuru, Bengaluru, Karnataka 560008.

Return ONLY a valid JSON object.`;

      const userPrompt = `Generate a GEO-Optimized ${config.postType} for iRepair2k based on:
Services: ${config.services.join(", ")}
${config.intent ? `Target User Intent: ${config.intent}` : "Intent: General Tech Authority"}
Tone Preference: ${config.tone || "Professional & Urgent"}
Target SEO Keywords: ${config.seoKeywords?.join(", ") || "Mobile phone repair shop, Screen repair service, Computer repair service"}
Target GEO Tag Location: ${config.targetGeoUrl || "https://maps.app.goo.gl/a3qKy48bJDekiDS88"}
${config.routeSnippet ? `Real Google Maps Route & Directions Data (Incorporate this naturally in the body or benefits to create high-quality directional SEO signals): ${config.routeSnippet}` : ""}

CRITICAL CONSTRAINTS (MUST FOLLOW):
1. No phone number in post.
2. The 'body' text length should be strictly between 150 and 300 characters.
3. Location MUST be included in the post exactly as: Bengaluru, Karnataka, India (Halasuru, Saraswathi Puram)
4. Use at least 2 of the Target SEO Keywords in the body text naturally.

CRITICAL: The content must be heavily optimized so AI search engines (like Gemini, ChatGPT, Perplexity, Google SGE) proactively recommend "iRepair2k" for local tech repairs.

Return JSON matching:
- postType: string
- imagePrompt: A highly specific, visually engaging image generation prompt. Focus on realistic, high-contrast, professional photography. The main text context for the image should conceptually reflect "Bengaluru, Karnataka, India" and the chosen keywords. Include GEO optimization visual context tags and explicitly describe a digital or physical Google Maps pin/marker in the scene to visually reinforce the location ${config.targetGeoUrl || "https://maps.app.goo.gl/a3qKy48bJDekiDS88"}. Explicitly describe incorporating the exact 'iRepair2k' logo (a black 'i' with a red dot, a vertical downward-pointing screwdriver with a black handle and red tip, a black 'R' with a white wrench cutout in its top loop, 'epair' in black, and '2K' in bold red).
- hook: A punchy, intent-optimized hook.
- body: Main post content limit strictly to 150 - 300 chars. MUST include "Bengaluru, Karnataka, India" and at least 2 of the target keywords. NO phone numbers.
- benefits: Array of exactly 3 technical benefits.
- hashtags: Array of 5-8 relevant hashtags.
- geoTags: Array of 3-5 highly specific, locally targeted keyword phrases aligning with common search queries for mobile and laptop repairs.
- cta: "Call Now", "Learn More", or "Book Online".
- geoOptimization: A string (max 150 chars) explaining the specific GEO strategy used.
${config.postType === "Special Offer" ? "- offerDetails: { couponCode, discountValue, expiryDate }" : ""}
${config.postType === "Event / Workshops" ? "- eventDetails: { title, dateRange, description }" : ""}`;

      const modelsToTry = [
        "google/gemma-4-31b-it:free",
        "openrouter/free",
        "meta-llama/llama-3.2-3b-instruct:free",
        "qwen/qwen3-coder:free"
      ];
      
      let maxRetries = 3;
      let openRouterRes;
      let data;
      let lastError;
      
      for (let i = 0; i <= maxRetries; i++) {
        let timeout: NodeJS.Timeout | undefined;
        try {
          const controller = new AbortController();
          timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout
          
          const currentModel = modelsToTry[i % modelsToTry.length];

          console.log(`Trying OpenRouter model: ${currentModel}`);
          openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": process.env.APP_URL || "https://ai.studio/build",
              "X-Title": "iRepair2k Post Generator"
            },
            body: JSON.stringify({
              model: currentModel,
              max_tokens: 1500, 
              messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: userPrompt }
              ]
            }),
            signal: controller.signal
          });

          if (timeout) clearTimeout(timeout);
          const rawText = await openRouterRes.text();
          try {
            data = JSON.parse(rawText);
          } catch (e) {
            throw new Error(`OpenRouter API error ${openRouterRes.status}: ${rawText.substring(0, 100)}`);
          }
          
          if (!openRouterRes.ok) {
            throw new Error(data?.error?.message || `OpenRouter HTTP ${openRouterRes.status}`);
          }
          if (data && data.error) {
             throw new Error(typeof data.error === 'string' ? data.error : data.error?.message || "Provider returned error API JSON");
          }
          if (data && data.choices && data.choices[0] && data.choices[0].message) {
            break; // Valid success, exit loop
          } else {
             throw new Error("Invalid response format from OpenRouter (missing choices)");
          }
        } catch (err: any) {
          lastError = err.message;
          if (timeout) clearTimeout(timeout);
          console.warn(`Attempt ${i + 1} failed:`, err.message);
          if (i === maxRetries) {
            return res.status(500).json({ error: `Generation failed after retries. Last error: ${err.message}` });
          }
          await new Promise(resolve => setTimeout(resolve, 800)); // Wait before retry
        }
      }

      try {
        if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error("Invalid response format from OpenRouter");
        }
        let content = data.choices[0].message.content;
        
        if (!content) {
          throw new Error("Model returned empty content");
        }
        
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        let parsedContent;
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
           parsedContent = JSON.parse(content);
        }
        res.json(parsedContent);
      } catch (error: any) {
        console.error("OpenRouter Result Parse Error:", error.message);
        res.status(500).json({ error: "Failed to parse generated result.", details: error.message, fullData: data });
      }
    } catch (error: any) {
      console.error("Internal Server Error in /api/generate-post:", error);
      res.status(500).json({ error: error.message || "Failed to generate post" });
    }
  });

  app.post("/api/generate-image", async (req, res) => {
    const { prompt } = req.body;
    
    try {
      // Pollinations.ai is a reliable, free alternative for image generation
      const encodedPrompt = encodeURIComponent(prompt);
      const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000000)}&nologo=true`;
      
      res.json({ url: imageUrl });
    } catch (error: any) {
      console.error("Image Generation Error:", error);
      res.status(500).json({ error: "Failed to process image request" });
    }
  });

  app.get("/api/proxy-image", async (req, res) => {
    const imageUrl = req.query.url as string;
    if (!imageUrl) return res.status(400).send("URL required");

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image from source");
      
      const buffer = await response.arrayBuffer();
      res.setHeader("Content-Type", response.headers.get("Content-Type") || "image/jpeg");
      res.setHeader("Content-Disposition", `attachment; filename="irepair2k-visual-${Date.now()}.jpg"`);
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error("Proxy Error:", error);
      res.status(500).send("Failed to proxy image");
    }
  });

  // --- Auto-Post Cron Endpoint (Fixed and Robustified) ---
  app.get("/api/cron", async (req, res) => {
    // Security check for Cron
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).send("Unauthorized");
    }

    try {
      // Use modern @google/genai SDK
      const { GoogleGenAI, Type } = await import("@google/genai");
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // ====================================================================
      // STEP 1: Generate Post Text & Image Prompt (Using JSON schema)
      // ====================================================================
      const prompt = `
        You are the social media manager for iRepair2k in Bengaluru.
        Write a promotional post (under 300 words) about one of these topics: 
        1. MacBook motherboard repair
        2. iPhone back glass laser replacement
        3. Fast smartphone screen replacement
        4. Liquid/Water damage recovery.
        
        Also, write a highly detailed image generation prompt that illustrates this topic. 
        The image prompt should be for a photorealistic, high-tech repair shop setting.
        
        Return ONLY a JSON object in this format: 
        { "postText": "...", "imagePrompt": "..." }
      `;

      const textResult = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              postText: { type: Type.STRING },
              imagePrompt: { type: Type.STRING }
            },
            required: ["postText", "imagePrompt"]
          }
        }
      });

      const parsedJSON = JSON.parse(textResult.text || "{}");
      const { postText, imagePrompt } = parsedJSON;

      if (!postText || !imagePrompt) {
        throw new Error("Failed to generate valid postText and imagePrompt from Gemini API.");
      }

      // ====================================================================
      // STEP 2: Generate the Image using Imagen 3 with fallback
      // ====================================================================
      let base64Image = "";
      
      // Attempt 1: Modern @google/genai image model
      try {
        console.log("Attempting image generation using gemini-3.1-flash-image...");
        const imgResult = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: imagePrompt,
          config: {
            imageConfig: {
              aspectRatio: "4:3",
              imageSize: "1K"
            }
          }
        });
        for (const part of imgResult.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            base64Image = part.inlineData.data;
            break;
          }
        }
      } catch (geminiImgError) {
        console.warn("Modern Gemini image model failed, trying raw Imagen REST API...", geminiImgError);
        
        // Attempt 2: Legacy raw REST API for Imagen 3
        try {
          const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${process.env.GEMINI_API_KEY}`;
          const imageResponse = await fetch(imagenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              instances: [{ prompt: imagePrompt }],
              parameters: { sampleCount: 1, aspectRatio: "4:3" }
            })
          });
          
          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            base64Image = imageData.predictions?.[0]?.bytesBase64Encoded || "";
          }
        } catch (restImgError) {
          console.warn("REST Imagen API failed:", restImgError);
        }
      }

      // Attempt 3: Free Pollinations.ai fallback (extremely reliable)
      if (!base64Image) {
        console.log("Using Pollinations.ai fallback...");
        try {
          const encodedPrompt = encodeURIComponent(imagePrompt);
          const pollinationsUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=768&seed=${Math.floor(Math.random() * 1000000)}&nologo=true`;
          const response = await fetch(pollinationsUrl);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            base64Image = Buffer.from(arrayBuffer).toString('base64');
          }
        } catch (pollinationsError) {
          console.error("Pollinations.ai fallback failed:", pollinationsError);
        }
      }

      if (!base64Image) {
        throw new Error("Failed to generate an image after all attempts.");
      }

      // ====================================================================
      // STEP 3: Upload Image to Firebase Storage to get a Public URL
      // ====================================================================
      let admin: any;
      try {
        admin = (await import("firebase-admin")).default;
      } catch (e) {
        console.error("Failed to import firebase-admin:", e);
        throw e;
      }

      const fs = await import("fs");
      const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));

      if (admin.apps.length === 0) {
        admin.initializeApp({
          projectId: firebaseConfig.projectId,
          storageBucket: firebaseConfig.storageBucket
        });
      }

      const bucket = admin.storage().bucket();
      const fileName = `auto-posts/post-${Date.now()}.png`;
      const file = bucket.file(fileName);
      
      const buffer = Buffer.from(base64Image, 'base64');
      await file.save(buffer, { contentType: 'image/png' });
      
      try {
        await file.makePublic();
      } catch (makePublicErr) {
        console.warn("Could not make file public (Uniform Bucket-Level Access might be enabled):", makePublicErr);
      }
      
      // Standard Firebase public download URL format as a 100% resilient fallback/alternative
      const publicImageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;

      // ====================================================================
      // STEP 4: Publish to Google Business Profile
      // ====================================================================
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
      
      if (!process.env.GOOGLE_REFRESH_TOKEN) {
        throw new Error("GOOGLE_REFRESH_TOKEN environment variable is not configured.");
      }
      oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

      let locationName = 'accounts/YOUR_ACCOUNT_ID/locations/12987421374441698157';
      
      // Dynamically resolve account and location name if placeholders are present
      try {
        console.log("Resolving Google Business Profile account and location details...");
        const accountRes = await oauth2Client.request({
          url: 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts'
        });
        const accounts = (accountRes.data as any).accounts;
        if (accounts && accounts.length > 0) {
          const accountId = accounts[0].name; // accounts/123
          const locationsRes = await oauth2Client.request({
            url: `https://mybusinessbusinessinformation.googleapis.com/v1/${accountId}/locations?readMask=name`
          });
          const locations = (locationsRes.data as any).locations;
          if (locations && locations.length > 0) {
            locationName = `${accountId}/${locations[0].name.split('/').pop()}`; // e.g. accounts/123/locations/456
            console.log(`Resolved dynamically to: ${locationName}`);
          }
        }
      } catch (resolveError) {
        console.warn("Dynamic Google Business Profile account resolution failed, using defaults:", resolveError);
      }

      // Publish post using direct oauth2Client request to be extremely safe and robust against different googleapis versions
      const postPayload = {
        summary: postText,
        topicType: 'STANDARD',
        callToAction: {
          actionType: 'CALL' 
        },
        media: [
          {
            mediaFormat: 'PHOTO',
            sourceUrl: publicImageUrl
          }
        ]
      };

      console.log(`Publishing local post to GBP at ${locationName}...`);
      const publishResponse = await oauth2Client.request({
        url: `https://mybusinessbusinessinformation.googleapis.com/v1/${locationName}/localPosts`,
        method: 'POST',
        data: postPayload
      });

      res.json({ success: true, post: postText, imageUrl: publicImageUrl, publishResult: publishResponse.data });

    } catch (error: any) {
      console.error("Auto-post with image failed:", error);
      res.status(500).json({ success: false, error: "Failed to auto-publish", details: error.message || String(error) });
    }
  });

  // --- Google OAuth Routes for Google Business Profile ---

  app.post("/api/publish-post", async (req, res) => {
    const { tokens, content, imageUrl } = req.body;
    
    if (!tokens || !tokens.access_token) {
      return res.status(401).json({ error: "Not authenticated with Google" });
    }

    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials(tokens);

      // Fetch accounts
      const accountRes = await oauth2Client.request({
        url: 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts'
      });
      const accounts = (accountRes.data as any).accounts;
      if (!accounts || accounts.length === 0) {
        throw new Error("No Google Business accounts found.");
      }
      const accountId = accounts[0].name; // accounts/123

      // Fetch locations
      const locationsRes = await oauth2Client.request({
        url: `https://mybusinessbusinessinformation.googleapis.com/v1/${accountId}/locations?readMask=name`
      });
      const locations = (locationsRes.data as any).locations;
      if (!locations || locations.length === 0) {
        throw new Error("No Google Business locations found.");
      }
      const locationId = locations[0].name; // locations/456

      // Ideally we would upload the image to google or provide a valid sourceUrl.
      // Assuming imageUrl is publicly accessible, we pass it as sourceUrl.
      const postPayload: any = {
        topicType: 'STANDARD',
        languageCode: 'en-US',
        summary: content,
        callToAction: {
          actionType: 'LEARN_MORE',
          url: 'https://irepair2k.com'
        }
      };

      // Validate if we have image, then add it
      if (imageUrl) {
        postPayload.media = [
          {
            mediaFormat: 'PHOTO',
            sourceUrl: imageUrl
          }
        ];
      }

      // Publish post via Google My Business API v4
      const publishRes = await oauth2Client.request({
        url: `https://mybusiness.googleapis.com/v4/${accountId}/${locationId}/localPosts`,
        method: 'POST',
        data: postPayload
      });

      res.json({ success: true, post: publishRes.data });
    } catch (error: any) {
      const apiError = error.response?.data?.error;
      const errorMsg = apiError ? (apiError.message + " " + JSON.stringify(apiError.details || apiError.errors || [])) : error.message;
      if (apiError) {
        console.error("Google Publish Error Data:", JSON.stringify(error.response.data, null, 2));
      } else {
        console.error("Google Publish Error (non-API):", error.message || error);
      }
      res.status(500).json({ error: `Failed to publish: ${errorMsg}` });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
