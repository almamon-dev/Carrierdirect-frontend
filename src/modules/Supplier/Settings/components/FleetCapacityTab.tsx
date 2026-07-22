import React, { useState } from 'react';
import { Truck, MapPin, Scale, CheckCircle2, Shield } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function FleetCapacityTab() {
  const [isSaved, setIsSaved] = useState(false);
  const [adrCertified, setAdrCertified] = useState(true);

  const [equipmentTypes, setEquipmentTypes] = useState([
    { id: '1', name: 'Curtainsider 13.6m (Tautliner)', payload: '24 Tons', selected: true },
    { id: '2', name: 'Box Truck (Rigid 7.5T - 18T)', payload: '12 Tons', selected: true },
    { id: '3', name: 'Refrigerated Reefer (-25°C to +25°C)', payload: '22 Tons', selected: true },
    { id: '4', name: 'Flatbed / Low Loader', payload: '30 Tons', selected: false },
  ]);

  const toggleEquipment = (id: string) => {
    setEquipmentTypes(prev => prev.map(e => e.id === id ? { ...e, selected: !e.selected } : e));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-3.5 font-sans antialiased">
      
      {/* Service Routes & Coverage Regions */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <MapPin className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Operating Routes & Service Regions
          </CardTitle>
          <Badge className="bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
            3 Active Regions
          </Badge>
        </CardHeader>
        <CardContent className="p-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Cross-Border EU</span>
                <h4 className="text-xs font-semibold text-slate-900 mt-1">Germany ↔ Netherlands ↔ Belgium</h4>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">Express daily lane</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-[#ff4a1f] w-3.5 h-3.5 mt-0.5 cursor-pointer" />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">UK Domestic</span>
                <h4 className="text-xs font-semibold text-slate-900 mt-1">Greater London ↔ Midlands</h4>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">Next-day freight</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-[#ff4a1f] w-3.5 h-3.5 mt-0.5 cursor-pointer" />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Long-Haul EU</span>
                <h4 className="text-xs font-semibold text-slate-900 mt-1">Poland ↔ Germany ↔ France</h4>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">Full Truck Load (FTL)</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-[#ff4a1f] w-3.5 h-3.5 mt-0.5 cursor-pointer" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fleet Equipment Types Supported */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Truck className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Supported Fleet & Trailer Types
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {equipmentTypes.map((eq) => (
              <div
                key={eq.id}
                onClick={() => toggleEquipment(eq.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                  eq.selected 
                    ? 'bg-orange-50/60 border-[#ff4a1f] ring-1 ring-[#ff4a1f]/20' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className={`w-4 h-4 ${eq.selected ? 'text-[#ff4a1f]' : 'text-slate-500'}`} />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">{eq.name}</h4>
                    <p className="text-[10.5px] text-slate-500 font-normal">Max Payload: {eq.payload}</p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={eq.selected}
                  onChange={() => {}}
                  className="accent-[#ff4a1f] w-3.5 h-3.5 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weight & Volume Limits */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Scale className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Operating Weight & Volume Capacity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Min Payload Weight (Kg)"
              defaultValue="500"
            />

            <Input
              label="Max Payload Weight (Tons) *"
              defaultValue="24.0"
              required
            />

            <Input
              label="Max Volume Capacity (m³) *"
              defaultValue="90.0"
              required
            />
          </div>

          <div className="pt-0.5">
            <label className="flex items-center gap-2.5 p-2.5 bg-orange-50/60 rounded-lg border border-orange-200/80 cursor-pointer">
              <input
                type="checkbox"
                checked={adrCertified}
                onChange={() => setAdrCertified(!adrCertified)}
                className="accent-[#ff4a1f] w-3.5 h-3.5 cursor-pointer"
              />
              <div>
                <span className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#ff4a1f]" />
                  ADR Dangerous Goods Certified
                </span>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  Enables chemical & hazardous freight requests.
                </p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Form Action Footer */}
      <div className="flex items-center justify-between pt-1">
        {isSaved ? (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Fleet specs saved
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-normal">Automated quote requests match your fleet specs.</span>
        )}

        <Button
          type="submit"
          variant="primary"
          className="h-8 text-xs px-5 bg-[#ff4a1f] hover:bg-[#e63d15] font-semibold text-white shadow-2xs cursor-pointer rounded-md"
        >
          Save Fleet Specs
        </Button>
      </div>

    </form>
  );
}
