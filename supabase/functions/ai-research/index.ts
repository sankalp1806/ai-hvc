import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResearchRequest {
  industry: string;
  aiService: string;
  companySize?: string;
  location?: string;
  freeTextNotes?: string;
  timeHorizonYears?: number;
}

// Input validation constants
const MAX_INDUSTRY_LENGTH = 100;
const MAX_SERVICE_LENGTH = 100;
const MAX_COMPANY_SIZE_LENGTH = 50;
const MAX_LOCATION_LENGTH = 50;
const MAX_FREE_TEXT_LENGTH = 2000;
const MIN_TIME_HORIZON = 1;
const MAX_TIME_HORIZON = 10;

function sanitizeInput(input: string | undefined, maxLength: number): string {
  if (!input) return '';
  // Remove potential prompt injection patterns and limit length
  return input
    .slice(0, maxLength)
    .replace(/[<>{}]/g, '') // Remove potential HTML/JSON injection chars
    .trim();
}

function validateRequest(data: ResearchRequest): { valid: boolean; error?: string } {
  if (!data.industry || typeof data.industry !== 'string' || data.industry.trim().length === 0) {
    return { valid: false, error: 'Industry is required and must be a non-empty string' };
  }
  if (!data.aiService || typeof data.aiService !== 'string' || data.aiService.trim().length === 0) {
    return { valid: false, error: 'AI Service is required and must be a non-empty string' };
  }
  if (data.industry.length > MAX_INDUSTRY_LENGTH) {
    return { valid: false, error: `Industry must be ${MAX_INDUSTRY_LENGTH} characters or less` };
  }
  if (data.aiService.length > MAX_SERVICE_LENGTH) {
    return { valid: false, error: `AI Service must be ${MAX_SERVICE_LENGTH} characters or less` };
  }
  if (data.companySize && data.companySize.length > MAX_COMPANY_SIZE_LENGTH) {
    return { valid: false, error: `Company size must be ${MAX_COMPANY_SIZE_LENGTH} characters or less` };
  }
  if (data.location && data.location.length > MAX_LOCATION_LENGTH) {
    return { valid: false, error: `Location must be ${MAX_LOCATION_LENGTH} characters or less` };
  }
  if (data.freeTextNotes && data.freeTextNotes.length > MAX_FREE_TEXT_LENGTH) {
    return { valid: false, error: `Free text notes must be ${MAX_FREE_TEXT_LENGTH} characters or less` };
  }
  if (data.timeHorizonYears !== undefined) {
    const horizon = Number(data.timeHorizonYears);
    if (isNaN(horizon) || horizon < MIN_TIME_HORIZON || horizon > MAX_TIME_HORIZON) {
      return { valid: false, error: `Time horizon must be between ${MIN_TIME_HORIZON} and ${MAX_TIME_HORIZON} years` };
    }
  }
  return { valid: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check - optional but logged
    const authHeader = req.headers.get('Authorization');
    let userId = 'anonymous';
    
    if (authHeader?.startsWith('Bearer ')) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } }
      );

      const token = authHeader.replace('Bearer ', '');
      const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
      
      if (!claimsError && claimsData?.claims) {
        userId = claimsData.claims.sub as string;
      }
    }
    
    console.log(`AI Research request from user: ${userId}`);

    // Parse and validate request body
    const requestData = await req.json() as ResearchRequest;
    const validation = validateRequest(requestData);
    
    if (!validation.valid) {
      console.error("Validation failed:", validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize inputs
    const industry = sanitizeInput(requestData.industry, MAX_INDUSTRY_LENGTH);
    const aiService = sanitizeInput(requestData.aiService, MAX_SERVICE_LENGTH);
    const companySize = sanitizeInput(requestData.companySize, MAX_COMPANY_SIZE_LENGTH);
    const location = sanitizeInput(requestData.location, MAX_LOCATION_LENGTH);
    const freeTextNotes = sanitizeInput(requestData.freeTextNotes, MAX_FREE_TEXT_LENGTH);
    const timeHorizonYears = Math.min(Math.max(Number(requestData.timeHorizonYears) || 3, MIN_TIME_HORIZON), MAX_TIME_HORIZON);

    console.log(`Researching AI solutions for: ${industry} - ${aiService} - ${companySize || 'any size'} - ${location || 'global'}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert AI business analyst and strategic consultant specializing in AI implementation strategies, ROI analysis, and market research. Your task is to generate comprehensive, structured analytical reports for businesses evaluating AI solutions.

CRITICAL INSTRUCTIONS:
1. Respond ONLY with valid JSON matching the exact structure provided.
2. All analysis must be grounded in realistic market data and industry benchmarks.
3. Provide specific, actionable insights rather than generic advice.
4. All monetary values should be in USD unless otherwise specified.
5. Include realistic ranges rather than single point estimates.
6. Consider the specific industry, company size, and regional context in all recommendations.`;

    const userPrompt = `Generate a comprehensive AI implementation analysis report for:

CONTEXT:
- Industry: ${industry}
- AI Service Type: ${aiService}
- Company Size: ${companySize || 'Medium (51-500 employees)'}
- Location/Region: ${location || 'Global / Not Specified'}
- Time Horizon: ${timeHorizonYears} years
${freeTextNotes ? `- Additional Context: ${freeTextNotes}` : ''}

Produce a complete structured analysis in the following JSON format. Be thorough and realistic:

{
  "validationSummary": {
    "status": "OK",
    "issues": [],
    "handlingNotes": ""
  },
  "contextOverview": {
    "scenarioSummary": {
      "industry": "${industry}",
      "serviceType": "${aiService}",
      "companySize": "${companySize || 'Medium (51-500 employees)'}",
      "maturityAssumptions": "Brief assessment of typical AI maturity for this profile",
      "keyGoals": ["goal 1", "goal 2", "goal 3"]
    },
    "locationContext": {
      "region": "${location || 'Global'}",
      "currency": "USD",
      "regulatoryEnvironment": "Description of relevant regulations (GDPR, CCPA, industry-specific)",
      "costModifiers": "Regional cost factors affecting the analysis",
      "marketMaturity": "Assessment of AI adoption in this region"
    }
  },
  "executiveSummary": {
    "overallRecommendation": "Clear go/no-go recommendation with reasoning",
    "topRecommendation": "Primary solution approach recommended",
    "estimatedBenefitProfile": "Summary of expected benefits",
    "biggestRisks": ["risk 1", "risk 2"],
    "roiRange": {
      "conservative": "X%",
      "optimistic": "Y%"
    },
    "paybackPeriod": "X-Y months",
    "confidenceLevel": "low/medium/high",
    "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3", "takeaway 4"]
  },
  "keyMetrics": {
    "financial": [
      {"name": "Expected ROI", "value": "150-300%", "unit": "%", "timeHorizon": "3 years"},
      {"name": "Net Present Value", "value": "$50,000-$150,000", "unit": "$", "timeHorizon": "3 years"},
      {"name": "Total Cost of Ownership", "value": "$30,000-$80,000", "unit": "$", "timeHorizon": "3 years"},
      {"name": "Break-even Point", "value": "8-14", "unit": "months", "timeHorizon": ""}
    ],
    "operational": [
      {"name": "Hours Saved Per Week", "value": "20-40", "unit": "hours", "timeHorizon": "at maturity"},
      {"name": "Throughput Improvement", "value": "25-50%", "unit": "%", "timeHorizon": "year 1"},
      {"name": "Error Reduction", "value": "40-70%", "unit": "%", "timeHorizon": "year 1"}
    ],
    "adoption": [
      {"name": "Process Coverage", "value": "60-80%", "unit": "%", "timeHorizon": "year 1"},
      {"name": "User Adoption Rate", "value": "70-90%", "unit": "%", "timeHorizon": "6 months"}
    ]
  },
  "visualDescriptions": [
    {
      "chartType": "Line Chart",
      "title": "ROI Projection Over Time",
      "xAxis": "Months (0-36)",
      "yAxis": "Cumulative Net Benefit ($)",
      "description": "Shows break-even point around month 12-16, with cumulative benefits reaching $X by year 3. Conservative and optimistic scenarios shown as confidence bands."
    },
    {
      "chartType": "Stacked Bar Chart",
      "title": "Cost vs Benefit Breakdown",
      "xAxis": "Categories",
      "yAxis": "Value ($)",
      "description": "Compares implementation, operational, and hidden costs against labor savings, efficiency gains, and revenue impact."
    },
    {
      "chartType": "Waterfall Chart",
      "title": "Value Creation Analysis",
      "xAxis": "Value Drivers",
      "yAxis": "Cumulative Value ($)",
      "description": "Shows contribution of each benefit category to total value, from initial investment through to net gain."
    }
  ],
  "comparativeAnalysis": {
    "applicable": true,
    "comparisonMatrix": [
      {
        "option": "Option/Solution 1",
        "cost": "Low/Medium/High or $X-$Y",
        "roi": "X-Y%",
        "complexity": "Low/Medium/High",
        "risk": "Low/Medium/High",
        "scalability": "Low/Medium/High",
        "bestFor": "Description of ideal use case"
      },
      {
        "option": "Option/Solution 2",
        "cost": "Low/Medium/High or $X-$Y",
        "roi": "X-Y%",
        "complexity": "Low/Medium/High",
        "risk": "Low/Medium/High",
        "scalability": "Low/Medium/High",
        "bestFor": "Description of ideal use case"
      },
      {
        "option": "Option/Solution 3",
        "cost": "Low/Medium/High or $X-$Y",
        "roi": "X-Y%",
        "complexity": "Low/Medium/High",
        "risk": "Low/Medium/High",
        "scalability": "Low/Medium/High",
        "bestFor": "Description of ideal use case"
      }
    ],
    "bestForLowBudget": "Recommendation with reasoning",
    "bestForFastImplementation": "Recommendation with reasoning",
    "bestForMaximumUpside": "Recommendation with reasoning"
  },
  "solutionProviders": [
    {
      "name": "Provider Name",
      "category": "Category (e.g., Enterprise Platform, SMB Tool, Open Source)",
      "description": "Comprehensive description of the solution",
      "fitForSize": "small/medium/large/enterprise/all",
      "fitForIndustry": "How well it fits the selected industry",
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "tradeoffs": ["limitation 1", "limitation 2"],
      "integrationRequirements": "Brief overview of integration needs",
      "pricingTiers": [
        {
          "tierName": "Starter/Basic",
          "price": "$X/month or $X/year",
          "features": ["feature 1", "feature 2", "feature 3"],
          "limitations": ["limit 1", "limit 2"]
        },
        {
          "tierName": "Professional/Growth",
          "price": "$X/month or $X/year",
          "features": ["feature 1", "feature 2", "feature 3"],
          "limitations": ["limit 1"]
        },
        {
          "tierName": "Enterprise",
          "price": "Custom pricing",
          "features": ["feature 1", "feature 2", "feature 3", "feature 4"],
          "limitations": []
        }
      ],
      "websiteUrl": "https://example.com"
    }
  ],
  "costBudgetImpact": {
    "costBreakdown": {
      "oneTime": [
        {"category": "Software/Platform Setup", "amount": "$X - $Y", "notes": ""},
        {"category": "Implementation Services", "amount": "$X - $Y", "notes": ""},
        {"category": "Data Preparation", "amount": "$X - $Y", "notes": ""},
        {"category": "Training", "amount": "$X - $Y", "notes": ""}
      ],
      "recurring": [
        {"category": "Platform Subscription", "amount": "$X - $Y/month", "notes": ""},
        {"category": "Cloud Infrastructure", "amount": "$X - $Y/month", "notes": ""},
        {"category": "Maintenance & Support", "amount": "$X - $Y/month", "notes": ""},
        {"category": "Ongoing Training", "amount": "$X - $Y/year", "notes": ""}
      ]
    },
    "companySizeImpact": "How company size affects these costs",
    "locationImpact": "How the selected region affects costs",
    "yearOneTotal": "$X - $Y",
    "yearTwoTotal": "$X - $Y",
    "yearThreeTotal": "$X - $Y",
    "totalTCO": "$X - $Y over ${timeHorizonYears} years"
  },
  "timeline": {
    "overviewOptions": {
      "fastTrack": {
        "duration": "X-Y weeks",
        "tradeoffs": "What you sacrifice for speed",
        "bestFor": "Who should choose this"
      },
      "standard": {
        "duration": "X-Y weeks",
        "tradeoffs": "Balanced approach details",
        "bestFor": "Who should choose this"
      },
      "comprehensive": {
        "duration": "X-Y months",
        "tradeoffs": "What you gain from thoroughness",
        "bestFor": "Who should choose this"
      }
    },
    "phases": [
      {
        "phaseName": "Discovery & Strategy",
        "duration": "X-Y weeks",
        "activities": ["activity 1", "activity 2", "activity 3"],
        "keyStakeholders": ["role 1", "role 2"],
        "deliverables": ["deliverable 1", "deliverable 2"]
      },
      {
        "phaseName": "Design & Configuration",
        "duration": "X-Y weeks",
        "activities": ["activity 1", "activity 2", "activity 3"],
        "keyStakeholders": ["role 1", "role 2"],
        "deliverables": ["deliverable 1", "deliverable 2"]
      },
      {
        "phaseName": "Development & Integration",
        "duration": "X-Y weeks",
        "activities": ["activity 1", "activity 2", "activity 3"],
        "keyStakeholders": ["role 1", "role 2"],
        "deliverables": ["deliverable 1", "deliverable 2"]
      },
      {
        "phaseName": "Testing & Validation",
        "duration": "X-Y weeks",
        "activities": ["activity 1", "activity 2", "activity 3"],
        "keyStakeholders": ["role 1", "role 2"],
        "deliverables": ["deliverable 1", "deliverable 2"]
      },
      {
        "phaseName": "Launch & Optimization",
        "duration": "X-Y weeks",
        "activities": ["activity 1", "activity 2", "activity 3"],
        "keyStakeholders": ["role 1", "role 2"],
        "deliverables": ["deliverable 1", "deliverable 2"]
      }
    ]
  },
  "risksAndSensitivity": {
    "risks": [
      {
        "category": "Financial",
        "risk": "Risk description",
        "likelihood": "Low/Medium/High",
        "impact": "Low/Medium/High",
        "mitigation": "Mitigation strategy"
      },
      {
        "category": "Operational",
        "risk": "Risk description",
        "likelihood": "Low/Medium/High",
        "impact": "Low/Medium/High",
        "mitigation": "Mitigation strategy"
      },
      {
        "category": "Technical",
        "risk": "Risk description",
        "likelihood": "Low/Medium/High",
        "impact": "Low/Medium/High",
        "mitigation": "Mitigation strategy"
      },
      {
        "category": "Regulatory/Compliance",
        "risk": "Risk description",
        "likelihood": "Low/Medium/High",
        "impact": "Low/Medium/High",
        "mitigation": "Mitigation strategy"
      }
    ],
    "sensitivityAnalysis": [
      {
        "assumption": "Adoption Rate",
        "baseCase": "70%",
        "impact": "Each 10% decrease reduces ROI by approximately 15-20%"
      },
      {
        "assumption": "Implementation Timeline",
        "baseCase": "On schedule",
        "impact": "Each month delay reduces first-year ROI by approximately 8-12%"
      },
      {
        "assumption": "Labor Cost Savings",
        "baseCase": "As estimated",
        "impact": "Each 10% variance directly affects ROI proportionally"
      }
    ]
  },
  "insightsRecommendations": {
    "overallVerdict": "Clear recommendation with confidence level",
    "prioritizedActions": [
      {
        "priority": 1,
        "action": "Action description",
        "rationale": "Why this matters",
        "effort": "Low/Medium/High",
        "impact": "Low/Medium/High"
      },
      {
        "priority": 2,
        "action": "Action description",
        "rationale": "Why this matters",
        "effort": "Low/Medium/High",
        "impact": "Low/Medium/High"
      },
      {
        "priority": 3,
        "action": "Action description",
        "rationale": "Why this matters",
        "effort": "Low/Medium/High",
        "impact": "Low/Medium/High"
      }
    ],
    "immediateNextSteps": ["step 1 (0-1 month)", "step 2 (1-2 months)", "step 3 (2-3 months)"],
    "mediumTermSteps": ["step 1 (3-6 months)", "step 2 (6-12 months)"],
    "longTermConsiderations": ["consideration 1 (1-2 years)", "consideration 2 (2-3 years)"],
    "byBudgetLevel": {
      "lowBudget": "Recommendation for constrained budgets",
      "mediumBudget": "Recommendation for moderate investment",
      "highBudget": "Recommendation for maximum capability"
    },
    "byRiskAppetite": {
      "conservative": "Recommendation for risk-averse organizations",
      "balanced": "Recommendation for moderate risk tolerance",
      "aggressive": "Recommendation for growth-focused organizations"
    }
  },
  "methodology": {
    "approach": "Description of analytical methodology used",
    "dataSourceTypes": ["Industry benchmarks", "Market research reports", "Case studies", "Vendor data"],
    "keyAssumptions": [
      "Assumption 1 with rationale",
      "Assumption 2 with rationale",
      "Assumption 3 with rationale"
    ],
    "limitations": [
      "Limitation 1",
      "Limitation 2"
    ],
    "confidenceNotes": "Overall assessment of estimate reliability"
  },
  "appendix": {
    "glossary": [
      {"term": "ROI", "definition": "Return on Investment - (Benefits - Costs) / Costs × 100"},
      {"term": "TCO", "definition": "Total Cost of Ownership - All direct and indirect costs"},
      {"term": "NPV", "definition": "Net Present Value - Future cash flows discounted to present value"}
    ],
    "additionalResources": [
      {"title": "Resource 1", "type": "Article/Guide/Tool", "relevance": "How it helps"}
    ]
  },
  "metadata": {
    "timeHorizon": "${timeHorizonYears} years",
    "currency": "USD",
    "generatedDate": "${new Date().toISOString().split('T')[0]}",
    "disclaimer": "This analysis is based on market research and industry benchmarks. Actual results may vary based on specific implementation factors. All estimates should be validated against real organizational data before making investment decisions."
  }
}

IMPORTANT:
- Include at least 4-5 relevant solution providers with realistic pricing
- Ensure all metrics and estimates are realistic for the industry and company size
- Consider the regional context for regulatory and cost factors
- Provide actionable, specific recommendations rather than generic advice
- All numerical estimates should be ranges, not single points`;

    console.log("Calling AI gateway for comprehensive analysis...");

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

    let researchData;
    try {
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
      console.log("Successfully parsed comprehensive research data");
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
        query: { industry, aiService, companySize, location, timeHorizonYears }
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
