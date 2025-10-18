import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { QuoteData } from "@/pages/Index";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuoteSummaryProps {
  quoteData: QuoteData;
  setQuoteData: (data: QuoteData) => void;
}

const QuoteSummary = ({ quoteData, setQuoteData }: QuoteSummaryProps) => {
  const calculateCosts = () => {
    // Floor rates based on type
    const floorRates: Record<string, number> = {
      tile: 0.10,
      rubber: 0.16,
      carpet: 0.12,
      hardwood: 0.10,
      mixed: 0.15,
      concrete: 0.10,
      specialty: 0.20,
    };
    const floorCost = quoteData.sqft * floorRates[quoteData.flooringType];

    // Bathroom costs
    const bathroomRates: Record<string, number> = {
      standard: 45,
      commercial: 70,
      locker: 100,
    };
    const bathroomCost = quoteData.bathroomCount * bathroomRates[quoteData.bathroomType];

    // Building age adder (per sqft)
    const buildingAgeAdders: Record<string, number> = {
      "0-5": 0,
      "5-15": 0.01,
      "15+": 0.03,
    };
    const buildingAgeCost = quoteData.sqft * buildingAgeAdders[quoteData.buildingAge];

    // Difficulty adder (per sqft)
    const difficultyAdders: Record<string, number> = {
      easy: 0,
      difficult: 0.03,
      extreme: 0.07,
    };
    const difficultyCost = quoteData.sqft * difficultyAdders[quoteData.difficulty];

    // Foot traffic adder (per sqft)
    const footTrafficAdders: Record<string, number> = {
      low: 0,
      medium: 0.01,
      high: 0.03,
    };
    const footTrafficCost = quoteData.sqft * footTrafficAdders[quoteData.footTraffic];

    // High-reach areas (per affected sqft)
    const highAreasCost = quoteData.highAreasSqft * 0.06;

    // Pet hair removal
    let petHairCost = 0;
    if (quoteData.petHairOption === "perSqft") {
      petHairCost = quoteData.sqft * 0.03;
    } else if (quoteData.petHairOption === "flat") {
      petHairCost = 50;
    }

    // Furniture/equipment move (per affected sqft)
    const furnitureCost = quoteData.furnitureAffectedSqft * 0.04;

    // Appliances
    const ovensCost = quoteData.appliances.ovens * 40;
    const stovesCost = quoteData.appliances.stoves * 25;
    const fryersCost = quoteData.appliances.fryers * 50;
    const walkInFridgesCost = quoteData.appliances.walkInFridges * 80;
    const tvsCost = quoteData.appliances.tvs * 5;
    const appliancesTotalCost = ovensCost + stovesCost + fryersCost + walkInFridgesCost + tvsCost;

    // Light fixtures
    const lightFixtureCost = quoteData.lightFixtures * 2;

    // Additional services
    const trashCost = quoteData.trashBags * 15;
    const soapCost = quoteData.soapDispensers * 3;
    const airFreshenerInstallCost = quoteData.airFreshenerInstall * 30;
    const airFreshenerMaintenanceCost = quoteData.airFreshenerMaintenance * 15;

    const totalCost =
      floorCost +
      bathroomCost +
      buildingAgeCost +
      difficultyCost +
      footTrafficCost +
      highAreasCost +
      petHairCost +
      furnitureCost +
      appliancesTotalCost +
      lightFixtureCost +
      trashCost +
      soapCost +
      airFreshenerInstallCost +
      airFreshenerMaintenanceCost;

    const margin = totalCost * (quoteData.marginPercent / 100);
    const finalQuote = totalCost + margin;

    return {
      breakdown: {
        "Floor Cleaning": floorCost,
        "Bathrooms": bathroomCost,
        "Building Age": buildingAgeCost,
        "Difficulty": difficultyCost,
        "Foot Traffic": footTrafficCost,
        "High-reach Areas": highAreasCost,
        "Pet Hair Removal": petHairCost,
        "Furniture Moving": furnitureCost,
        "Ovens": ovensCost,
        "Stoves": stovesCost,
        "Fryers": fryersCost,
        "Walk-in Fridges": walkInFridgesCost,
        "TVs": tvsCost,
        "Light Fixtures": lightFixtureCost,
        "Trash Removal": trashCost,
        "Soap Dispensers": soapCost,
        "Air Freshener Install": airFreshenerInstallCost,
        "Air Freshener Maintenance": airFreshenerMaintenanceCost,
      },
      totalCost,
      margin,
      finalQuote,
    };
  };

  const costs = calculateCosts();

  return (
    <div className="space-y-6 lg:sticky lg:top-6">
      {/* Quote Total */}
      <Card className="shadow-medium border-2 border-primary/20 bg-gradient-to-br from-card to-accent/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">Quote Summary</CardTitle>
              <CardDescription>Your professional cleaning estimate</CardDescription>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Cost</span>
              <span className="text-lg font-medium">${costs.totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Margin ({quoteData.marginPercent}%)</span>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                +${costs.margin.toFixed(2)}
              </Badge>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Final Quote</span>
              <span className="text-3xl font-bold text-primary">${costs.finalQuote.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <Label className="text-sm font-medium">Adjust Profit Margin</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[quoteData.marginPercent]}
                onValueChange={(value) =>
                  setQuoteData({ ...quoteData, marginPercent: value[0] })
                }
                min={20}
                max={60}
                step={5}
                className="flex-1"
              />
              <span className="text-lg font-semibold min-w-[60px] text-right">{quoteData.marginPercent}%</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>20%</span>
              <span>Recommended: 30-40%</span>
              <span>60%</span>
            </div>
          </div>

          <Button className="w-full" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Download Quote
          </Button>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
          <CardDescription>Detailed pricing components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(costs.breakdown)
              .filter(([_, value]) => value > 0)
              .map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{key}</span>
                  <span className="font-medium">${value.toFixed(2)}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteSummary;
