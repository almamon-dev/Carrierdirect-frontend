import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Star, Home, Warehouse, Globe } from 'lucide-react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

interface AddressItem {
  id: string;
  label: string;
  isDefault: boolean;
  street: string;
  city: string;
  province: string;
  postcode: string;
  country: string;
}

const defaultAddresses: AddressItem[] = [
  {
    id: '1',
    label: 'Home Address',
    isDefault: true,
    street: '142 Oxford Street, Suite 4B',
    city: 'London',
    province: 'Greater London',
    postcode: 'W1D 1LU',
    country: 'United Kingdom'
  },
  {
    id: '2',
    label: 'Main Warehouse',
    isDefault: false,
    street: 'Unit 8, Kingsland Trading Estate',
    city: 'Manchester',
    province: 'Greater Manchester',
    postcode: 'M1 2WD',
    country: 'United Kingdom'
  }
];

export default function AddressBookTab() {
  const [addresses, setAddresses] = useState<AddressItem[]>(() => {
    try {
      const saved = localStorage.getItem('customer_saved_addresses');
      return saved ? JSON.parse(saved) : defaultAddresses;
    } catch {
      return defaultAddresses;
    }
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<AddressItem, 'id' | 'isDefault'>>({
    label: '',
    street: '',
    city: '',
    province: '',
    postcode: '',
    country: 'United Kingdom'
  });

  const countryOptions = [
    { id: 'United Kingdom', name: 'United Kingdom' },
    { id: 'Ireland', name: 'Ireland' },
    { id: 'France', name: 'France' },
    { id: 'Germany', name: 'Germany' },
    { id: 'Netherlands', name: 'Netherlands' },
    { id: 'United States', name: 'United States' },
  ];

  const saveToStorage = (list: AddressItem[]) => {
    setAddresses(list);
    localStorage.setItem('customer_saved_addresses', JSON.stringify(list));
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    saveToStorage(updated);
  };

  const handleDelete = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    saveToStorage(updated);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = addresses.map(a => a.id === editingId ? { ...a, ...formData } : a);
      saveToStorage(updated);
      setEditingId(null);
    } else {
      const newAddr: AddressItem = {
        id: Date.now().toString(),
        isDefault: addresses.length === 0,
        ...formData
      };
      saveToStorage([...addresses, newAddr]);
      setIsAdding(false);
    }
    setFormData({ label: '', street: '', city: '', province: '', postcode: '', country: 'United Kingdom' });
  };

  const startEdit = (item: AddressItem) => {
    setFormData({
      label: item.label,
      street: item.street,
      city: item.city,
      province: item.province,
      postcode: item.postcode,
      country: item.country
    });
    setEditingId(item.id);
    setIsAdding(true);
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ label: '', street: '', city: '', province: '', postcode: '', country: 'United Kingdom' });
  };

  return (
    <div className="space-y-4">
      
      {/* Compact Top Bar */}
      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Saved Address Book</h3>
          <p className="text-xs text-slate-500">Save pickup and delivery locations for 1-click quote requests.</p>
        </div>

        {!isAdding && (
          <button
            onClick={() => { setIsAdding(true); setEditingId(null); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs rounded-md shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Location
          </button>
        )}
      </div>

      {/* Add / Edit Form Card */}
      {isAdding && (
        <form onSubmit={handleSaveAddress} className="bg-white p-4 sm:p-5 rounded-md border border-orange-200 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-slate-700">
              {editingId ? 'Edit Address Details' : 'Add New Location'}
            </h4>
            <span className="text-[11px] font-semibold text-slate-500">
              <span className="text-red-500 font-bold">*</span> All fields required
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <Input
                label="Address Label / Name *"
                type="text"
                placeholder="e.g. Home, Main Warehouse, Storage Unit"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Street Address *"
                type="text"
                placeholder="142 Oxford Street, Suite 4B"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required
              />
            </div>

            <Input
              label="City / Town *"
              type="text"
              placeholder="London"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />

            <Input
              label="State / Province / County *"
              type="text"
              placeholder="Greater London"
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              required
            />

            <Input
              label="Postcode / ZIP Code *"
              type="text"
              placeholder="W1D 1LU"
              value={formData.postcode}
              onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
              required
            />

            <div className="flex flex-col gap-1">
              <label className="text-[14px] font-bold text-[#202223]">
                Country <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <Select
                value={formData.country}
                onChange={(opt) => setFormData({ ...formData, country: typeof opt === 'object' ? opt.id : opt })}
                options={countryOptions}
                icon={Globe}
                showSearch={false}
                placeholder="Select country..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={cancelForm}
              className="h-9 px-4 rounded-md border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-5 rounded-md bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              {editingId ? 'Save Changes' : 'Add Location'}
            </button>
          </div>
        </form>
      )}

      {/* Compact Address List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((item) => (
          <div
            key={item.id}
            className={`bg-white p-4 rounded-md border transition-all flex flex-col justify-between ${
              item.isDefault ? 'border-[#ff4a1f] shadow-sm' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-orange-100 text-[#ff4a1f] flex items-center justify-center">
                    {item.label.toLowerCase().includes('home') ? <Home className="w-3.5 h-3.5" /> : <Warehouse className="w-3.5 h-3.5" />}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.label}</h4>
                </div>
                
                {item.isDefault && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-[#ff4a1f] text-[10px] font-bold rounded-md border border-orange-200">
                    <Star className="w-3 h-3 fill-current" /> Default
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-600 space-y-0.5 pl-1">
                <p className="font-medium">{item.street}</p>
                <p>{item.city}, {item.province} {item.postcode}</p>
                <p className="font-semibold text-slate-400">{item.country}</p>
              </div>
            </div>

            {/* Compact Action Footer */}
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
              {!item.isDefault ? (
                <button
                  onClick={() => handleSetDefault(item.id)}
                  className="text-xs font-bold text-slate-500 hover:text-[#ff4a1f] transition-colors cursor-pointer"
                >
                  Set as Default
                </button>
              ) : <span />}

              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(item)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Edit address"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete address"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
