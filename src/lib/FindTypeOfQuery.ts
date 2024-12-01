export const routeQuery = (userQuery: string): Number => {

  const propertyKeywords: string[] = [
   "sr nagar", "banjara hills", "chanda nagar", "attapur", "kondapur",
    "madhapur", "mehdipatnam", "kukatpally", "manikonda", "lb nagar",
    "near", "close to", "proximity", "surrounding", "vicinity", "nearby",
    "school", "schools", "park", "parks", "hospital", "market", "mall", "restaurant",
    "shopping", "station", "office", "metro", "bus stop", "airport",
    "property", "properties", "apartment", "villa", "house", "flat", "bungalow", "condo",
    "bedrooms", "bathrooms", "kitchen", "hall", "sqft", "square feet", "area", "size",
    "price", "rent", "cost", "per month", "inr", "pool", "gym", "parking", "garden", "balcony",
    "available", "for sale", "for rent", "sold", "leased", "buy", "sell"
  ];


  const faqKeywords: string[] = [
   "how", "what", "why", "when", "who", "does", "is",
    "policy", "payment", "installment", "loan", "emi", "mortgage",
    "refund", "deposit", "lease", "agreement", "contract",
    "process", "procedure", "apply", "eligibility", "criteria",
    "documents", "requirement", "duration", "timeline", "fee",
    "maintenance", "rules", "regulations", "guidelines", "support",
    "contact", "customer care", "help", "service",
    "average cost", "average price", "price per square foot", "cost per square foot",
    "price range", "cost estimate", "price estimate", "average rental", "monthly rent",
    "cost per unit", "rate per square foot", "price estimation"
  ];


  function calculateQueryScores(query: string): { propertyScore: number, faqScore: number } {
    
    const queryLower = query.toLowerCase();

    // Calculate property score
    const propertyScore = propertyKeywords.reduce((score, keyword) => {
        if (queryLower.includes(keyword)) {
            score += 1;
        }
        return score;
    }, 0);

    // Calculate FAQ score
    const faqScore = faqKeywords.reduce((score, keyword) => {
        if (queryLower.includes(keyword)) {
            score += 1;
        }
        return score;
    }, 0);

    return { propertyScore, faqScore };
}

function classifyQueryByScore(query: string): Number {
  const { propertyScore, faqScore } = calculateQueryScores(query);

  console.log(`Property Score: ${propertyScore}`);
  console.log(`FAQ Score: ${faqScore}`);

  if (propertyScore > faqScore) {
      return 0;
  } else if (faqScore > propertyScore) {
      return 1;
  } else {
      return 1;
  }
}
 
  const classification = classifyQueryByScore(userQuery);
  return classification
};

 
// const failed_to_classify= ["How much advance rent should I pay for a 2BHK apartment?",
// "What are the main factors that affect property prices in Hyderabad?",
// "What schools are near the Manikonda area?"]