import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuoteData } from "@/pages/Index";
import { Building2, Sparkles, Wrench, Plus } from "lucide-react";

interface QuoteFormProps {
  quoteData: QuoteData;
  setQuoteData: (data: QuoteData) => void;
}

const QuoteForm = ({ quoteData, setQuoteData }: QuoteFormProps) => {
  const updateField = (field: keyof QuoteData, value: any) => {
    setQuoteData({ ...quoteData, [field]: value });
  };

  const updateAppliance = (appliance: keyof QuoteData["appliances"], value: number) => {
    setQuoteData({
      ...quoteData,
      appliances: { ...quoteData.appliances, [appliance]: value },
    });
  };

  return (
    <div className="space-y-6">
      {/* Space Details */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Space Details</CardTitle>
          </div>
          <CardDescription>Basic information about the commercial space</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sqft">Square Footage</Label>
            <Input
              id="sqft"
              type="number"
              value={quoteData.sqft || ""}
              onChange={(e) => updateField("sqft", Number(e.target.value))}
              placeholder="e.g., 5000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="flooringType">Flooring Type</Label>
            <Select value={quoteData.flooringType} onValueChange={(v) => updateField("flooringType", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tile">Tile (standard) ($0.10/sqft)</SelectItem>
                <SelectItem value="rubber">Rubber ($0.16/sqft)</SelectItem>
                <SelectItem value="carpet">Carpet ($0.12/sqft)</SelectItem>
                <SelectItem value="hardwood">Hardwood ($0.10/sqft)</SelectItem>
                <SelectItem value="mixed">Multiple floor types ($0.15/sqft)</SelectItem>
                <SelectItem value="concrete">Concrete/warehouse/parkade ($0.10/sqft)</SelectItem>
                <SelectItem value="specialty">Specialty/Post-reno cleaning ($0.20/sqft)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bathroomType">Bathroom Type</Label>
              <Select value={quoteData.bathroomType} onValueChange={(v) => updateField("bathroomType", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard ($45 each)</SelectItem>
                  <SelectItem value="commercial">Commercial/Gym ($70 each)</SelectItem>
                  <SelectItem value="locker">Locker-room w/ showers ($100 each)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathroomCount">Number of Bathrooms</Label>
              <Input
                id="bathroomCount"
                type="number"
                value={quoteData.bathroomCount || ""}
                onChange={(e) => updateField("bathroomCount", Number(e.target.value))}
                placeholder="e.g., 3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buildingAge">Building Age</Label>
            <Select value={quoteData.buildingAge} onValueChange={(v) => updateField("buildingAge", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-5">0-5 years (no charge)</SelectItem>
                <SelectItem value="5-15">5-15 years (+$0.01/sqft)</SelectItem>
                <SelectItem value="15+">15+ years (+$0.03/sqft)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Factors */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            <CardTitle>Difficulty Factors</CardTitle>
          </div>
          <CardDescription>Conditions affecting cleaning complexity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="difficulty">Overall Difficulty Level</Label>
            <Select value={quoteData.difficulty} onValueChange={(v) => updateField("difficulty", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy (no charge)</SelectItem>
                <SelectItem value="difficult">Difficult (+$0.03/sqft)</SelectItem>
                <SelectItem value="extreme">Extreme (+$0.07/sqft)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="footTraffic">Daily Foot Traffic</Label>
            <Select value={quoteData.footTraffic} onValueChange={(v) => updateField("footTraffic", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low 0-50 (no charge)</SelectItem>
                <SelectItem value="medium">Medium 50-200 (+$0.01/sqft)</SelectItem>
                <SelectItem value="high">High 200+ (+$0.03/sqft)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="highAreasSqft">High-reach areas sqft (above 6ft)</Label>
            <Input
              id="highAreasSqft"
              type="number"
              value={quoteData.highAreasSqft || ""}
              onChange={(e) => updateField("highAreasSqft", Number(e.target.value))}
              placeholder="e.g., 500"
            />
            <p className="text-xs text-muted-foreground">Charge: $0.06/sqft on affected area</p>
          </div>

          <div className="space-y-2">
            <Label>Pet Hair Removal</Label>
            <RadioGroup value={quoteData.petHairOption} onValueChange={(v) => updateField("petHairOption", v)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="pet-none" />
                <Label htmlFor="pet-none" className="cursor-pointer font-normal">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="perSqft" id="pet-sqft" />
                <Label htmlFor="pet-sqft" className="cursor-pointer font-normal">Per sqft (+$0.03/sqft)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flat" id="pet-flat" />
                <Label htmlFor="pet-flat" className="cursor-pointer font-normal">Flat rate (+$50)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="furnitureAffectedSqft">Furniture/equipment to move (affected sqft)</Label>
            <Input
              id="furnitureAffectedSqft"
              type="number"
              value={quoteData.furnitureAffectedSqft || ""}
              onChange={(e) => updateField("furnitureAffectedSqft", Number(e.target.value))}
              placeholder="e.g., 1000"
            />
            <p className="text-xs text-muted-foreground">Charge: $0.04/sqft on affected area</p>
          </div>
        </CardContent>
      </Card>

      {/* Equipment & Appliances */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            <CardTitle>Equipment & Appliances</CardTitle>
          </div>
          <CardDescription>Items requiring special cleaning</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ovens">Ovens ($40 each)</Label>
              <Input
                id="ovens"
                type="number"
                value={quoteData.appliances.ovens || ""}
                onChange={(e) => updateAppliance("ovens", Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stoves">Stoves ($25 each)</Label>
              <Input
                id="stoves"
                type="number"
                value={quoteData.appliances.stoves || ""}
                onChange={(e) => updateAppliance("stoves", Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fryers">Fryers ($50 each)</Label>
              <Input
                id="fryers"
                type="number"
                value={quoteData.appliances.fryers || ""}
                onChange={(e) => updateAppliance("fryers", Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="walkInFridges">Walk-in Fridges ($80 each)</Label>
              <Input
                id="walkInFridges"
                type="number"
                value={quoteData.appliances.walkInFridges || ""}
                onChange={(e) => updateAppliance("walkInFridges", Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tvs">TVs ($5 each)</Label>
              <Input
                id="tvs"
                type="number"
                value={quoteData.appliances.tvs || ""}
                onChange={(e) => updateAppliance("tvs", Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lightFixtures">Light Fixtures ($2 each)</Label>
              <Input
                id="lightFixtures"
                type="number"
                value={quoteData.lightFixtures || ""}
                onChange={(e) => updateField("lightFixtures", Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Services */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-secondary" />
            <CardTitle>Additional Services</CardTitle>
          </div>
          <CardDescription>Extra services and add-ons</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trashBags">Trash Bags to Remove ($15 each)</Label>
              <Input
                id="trashBags"
                type="number"
                value={quoteData.trashBags || ""}
                onChange={(e) => updateField("trashBags", Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="soapDispensers">Soap Dispensers ($3 each)</Label>
              <Input
                id="soapDispensers"
                type="number"
                value={quoteData.soapDispensers || ""}
                onChange={(e) => updateField("soapDispensers", Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airFreshenerInstall">Air Freshener Install ($30 each)</Label>
              <Input
                id="airFreshenerInstall"
                type="number"
                value={quoteData.airFreshenerInstall || ""}
                onChange={(e) => updateField("airFreshenerInstall", Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="airFreshenerMaintenance">Air Freshener Maintenance ($15/mo each)</Label>
              <Input
                id="airFreshenerMaintenance"
                type="number"
                value={quoteData.airFreshenerMaintenance || ""}
                onChange={(e) => updateField("airFreshenerMaintenance", Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discounts */}
      <Card className="shadow-soft border-border border-success/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-success" />
            <CardTitle>Service Discounts</CardTitle>
          </div>
          <CardDescription>Apply discounts based on service frequency and size</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceFrequency">Service Frequency</Label>
            <Select value={quoteData.serviceFrequency} onValueChange={(v) => updateField("serviceFrequency", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One-time (0% discount)</SelectItem>
                <SelectItem value="monthly">Monthly (5% discount)</SelectItem>
                <SelectItem value="biweekly">Biweekly (10% discount)</SelectItem>
                <SelectItem value="weekly">Weekly (15% discount)</SelectItem>
                <SelectItem value="daily">Daily (20% discount)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
            <h4 className="text-sm font-medium mb-2 text-success">Area-based Discount (Automatic)</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 0-2,000 sqft: No discount</li>
              <li>• 2,000-10,000 sqft: 10% discount</li>
              <li>• 10,000-25,000 sqft: 15% discount</li>
              <li>• 25,000+ sqft: 20% discount</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteForm;
