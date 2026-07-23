import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, category, industry, country, businessStage,
      annualRevenue, monthlyRevenue, netProfit, ebitda,
      monthlyVisitors, registeredUsers, customers, subscribers,
      technologyStack, developmentCost, totalInvestment,
      competitiveAdvantage, growthOpportunity,
    } = body;

    const prompt = `You are an expert business valuation analyst at MakeThisDeal, a global enterprise marketplace. Analyze and provide estimated valuations for the following business project:

PROJECT DETAILS:
- Name: ${name || 'N/A'}
- Category: ${category || 'N/A'}
- Industry: ${industry || 'N/A'}
- Country: ${country || 'N/A'}
- Business Stage: ${businessStage || 'N/A'}

FINANCIAL METRICS:
- Annual Revenue: $${(annualRevenue || 0).toLocaleString()}
- Monthly Revenue: $${(monthlyRevenue || 0).toLocaleString()}
- Net Profit: $${(netProfit || 0).toLocaleString()}
- EBITDA: $${(ebitda || 0).toLocaleString()}
- Total Investment: $${(totalInvestment || 0).toLocaleString()}

BUSINESS METRICS:
- Monthly Visitors: ${monthlyVisitors || 0}
- Registered Users: ${registeredUsers || 0}
- Customers: ${customers || 0}
- Subscribers: ${subscribers || 0}

TECHNOLOGY: ${technologyStack || 'N/A'}
COMPETITIVE ADVANTAGE: ${competitiveAdvantage || 'N/A'}
GROWTH OPPORTUNITY: ${growthOpportunity || 'N/A'}

Based on industry benchmarks, revenue multiples, market conditions, and asset values, provide a JSON response with these exact fields:
{
  "estimatedValue": <number - total estimated company worth>,
  "recommendedPrice": <number - suggested selling price (1.1x-1.3x estimated value)>,
  "investorPrice": <number - price attractive to investors (0.85x-0.95x estimated value)>,
  "wholesalePrice": <number - bulk/quick sale price (0.75x-0.85x estimated value)>,
  "acquisitionPrice": <number - strategic acquisition premium (1.2x-1.5x estimated value)>,
  "valuationDetails": "<string - 3-4 sentence explanation>",
  "confidenceScore": <number 1-10>,
  "keyFactors": ["<factor1>", "<factor2>", "<factor3>", "<factor4>", "<factor5>"]
}

Use realistic market multiples. Return ONLY the JSON, no other text.`;

    const ai = ZAI.create();
    const result = await ai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const responseText = result.choices?.[0]?.message?.content || '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse valuation response');
    }

    const valuation = JSON.parse(jsonMatch[0]);
    return NextResponse.json(valuation);
  } catch (error: any) {
    console.error('Valuation error:', error.message);
    // Fallback valuation
    const revenue = annualRevenue || 0;
    const fallback = {
      estimatedValue: revenue * 5 || 5000,
      recommendedPrice: revenue * 5.5 || 5500,
      investorPrice: revenue * 4.5 || 4500,
      wholesalePrice: revenue * 4 || 4000,
      acquisitionPrice: revenue * 6 || 6000,
      valuationDetails: 'Estimated using standard revenue multiple. AI valuation is temporarily unavailable.',
      confidenceScore: 5,
      keyFactors: ['Revenue-based estimation', 'Industry standard multiples', 'Market conditions'],
    };
    return NextResponse.json(fallback);
  }
}