import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResearchRequest {
  industry: string;
  aiService: string;
  companySize?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { industry, aiService, companySize } = await req.json() as ResearchRequest;

    console.log(`Researching AI solutions for: ${industry} - ${aiService} - ${companySize || 'any size'}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert AI business analyst specializing in AI service providers and implementation strategies. Your task is to research and provide comprehensive information about AI solutions for businesses.

IMPORTANT: Respond ONLY with valid JSON. Do not include any markdown, code blocks, or additional text.`;

    const userPrompt = `Research AI solutions for the following business context:
- Industry: ${industry}
- AI Service Type: ${aiService}
- Company Size: ${companySize || 'Various sizes'}

Provide a comprehensive analysis in the following JSON format:
{
  "summary": "A 2-3 sentence overview of AI solutions available for this use case",
  "marketInsights": {
    "adoptionRate": "percentage of similar companies using this AI type",
    "averageROI": "typical ROI range",
    "implementationTimeframe": "typical implementation period"
  },
  "providers": [
    {
      "name": "Provider/Platform Name",
      "description": "Brief description of the service",
      "website": "website URL",
      "pricingModel": "subscription/usage-based/enterprise",
      "plans": [
        {
          "name": "Plan name",
          "price": "Price or price range",
          "features": ["feature 1", "feature 2", "feature 3"],
          "bestFor": "Who this plan is best for"
        }
      ],
      "pros": ["advantage 1", "advantage 2"],
      "cons": ["limitation 1", "limitation 2"],
      "typicalCostRange": {
        "small": "$X - $Y/month",
        "medium": "$X - $Y/month",
        "enterprise": "Custom pricing"
      },
      "implementationComplexity": "low/medium/high",
      "integrationOptions": ["integration 1", "integration 2"]
    }
  ],
  "recommendations": {
    "forSmallBusiness": {
      "provider": "Recommended provider name",
      "reason": "Why this is recommended"
    },
    "forMediumBusiness": {
      "provider": "Recommended provider name",
      "reason": "Why this is recommended"
    },
    "forEnterprise": {
      "provider": "Recommended provider name",
      "reason": "Why this is recommended"
    }
  },
  "implementationGuide": {
    "phases": [
      {
        "phase": "Phase 1: Discovery",
        "duration": "X weeks",
        "activities": ["activity 1", "activity 2"]
      }
    ],
    "keyConsiderations": ["consideration 1", "consideration 2"],
    "commonChallenges": ["challenge 1", "challenge 2"],
    "successFactors": ["factor 1", "factor 2"]
  },
  "costEstimates": {
    "small": {
      "initialSetup": "$X - $Y",
      "monthlyOperating": "$X - $Y",
      "yearOneTotal": "$X - $Y",
      "potentialSavings": "$X - $Y per year"
    },
    "medium": {
      "initialSetup": "$X - $Y",
      "monthlyOperating": "$X - $Y",
      "yearOneTotal": "$X - $Y",
      "potentialSavings": "$X - $Y per year"
    },
    "enterprise": {
      "initialSetup": "$X - $Y",
      "monthlyOperating": "$X - $Y",
      "yearOneTotal": "$X - $Y",
      "potentialSavings": "$X - $Y per year"
    }
  },
  "timeHorizonOptions": [
    {
      "period": "Short-term (3-6 months)",
      "expectedOutcomes": ["outcome 1", "outcome 2"],
      "riskLevel": "low/medium/high"
    },
    {
      "period": "Medium-term (6-12 months)",
      "expectedOutcomes": ["outcome 1", "outcome 2"],
      "riskLevel": "low/medium/high"
    },
    {
      "period": "Long-term (1-3 years)",
      "expectedOutcomes": ["outcome 1", "outcome 2"],
      "riskLevel": "low/medium/high"
    }
  ]
}

Provide realistic, up-to-date information about actual AI service providers in the market. Include at least 4-5 relevant providers with their actual pricing tiers where known.`;

    console.log("Calling AI gateway for research...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "Service credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI research service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Failed to generate research results" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Raw AI response received, parsing...");

    // Clean and parse the JSON response
    let researchData;
    try {
      // Remove any markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith("```")) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      researchData = JSON.parse(cleanContent);
      console.log("Successfully parsed research data");
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.error("Raw content:", content.substring(0, 500));
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse research results",
          rawContent: content.substring(0, 1000)
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: researchData,
        query: { industry, aiService, companySize }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Research error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
