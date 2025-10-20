import { useState } from "react";
import QuoteForm from "@/components/QuoteForm";
import QuoteSummary from "@/components/QuoteSummary";
import { Sparkles } from "lucide-react";

export interface QuoteData {
  quoterName: string;
  sqft: number;
  bathroomType: string;
  bathroomCount: number;
  difficulty: string;
  footTraffic: string;
  furnitureAffectedSqft: number;
  appliances: {
    ovens: number;
    stoves: number;
    fryers: number;
    walkInFridges: number;
    tvs: number;
  };
  lightFixtures: number;
  trashBags: number;
  soapDispensers: number;
  flooringType: string;
  highAreasSqft: number;
  buildingAge: string;
  petHairOption: string; // "none", "perSqft", "flat"
  airFreshenerInstall: number;
  airFreshenerMaintenance: number;
  marginPercent: number;
  serviceFrequency: string; // "one-time", "monthly", "biweekly", "weekly", "daily"
}

const Index = () => {
  const [quoteData, setQuoteData] = useState<QuoteData>({
    quoterName: "",
    sqft: 0,
    bathroomType: "standard",
    bathroomCount: 0,
    difficulty: "easy",
    footTraffic: "low",
    furnitureAffectedSqft: 0,
    appliances: {
      ovens: 0,
      stoves: 0,
      fryers: 0,
      walkInFridges: 0,
      tvs: 0,
    },
    lightFixtures: 0,
    trashBags: 0,
    soapDispensers: 0,
    flooringType: "tile",
    highAreasSqft: 0,
    buildingAge: "0-5",
    petHairOption: "none",
    airFreshenerInstall: 0,
    airFreshenerMaintenance: 0,
    marginPercent: 35,
    serviceFrequency: "one-time",
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Commercial Cleaning Quote Calculator
              </h1>
              <p className="text-sm text-muted-foreground">
                Professional standardized quoting system
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          <QuoteForm quoteData={quoteData} setQuoteData={setQuoteData} />
          <QuoteSummary quoteData={quoteData} setQuoteData={setQuoteData} />
        </div>
      </main>
    </div>
  );
};

export default Index;
