import React, { useState } from 'react';
import { Building2, Upload, MapPin, ShieldCheck, FileText, CheckCircle2, Paperclip, Eye, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function CompanyProfileTab() {
  const [isSaved, setIsSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [documents, setDocuments] = useState([
    {
      id: 'doc-1',
      title: 'EU Transport / Carrier Operating License',
      fileName: 'EU_Carrier_License_PMLG_2026.pdf',
      fileSize: '2.4 MB',
      uploadDate: '12 Jan 2026',
      expiryDate: '31 Dec 2027',
      status: 'Verified',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'doc-2',
      title: 'CMR Freight Liability Insurance Policy (€2.5M Coverage)',
      fileName: 'CMR_Insurance_Policy_2026.pdf',
      fileSize: '4.1 MB',
      uploadDate: '14 Jan 2026',
      expiryDate: '15 Aug 2026',
      status: 'Verified',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'doc-3',
      title: 'Commercial Register Excerpt (Handelsregister HRB-883921)',
      fileName: 'Handelsregister_Auszug_Berlin.pdf',
      fileSize: '1.8 MB',
      uploadDate: '10 Jan 2026',
      expiryDate: 'Permanent',
      status: 'Verified',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'doc-4',
      title: 'VAT / Tax Registration Certificate (DE309281923)',
      fileName: 'VAT_Certificate_DE309281923.pdf',
      fileSize: '1.2 MB',
      uploadDate: '10 Jan 2026',
      expiryDate: 'Permanent',
      status: 'Verified',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFileUpload = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments(prev => prev.map(doc => doc.id === docId ? {
        ...doc,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: 'Just now',
        status: 'Under Review',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      } : doc));
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-3.5 font-sans antialiased">
      
      {/* Verified Carrier Status */}
      <div className="bg-orange-50/60 border border-orange-200/80 p-3 rounded-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4.5 h-4.5 text-[#ff4a1f] shrink-0" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-900">Verified Freight Carrier</span>
            <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
              Tier 1 Active
            </Badge>
          </div>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">DOT/MC Carrier License Verified</span>
      </div>

      {/* Basic Company Identity */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Building2 className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Company Identity & Branding
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5 space-y-3">
          <div className="flex items-center gap-4">
            <div className="relative group shrink-0">
              <div className="w-14 h-14 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-[#ff4a1f]">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 group-hover:text-[#ff4a1f]">
                    <Upload className="w-4 h-4" />
                    <span className="text-[9px] font-medium mt-0.5">Logo</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                title="Upload logo"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-800">Company Logo</p>
              <p className="text-[11px] text-slate-500 font-normal">Shown on proposals and invoices (PNG or JPG).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Input
              label="Legal Business Name *"
              defaultValue="Prime Logistics & Freight GmbH"
              required
            />

            <Input
              label="Operating Name / DBA"
              defaultValue="Prime Movers Express"
            />

            <Input
              label="Tax / VAT Registration ID *"
              defaultValue="DE309281923"
              required
            />

            <Input
              label="Business Registration No. *"
              defaultValue="HRB-883921"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Logistics Accreditation & Credentials */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <FileText className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Carrier Accreditation & Licenses
          </CardTitle>
          <Badge className="bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
            Verified
          </Badge>
        </CardHeader>
        <CardContent className="p-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="USDOT / EU Transport Reg No."
              defaultValue="DOT-389102"
            />

            <Input
              label="MC / Carrier License No."
              defaultValue="MC-998231"
            />

            <Input
              label="SCAC Code"
              defaultValue="PMLG"
            />
          </div>
        </CardContent>
      </Card>

      {/* Registration Uploaded Documents Section */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <Paperclip className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Registration Documents & Verification Files
          </CardTitle>
          <span className="text-[11px] text-slate-500 font-normal">Uploaded during onboarding</span>
        </CardHeader>
        <CardContent className="p-3.5 space-y-2.5">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 mt-0.5 sm:mt-0">
                  <FileText className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-slate-800">{doc.title}</h4>
                    <Badge className={`text-[9.5px] font-semibold border ${doc.badgeColor}`}>
                      {doc.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                    {doc.fileName} • {doc.fileSize} • Uploaded: {doc.uploadDate} • Exp: {doc.expiryDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <a
                  href={`#view-${doc.id}`}
                  onClick={(e) => { e.preventDefault(); alert(`Viewing ${doc.fileName}`); }}
                  className="h-7 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium rounded shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3 text-slate-500" />
                  <span>View</span>
                </a>

                <label className="h-7 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium rounded shadow-2xs transition-colors flex items-center gap-1 cursor-pointer">
                  <RefreshCw className="w-3 h-3 text-slate-500" />
                  <span>Update</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleFileUpload(doc.id, e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact & Headquarters Info */}
      <Card className="shadow-2xs border-slate-200">
        <CardHeader className="py-2.5 px-3.5 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
            <MapPin className="w-3.5 h-3.5 text-[#ff4a1f]" />
            Headquarters & Dispatch Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Dispatch Contact Person *"
              defaultValue="Marcus Vance (Head of Dispatch)"
              required
            />

            <Input
              label="Primary Dispatch Email *"
              type="email"
              defaultValue="dispatch@primemovers.eu"
              required
            />

            <Input
              label="Dispatch Phone / Hotline *"
              defaultValue="+49 30 9823 4810"
              required
            />

            <Input
              label="Official Website"
              defaultValue="https://primemovers.eu"
            />

            <div className="sm:col-span-2">
              <Input
                label="Headquarters Depot Address *"
                defaultValue="Logistikpark 14, Industrial Hub West, 10115 Berlin, Germany"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Action Footer */}
      <div className="flex items-center justify-between pt-1">
        {isSaved ? (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved successfully
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-normal">Changes apply to future quote requests.</span>
        )}

        <Button
          type="submit"
          variant="primary"
          className="h-8 text-xs px-5 bg-[#ff4a1f] hover:bg-[#e63d15] font-semibold text-white shadow-2xs cursor-pointer rounded-md"
        >
          Save Profile
        </Button>
      </div>

    </form>
  );
}
