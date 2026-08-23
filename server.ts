import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Advanced Semantic Analysis & Bullet Point Optimization Endpoint
app.post("/api/ai/enhance-analysis", async (req, res) => {
  try {
    const { resumeText, jobDescriptionText, missingSkills, missingKeywords } = req.body;

    if (!resumeText || !jobDescriptionText) {
      return res.status(400).json({ error: "resumeText and jobDescriptionText are required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return empty enhancement if no API key
      return res.json({
        enhanced: false,
        message: "Gemini API key not configured. Using standard NLP engine.",
        bulletRewrites: [],
        semanticAnalysis: null,
      });
    }

    const prompt = `You are an expert AI Technical Recruiter and Applicant Tracking System (ATS) Specialist.
Analyze the following Resume against the Target Job Description.

TARGET JOB DESCRIPTION:
${jobDescriptionText.slice(0, 3000)}

CANDIDATE RESUME:
${resumeText.slice(0, 3000)}

MISSING SKILLS IDENTIFIED:
${(missingSkills || []).slice(0, 10).join(', ')}

MISSING KEYWORDS:
${(missingKeywords || []).slice(0, 10).join(', ')}

Your task:
1. Provide a semantic alignment evaluation (similarity score 0-100, 3-4 conceptual strengths, 3-4 conceptual gaps, executive summary).
2. Generate 3 high-impact STAR-format bullet point rewrites transforming weak bullets from the resume into ATS-optimized bullets that seamlessly integrate the target keywords and quantified metrics.

Respond strictly in valid JSON matching the following structure:
{
  "semanticScore": 85,
  "conceptualStrengths": ["string"],
  "conceptualGaps": ["string"],
  "executiveSummary": "string",
  "bulletRewrites": [
    {
      "original": "string",
      "improved": "string",
      "reason": "string",
      "targetKeywordsIncluded": ["string"]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            semanticScore: { type: Type.NUMBER },
            conceptualStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            conceptualGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            executiveSummary: { type: Type.STRING },
            bulletRewrites: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  improved: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  targetKeywordsIncluded: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["original", "improved", "reason", "targetKeywordsIncluded"],
              },
            },
          },
          required: ["semanticScore", "conceptualStrengths", "conceptualGaps", "executiveSummary", "bulletRewrites"],
        },
      },
    });

    const outputText = response.text || "{}";
    const parsed = JSON.parse(outputText);

    res.json({
      enhanced: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("AI enhancement error:", error);
    res.status(500).json({
      enhanced: false,
      error: error.message || "Failed to generate AI enhancement",
    });
  }
});

// Single Bullet Point Optimizer Endpoint
app.post("/api/ai/rewrite-bullet", async (req, res) => {
  try {
    const { bulletPoint, targetJobTitle, targetKeywords } = req.body;

    if (!bulletPoint) {
      return res.status(400).json({ error: "bulletPoint is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Local rule-based enhancement fallback
      const actionVerbs = ['Architected', 'Spearheaded', 'Engineered', 'Optimized', 'Automated'];
      const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      const fallbackImproved = `${randomVerb} ${bulletPoint.replace(/^[•\-\*]\s*/, '').toLowerCase()}, driving a 30% performance boost and improving operational throughput.`;

      return res.json({
        variations: [
          {
            style: "High Impact & Metrics (STAR)",
            text: fallbackImproved,
            keywords: targetKeywords ? targetKeywords.slice(0, 2) : [],
          },
        ],
      });
    }

    const prompt = `You are a professional resume writer for top tech companies.
Rewrite the following resume bullet point for a "${targetJobTitle || 'Software Engineer'}" role.
Original Bullet Point: "${bulletPoint}"
Target Keywords to naturally weave in if applicable: ${(targetKeywords || []).slice(0, 5).join(', ')}

Provide 3 distinct, high-impact variations:
1. STAR Method (Situation, Task, Action, Metric Outcome)
2. Technical Depth (Highlighting architecture, frameworks, and engineering rigor)
3. Concise & Executive (Clear, punchy, emphasizing business value)

Respond in JSON format:
{
  "variations": [
    {
      "style": "string",
      "text": "string",
      "keywords": ["string"]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  style: { type: Type.STRING },
                  text: { type: Type.STRING },
                  keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["style", "text", "keywords"],
              },
            },
          },
          required: ["variations"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Rewrite bullet error:", error);
    res.status(500).json({ error: error.message || "Failed to rewrite bullet" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
    console.log(`AI Resume ATS Server listening on port ${PORT}`);
  });
}

startServer();
