import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ArrowLeft, MapPin, Truck, Phone, Mail, Clock, ShieldCheck, 
    FileText, Download, CheckCircle2, Navigation, AlertTriangle, 
    Upload, User, ExternalLink, RefreshCw, Check
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import FormLabel from '@/components/ui/label';
import { getSupplierOrderBySlug, SupplierOrder, OrderStatus } from '../data/ordersData';

export default function OrderDetails() {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug?: string }>();

    const [order, setOrder] = useState<SupplierOrder>(() => getSupplierOrderBySlug(slug));
    const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
    const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
    const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
    const [podUploaded, setPodUploaded] = useState<boolean>(order.podStatus === 'Approved' || order.podStatus === 'Pending Review');

    useEffect(() => {
        const data = getSupplierOrderBySlug(slug);
        setOrder(data);
        setCurrentStatus(data.status);
        setNewStatus(data.status);
        setPodUploaded(data.podStatus === 'Approved' || data.podStatus === 'Pending Review');
    }, [slug]);

    const handleStatusUpdate = () => {
        setCurrentStatus(newStatus);
        setShowStatusModal(false);
    };

    const handleUploadPOD = (e: React.FormEvent) => {
        e.preventDefault();
        setPodUploaded(true);
        setShowUploadModal(false);
    };

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-6">
            {/* Header & Quick Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                    <button 
                        onClick={() => navigate('/supplier/orders/active-jobs')} 
                        className="text-xs text-slate-500 hover:text-slate-900 flex items-center transition-colors font-medium mb-1"
                    >
                        <ArrowLeft size={13} className="mr-1" /> Back to Active Jobs
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            Order Details: {order.id}
                        </h1>
                        <Badge 
                            variant="secondary" 
                            className={
                                currentStatus === 'In Transit' ? 'bg-blue-50 text-blue-700 font-semibold' :
                                currentStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700 font-semibold' :
                                currentStatus === 'Scheduled' ? 'bg-amber-50 text-amber-700 font-semibold' :
                                'bg-slate-100 text-slate-700 font-semibold'
                            }
                        >
                            {currentStatus}
                        </Badge>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 text-xs font-semibold"
                        onClick={() => alert(`Downloading Invoice & Specs for ${order.id}...`)}
                    >
                        <Download size={13} className="mr-1.5" /> PDF Invoice
                    </Button>

                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 text-xs font-semibold"
                        onClick={() => setShowUploadModal(true)}
                    >
                        <Upload size={13} className="mr-1.5" /> Upload POD
                    </Button>

                    <Button 
                        variant="primary" 
                        size="sm" 
                        className="h-9 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white"
                        onClick={() => setShowStatusModal(true)}
                    >
                        <RefreshCw size={13} className="mr-1.5" /> Update Status
                    </Button>
                </div>
            </div>

            {/* Top Overview Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Customer */}
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2">
                    <span className="text-xs text-slate-500 font-medium block">Customer Information</span>
                    <h4 className="text-sm font-bold text-slate-900">{order.customer}</h4>
                    <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-slate-400" />
                            <span>{order.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Mail size={12} className="text-slate-400" />
                            <span className="truncate">{order.customerEmail}</span>
                        </div>
                    </div>
                </div>

                {/* Assigned Driver & Vehicle */}
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2">
                    <span className="text-xs text-slate-500 font-medium block">Assigned Fleet & Driver</span>
                    <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-500" />
                        <h4 className="text-sm font-bold text-slate-900">{order.driver}</h4>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                            <Truck size={12} className="text-slate-400" />
                            <span>{order.vehicle} ({order.vehiclePlate})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-slate-400" />
                            <span>{order.driverPhone}</span>
                        </div>
                    </div>
                </div>

                {/* Route Summary */}
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2">
                    <span className="text-xs text-slate-500 font-medium block">Route Distance & Time</span>
                    <div className="flex items-center gap-2">
                        <Navigation size={14} className="text-slate-500" />
                        <h4 className="text-sm font-bold text-slate-900">{order.pickup} → {order.delivery}</h4>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                        <p className="flex justify-between"><span>Distance:</span> <strong className="text-slate-800">{order.distance}</strong></p>
                        <p className="flex justify-between"><span>Est. Duration:</span> <strong className="text-slate-800">{order.estimatedDuration}</strong></p>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2">
                    <span className="text-xs text-slate-500 font-medium block">Payout Summary</span>
                    <h4 className="text-base font-extrabold text-emerald-700">{order.netPayout}</h4>
                    <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                        <p className="flex justify-between"><span>Agreed Price:</span> <span className="font-semibold">{order.agreedPrice}</span></p>
                        <p className="flex justify-between"><span>Platform Fee (5%):</span> <span className="text-slate-400">{order.platformFee}</span></p>
                    </div>
                </div>
            </div>

            {/* Live Status Tracking Progress Stepper */}
            <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                    <Clock size={16} className="text-slate-600" /> Shipment Timeline & Progress
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {order.timeline.map((step, idx) => (
                        <div key={idx} className="relative flex items-start gap-4">
                            <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                step.completed ? 'bg-emerald-600 text-white' :
                                step.current ? 'bg-[#ff4a1f] text-white ring-4 ring-[#ff4a1f]/20' :
                                'bg-slate-200 text-slate-500'
                            }`}>
                                {step.completed ? <Check size={12} /> : idx + 1}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h4 className={`text-sm font-bold ${step.current ? 'text-[#ff4a1f]' : 'text-slate-900'}`}>
                                        {step.title}
                                    </h4>
                                    <span className="text-xs text-slate-500 font-medium">{step.timestamp}</span>
                                </div>
                                <p className="text-xs text-slate-600 mt-0.5">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Route Details & Proof of Delivery Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Pickup & Delivery Cards (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-2xs">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">Location Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Pickup Box */}
                            <div className="p-4 rounded-md border border-slate-200 bg-slate-50/60 space-y-2">
                                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                        <MapPin size={14} className="text-slate-600" /> Pickup Point
                                    </span>
                                    <span className="text-xs text-slate-500">{order.pickupDate}</span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900">{order.pickup}</h4>
                                <p className="text-xs text-slate-600 leading-snug">{order.pickupFullAddress}</p>
                                <p className="text-xs text-slate-500 pt-1">Time Slot: <strong className="text-slate-700">{order.pickupTimeWindow}</strong></p>
                            </div>

                            {/* Delivery Box */}
                            <div className="p-4 rounded-md border border-slate-200 bg-slate-50/60 space-y-2">
                                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                        <MapPin size={14} className="text-slate-600" /> Delivery Destination
                                    </span>
                                    <span className="text-xs text-slate-500">{order.deliveryDate}</span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900">{order.delivery}</h4>
                                <p className="text-xs text-slate-600 leading-snug">{order.deliveryFullAddress}</p>
                                <p className="text-xs text-slate-500 pt-1">Time Slot: <strong className="text-slate-700">{order.deliveryTimeWindow}</strong></p>
                            </div>
                        </div>
                    </div>

                    {/* Cargo Specs Box */}
                    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-2xs">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">Cargo Specification</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                                <span className="text-slate-500 font-medium block">Load Type</span>
                                <span className="font-bold text-slate-900 mt-0.5 block text-xs">{order.loadType}</span>
                            </div>
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                                <span className="text-slate-500 font-medium block">Weight</span>
                                <span className="font-bold text-slate-900 mt-0.5 block text-xs">{order.weight}</span>
                            </div>
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                                <span className="text-slate-500 font-medium block">Volume</span>
                                <span className="font-bold text-slate-900 mt-0.5 block text-xs">{order.volume}</span>
                            </div>
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                                <span className="text-slate-500 font-medium block">Cargo Items</span>
                                <span className="font-bold text-slate-900 mt-0.5 block text-xs">{order.cargoItemsCount} Units</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Proof of Delivery (POD) (5 cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <h3 className="text-sm font-bold text-slate-900">Proof of Delivery (POD)</h3>
                        <Badge 
                            variant="secondary" 
                            className={
                                podUploaded ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'bg-amber-50 text-amber-700 font-semibold'
                            }
                        >
                            {podUploaded ? 'POD Attached' : 'Pending POD'}
                        </Badge>
                    </div>

                    {podUploaded ? (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-md">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900">Signed_POD_{order.id}.pdf</h4>
                                    <p className="text-[11px] text-slate-500">{order.podUploadDate || 'Uploaded recently'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-slate-200">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 text-xs h-8"
                                    onClick={() => alert(`Downloading POD for ${order.id}...`)}
                                >
                                    <Download size={13} className="mr-1" /> View POD
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex-1 text-xs h-8"
                                    onClick={() => setShowUploadModal(true)}
                                >
                                    Re-upload
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 border-2 border-dashed border-slate-200 rounded-md text-center space-y-3">
                            <Upload size={28} className="mx-auto text-slate-400" />
                            <div>
                                <h4 className="text-xs font-bold text-slate-800">No Proof of Delivery Attached</h4>
                                <p className="text-[11px] text-slate-500 mt-0.5">Upload recipient signature or delivery slip once complete.</p>
                            </div>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                className="text-xs bg-[#ff4a1f] hover:bg-[#e03e15] text-white"
                                onClick={() => setShowUploadModal(true)}
                            >
                                <Upload size={13} className="mr-1.5" /> Upload Document
                            </Button>
                        </div>
                    )}

                    {/* Driver Contact Actions */}
                    <div className="pt-3 border-t border-slate-200 space-y-2">
                        <span className="text-xs font-bold text-slate-800 block">Quick Driver Contact</span>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 text-xs h-8 text-slate-700"
                                onClick={() => alert(`Calling driver ${order.driver} at ${order.driverPhone}...`)}
                            >
                                <Phone size={13} className="mr-1 text-slate-500" /> Call Driver
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 text-xs h-8 text-slate-700"
                                onClick={() => navigate('/supplier/orders/active-jobs')}
                            >
                                Track GPS
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Status Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 border border-slate-200 shadow-md space-y-4">
                        <h3 className="text-sm font-bold text-slate-900">Update Order Status ({order.id})</h3>
                        <div>
                            <FormLabel className="text-xs">Current Status</FormLabel>
                            <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value as OrderStatus)} showSearch={false} className="text-xs">
                                <option value="Scheduled">Scheduled</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Arrived">Arrived at Destination</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Delayed">Delayed</option>
                            </Select>
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                            <Button variant="outline" size="sm" onClick={() => setShowStatusModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" size="sm" className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white" onClick={handleStatusUpdate}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload POD Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleUploadPOD} className="bg-white rounded-lg max-w-md w-full p-6 border border-slate-200 shadow-md space-y-4">
                        <h3 className="text-sm font-bold text-slate-900">Upload Proof of Delivery</h3>
                        <p className="text-xs text-slate-500">Upload signed delivery note or receipt (PDF, PNG, JPG max 5MB).</p>
                        <input type="file" className="text-xs border border-slate-200 rounded p-2 w-full" required />
                        <div className="flex gap-2 justify-end pt-2">
                            <Button variant="outline" size="sm" type="button" onClick={() => setShowUploadModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                Confirm & Upload
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
