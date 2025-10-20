import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { QuoteData } from "@/pages/Index";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { jsPDF } from "jspdf";
import { toast } from "@/hooks/use-toast";

interface QuoteSummaryProps {
  quoteData: QuoteData;
  setQuoteData: (data: QuoteData) => void;
}

const QuoteSummary = ({ quoteData, setQuoteData }: QuoteSummaryProps) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const costs = calculateCosts();
    
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Commercial Cleaning Quote", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 28, { align: "center" });
    
    // Space Details
    let yPos = 45;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Space Details", 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Square Footage: ${quoteData.sqft.toLocaleString()} sqft`, 20, yPos);
    yPos += 6;
    doc.text(`Flooring Type: ${quoteData.flooringType}`, 20, yPos);
    yPos += 6;
    doc.text(`Bathrooms: ${quoteData.bathroomCount} (${quoteData.bathroomType})`, 20, yPos);
    yPos += 6;
    doc.text(`Building Age: ${quoteData.buildingAge} years`, 20, yPos);
    yPos += 6;
    doc.text(`Service Frequency: ${quoteData.serviceFrequency}`, 20, yPos);
    yPos += 12;
    
    // Cost Breakdown
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Cost Breakdown", 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    Object.entries(costs.breakdown)
      .filter(([_, value]) => value > 0)
      .forEach(([key, value]) => {
        doc.text(key, 20, yPos);
        doc.text(`$${value.toFixed(2)}`, 180, yPos, { align: "right" });
        yPos += 6;
        
        // Add new page if needed
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      });
    
    yPos += 4;
    doc.line(20, yPos, 190, yPos);
    yPos += 8;
    
    // Subtotal and Discounts
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal", 20, yPos);
    doc.text(`$${costs.totalCost.toFixed(2)}`, 180, yPos, { align: "right" });
    yPos += 8;
    
    if (costs.serviceFrequencyDiscount > 0) {
      doc.setTextColor(34, 197, 94); // green
      doc.setFont("helvetica", "normal");
      doc.text("Service Frequency Discount", 20, yPos);
      doc.text(`-$${costs.serviceFrequencyDiscount.toFixed(2)}`, 180, yPos, { align: "right" });
      yPos += 6;
    }
    
    if (costs.areaDiscount > 0) {
      doc.setTextColor(34, 197, 94); // green
      doc.text("Area-based Discount", 20, yPos);
      doc.text(`-$${costs.areaDiscount.toFixed(2)}`, 180, yPos, { align: "right" });
      yPos += 6;
    }
    
    doc.setTextColor(0, 0, 0); // reset to black
    yPos += 2;
    doc.line(20, yPos, 190, yPos);
    yPos += 8;
    
    // Total after discounts
    doc.setFont("helvetica", "bold");
    doc.text("Total after Discounts", 20, yPos);
    doc.text(`$${costs.totalAfterDiscounts.toFixed(2)}`, 180, yPos, { align: "right" });
    yPos += 8;
    
    doc.setFont("helvetica", "normal");
    doc.text(`Margin (${quoteData.marginPercent}%)`, 20, yPos);
    doc.text(`+$${costs.margin.toFixed(2)}`, 180, yPos, { align: "right" });
    yPos += 8;
    
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    // Final Quote
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Final Quote", 20, yPos);
    doc.text(`$${costs.finalQuote.toFixed(2)}`, 180, yPos, { align: "right" });
    
    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for your business!", 105, 285, { align: "center" });
    
    // Save the PDF
    doc.save(`cleaning-quote-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "Quote Downloaded",
      description: "Your PDF quote has been downloaded successfully.",
    });
  };

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

    // Service frequency discount
    const serviceFrequencyDiscounts: Record<string, number> = {
      "one-time": 0,
      "monthly": 0.05,
      "biweekly": 0.10,
      "weekly": 0.15,
      "daily": 0.20,
    };
    const serviceFrequencyDiscount = totalCost * serviceFrequencyDiscounts[quoteData.serviceFrequency];

    // Area-based discount (automatic based on sqft)
    let areaDiscountPercent = 0;
    if (quoteData.sqft >= 25000) {
      areaDiscountPercent = 0.20;
    } else if (quoteData.sqft >= 10000) {
      areaDiscountPercent = 0.15;
    } else if (quoteData.sqft >= 2000) {
      areaDiscountPercent = 0.10;
    }
    const areaDiscount = totalCost * areaDiscountPercent;

    const totalAfterDiscounts = totalCost - serviceFrequencyDiscount - areaDiscount;
    const margin = totalAfterDiscounts * (quoteData.marginPercent / 100);
    const finalQuote = totalAfterDiscounts + margin;

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
      serviceFrequencyDiscount,
      areaDiscount,
      totalAfterDiscounts,
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
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-lg font-medium">${costs.totalCost.toFixed(2)}</span>
            </div>
            {costs.serviceFrequencyDiscount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-success">Service Frequency Discount</span>
                <span className="text-sm text-success">-${costs.serviceFrequencyDiscount.toFixed(2)}</span>
              </div>
            )}
            {costs.areaDiscount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-success">Area-based Discount</span>
                <span className="text-sm text-success">-${costs.areaDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-border/50">
              <span className="text-sm text-muted-foreground">Total after Discounts</span>
              <span className="text-lg font-medium">${costs.totalAfterDiscounts.toFixed(2)}</span>
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

          <Button className="w-full" size="lg" onClick={generatePDF}>
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
