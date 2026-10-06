import { TOKEN_CONFIG } from '@/config/auth';
import apiClient from "@/lib/axios";
import { initialDriverProfile } from "../Profile/data/profileData";
import { initialDashboardMetrics, activeTripSummary, telemetryData } from "../Dashboard/data/dashboardData";
import { initialShipmentsList } from "../Shipments/data/shipmentsData";
import { initialDriverConversations, initialChatMessages } from "../Chat/data/chatData";
import { initialDriverNotifications } from "../Notifications/data/notificationsData";
import { DriverProfile, ShipmentItem, ShipmentStatus, DriverChatMessage, DriverNotification } from "../types";


export function mapBackendShipmentToShipmentItem(raw: any): ShipmentItem {
    if (!raw) return raw;

    // Status normalization
    let status: ShipmentStatus = 'assigned';
    const rawStatus = String(raw.status || '').toLowerCase();
    if (rawStatus === 'driver_assigned' || rawStatus === 'assigned') {
        status = 'assigned';
    } else if (rawStatus === 'accepted') {
        status = 'accepted';
    } else if (rawStatus === 'in_progress' || rawStatus === 'picked_up') {
        status = 'at_pickup';
    } else if (rawStatus === 'in_transit') {
        status = 'in_transit';
    } else if (rawStatus === 'arrived') {
        status = 'at_delivery';
    } else if (rawStatus === 'delivered' || rawStatus === 'completed') {
        status = 'delivered';
    } else if (rawStatus === 'cancelled') {
        status = 'cancelled';
    }

    const orderNumber = raw.order_number || raw.orderNumber || raw.order_no || `ORD-${raw.id}`;
    const trackingNumber = raw.tracking_number || raw.trackingNumber || `TRK-${String(orderNumber).replace(/[^0-9]/g, '') || raw.id}`;

    // Shipper / Pickup info
    const shipperName = raw.pickup?.contact_name || raw.customer?.name || raw.shipper?.name || 'Shipper Contact';
    const shipperCompany = raw.pickup?.company || raw.customer?.company_name || raw.customer?.name || raw.shipper?.company || 'Verified Shipper';
    const shipperPhone = raw.pickup?.phone || raw.pickup?.contact_phone || raw.customer?.phone || raw.shipper?.phone || '—';
    const pickupAddress = raw.pickup?.address || raw.pickup_address || raw.shipper?.address || 'Pickup Location';
    const pickupCity = raw.pickup?.city || raw.shipper?.city || 'Origin';
    const pickupDate = raw.pickup?.date || raw.pickup?.raw_date || raw.pickup_date || 'Scheduled';
    const pickupTimeWindow = raw.pickup?.time || raw.estimated_time || '08:00 AM - 12:00 PM';

    // Consignee / Delivery info
    const consigneeName = raw.delivery?.contact_name || raw.consignee?.name || 'Consignee Contact';
    const consigneeCompany = raw.delivery?.company || raw.delivery?.company_name || raw.delivery?.contact_name || raw.consignee?.company || 'Delivery Destination';
    const consigneePhone = raw.delivery?.phone || raw.delivery?.contact_phone || raw.consignee?.phone || '—';
    const deliveryAddress = raw.delivery?.address || raw.delivery_address || raw.consignee?.address || 'Delivery Location';
    const deliveryCity = raw.delivery?.city || raw.consignee?.city || 'Destination';
    const deliveryDate = raw.delivery?.date || raw.delivery?.raw_date || 'Upcoming';
    const deliveryTimeWindow = raw.delivery?.time || '12:00 PM - 05:00 PM';

    // Cargo specs
    const rawWeight = raw.cargo?.total_weight ?? raw.cargo?.weightKg ?? raw.weight;
    const weightKg = typeof rawWeight === 'number'
        ? rawWeight
        : (parseFloat(String(rawWeight || '0').replace(/[^0-9.]/g, '')) || 500);

    const pallets = raw.cargo?.items_count
        ?? raw.cargo?.pallets
        ?? (Array.isArray(raw.cargo?.items) ? raw.cargo.items.length : 1);

    const freightType = raw.cargo?.service_type
        || raw.cargo?.pallet_type
        || raw.cargo?.freightType
        || raw.pallet_type
        || 'Standard Freight';

    const description = raw.cargo?.special_instructions
        || raw.cargo?.description
        || raw.status_note
        || 'Commercial Freight Shipment';

    // Route info
    const distanceKm = raw.route?.distance_km ?? raw.route?.distanceKm ?? (raw.distance_km ? Number(raw.distance_km) : 0);
    const estimatedDuration = raw.pickup?.time || raw.route?.estimatedDuration || '4h 30m';

    // Payout
    const driverEarnings = raw.payout?.driverEarnings ?? raw.payout?.driver_earnings ?? (raw.quote?.total_amount ? Number(raw.quote.total_amount) : 450);
    const fuelSurcharge = raw.payout?.fuelSurcharge ?? raw.payout?.fuel_surcharge ?? 50;

    return {
        id: String(raw.id),
        orderNumber,
        trackingNumber,
        status,
        priority: raw.priority || 'Standard',
        shipper: {
            name: shipperName,
            company: shipperCompany,
            phone: shipperPhone,
            address: pickupAddress,
            city: pickupCity,
            state: raw.pickup?.state || raw.shipper?.state || '',
            zip: raw.pickup?.zip || raw.shipper?.zip || '',
            pickupDate,
            pickupTimeWindow,
            notes: raw.pickup?.notes || raw.shipper?.notes || '',
        },
        consignee: {
            name: consigneeName,
            company: consigneeCompany,
            phone: consigneePhone,
            address: deliveryAddress,
            city: deliveryCity,
            state: raw.delivery?.state || raw.consignee?.state || '',
            zip: raw.delivery?.zip || raw.consignee?.zip || '',
            deliveryDate,
            deliveryTimeWindow,
            notes: raw.delivery?.notes || raw.consignee?.notes || '',
        },
        cargo: {
            description,
            freightType,
            weightKg,
            pallets,
            hazardous: Boolean(raw.cargo?.hazardous),
            temperatureControlled: raw.cargo?.temperature_controlled || raw.cargo?.temperatureControlled,
            dimensions: raw.cargo?.dimensions || 'Standard',
            valueEstimate: raw.cargo?.valueEstimate || raw.cargo?.value_estimate,
        },
        route: {
            distanceKm: raw.route?.distance_km ?? raw.route?.distanceKm ?? (raw.distance_km ? Number(raw.distance_km) : (distanceKm || 80.81)),
            distanceFormatted: raw.distance || (raw.distance_km ? `${raw.distance_km} km` : `${distanceKm || 80.81} km`),
            estimatedDuration: raw.estimated_time || raw.route?.estimatedDuration || estimatedDuration || '2h 19m',
            tollRoads: Boolean(raw.route?.tollRoads),
            currentLat: raw.route?.currentLat,
            currentLng: raw.route?.currentLng,
            originCoords: {
                lat: raw.pickup_lat ?? raw.route?.origin_coords?.lat ?? raw.route?.originCoords?.lat ?? 23.7881199,
                lng: raw.pickup_lng ?? raw.route?.origin_coords?.lng ?? raw.route?.originCoords?.lng ?? 90.3736584,
            },
            destinationCoords: {
                lat: raw.delivery_lat ?? raw.route?.destination_coords?.lat ?? raw.route?.destinationCoords?.lat ?? 24.2602295,
                lng: raw.delivery_lng ?? raw.route?.destination_coords?.lng ?? raw.route?.destinationCoords?.lng ?? 90.6422041,
            },
        },
        payout: {
            driverEarnings,
            fuelSurcharge,
            bonus: raw.payout?.bonus,
            currency: raw.payout?.currency || '€',
        },
        history: Array.isArray(raw.tracking?.history) ? raw.tracking.history : (Array.isArray(raw.history) ? raw.history : undefined),
        driver: raw.driver ? {
            name: raw.driver.name || '',
            phone: raw.driver.phone || '',
            vehiclePlate: raw.driver.vehicle_plate || '',
            vehicleType: raw.driver.vehicle_type || '',
        } : undefined,
        podData: (raw.proof_of_delivery || raw.proof || raw.tracking?.proof_of_delivery || raw.tracking?.proof || raw.tracking?.signature || raw.signature || raw.podData) ? {
            uploadedAt: raw.pod_uploaded_at || raw.tracking?.pod_uploaded_at || raw.podData?.uploadedAt || raw.updated_at || '',
            receiverName: raw.receiver_name || raw.tracking?.receiver_name || raw.podData?.receiverName || '',
            signatureUrl: raw.signature || raw.signature_url || raw.tracking?.signature || raw.podData?.signatureUrl,
            documentPhotos: (raw.proof_of_delivery || raw.proof || raw.tracking?.proof_of_delivery || raw.tracking?.proof) ? [raw.proof_of_delivery || raw.proof || raw.tracking?.proof_of_delivery || raw.tracking?.proof] : (raw.podData?.documentPhotos || []),
            notes: raw.tracking?.note || raw.podData?.notes || '',
        } : undefined,
        createdAt: raw.created_at || raw.createdAt || '',
        updatedAt: raw.updated_at || raw.updatedAt || '',
    };
}


function syncAuthUserAvatar(avatarUrl?: string | null, name?: string) {
    if (!avatarUrl && !name) return;
    try {
        const keys = [
            TOKEN_CONFIG.userKey,
            'carrierdirect_user_data',
            'user',
            'erp_user_data'
        ];
        keys.forEach((key) => {
            const raw = localStorage.getItem(key);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (parsed && typeof parsed === 'object') {
                        if (avatarUrl !== undefined) parsed.profile_picture = avatarUrl;
                        if (name) parsed.name = name;
                        localStorage.setItem(key, JSON.stringify(parsed));
                    }
                } catch {}
            }
        });
        window.dispatchEvent(new Event('user-profile-updated'));
        window.dispatchEvent(new Event('driver-profile-updated'));
    } catch (err) {
        console.warn('Failed to sync auth user avatar:', err);
    }
}

export const driverApi = {
    // ── Driver Profile & Compliance ──────────────────────────────────
    async getProfile(): Promise<DriverProfile> {
        try {
            const res = await apiClient.get("/driver/profile");
            const data = res.data?.data || res.data;
            if (data && (data.name || data.id || data.employee_id)) {
                if (data.profile_picture) {
                    syncAuthUserAvatar(data.profile_picture, data.name);
                }
                const licenseClassVal = data.credentials?.driver_license_class;
                return {
                    id: data.id || data.employee_id || "",
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    avatar: data.profile_picture || "",
                    title: data.personal?.designation || data.role_name || "Heavy Truck Driver",
                    slogan: data.personal?.bio || "",
                    licenseBadge: licenseClassVal === "class_b" ? "CDL-B" : licenseClassVal === "class_c" ? "CDL-C" : "CDL-A",
                    isVerified: Boolean(data.verification?.is_verified),
                    verificationStatus: data.verification?.status || "pending_setup",
                    rejectionReason: data.verification?.rejection_reason || undefined,
                    employerCarrier: data.employer_carrier || undefined,
                    employmentStatus: data.verification?.is_verified ? "Active" : "Suspended",
                    dutyStatus: data.duty_status || "offline",
                    address: data.personal?.address || "",
                    city: data.personal?.city || "",
                    state: data.personal?.state || "",
                    zipCode: data.personal?.zip_code || "",
                    driverLicense: data.credentials?.driver_license_number || "",
                    joinedDate: data.created_at || "",
                    homeTerminal: data.emergency?.terminal_location || "",
                    emergencyContact: {
                        name: data.emergency?.contact_name || "",
                        phone: data.emergency?.contact_phone || "",
                        relationship: data.emergency?.contact_relation || "",
                    },
                    cdlDetails: {
                        cdlNumber: data.credentials?.driver_license_number || "",
                        licenseClass: licenseClassVal === "class_b" ? "Class B" : licenseClassVal === "class_c" ? "Class C" : licenseClassVal === "class_a" ? "Class A" : "",
                        stateOfIssue: data.credentials?.driver_license_state || "",
                        expirationDate: data.credentials?.license_expiry_date || "",
                        issueDate: data.credentials?.license_issue_date || "",
                        endorsements: Array.isArray(data.emergency?.endorsements) 
                            ? data.emergency.endorsements.join(", ") 
                            : (data.emergency?.endorsements || ""),
                        cdlFrontUrl: data.credentials?.license_document || "",
                        cdlBackUrl: data.credentials?.license_back_document || "",
                        verification: data.credentials?.license_status === "verified" ? "FMCSA Verified" : data.credentials?.license_status === "rejected" ? "Rejected" : "Pending Verification",
                    },
                    dotMedical: {
                        nrcmeRegistryId: data.credentials?.medical_card_number || "",
                        medicalExaminer: data.credentials?.medical_examiner || "",
                        examDate: data.credentials?.medical_exam_date || "",
                        expiryDate: data.credentials?.medical_card_expiry_date || "",
                        certificateStatus: data.credentials?.medical_card_status === "verified" ? "Active" : "Pending",
                        certificateUrl: data.credentials?.medical_card_document || "",
                        mcsaForm: data.credentials?.mcsa_form || "",
                        mcsaFormUrl: data.credentials?.mcsa_document || "",
                    },
                    fleetEquipment: {
                        unitNumber: data.equipment?.truck_number || "",
                        trailerNumber: data.equipment?.trailer_number || "",
                        licensePlate: data.equipment?.license_plate || "",
                        vin: data.equipment?.vin_number || "",
                        equipmentType: data.equipment?.equipment_type || "",
                        tractorModel: data.equipment?.tractor_model || "",
                        year: data.equipment?.truck_year ? Number(data.equipment.truck_year) : undefined,
                        eldUnitId: data.equipment?.eld_unit_id || "",
                        currentMileage: data.equipment?.mileage || "",
                        trailerVin: data.equipment?.trailer_vin || "",
                        trailerType: data.equipment?.trailer_type || "",
                        gpsTracker: data.equipment?.gps_tracker || "",
                        inspectionStatus: data.equipment?.inspection_status || "",
                        inspectionCertificateName: "",
                        inspectionCertificateUrl: data.equipment?.inspection_document || data.equipment?.inspection_certificate || "",
                        insuranceProvider: data.equipment?.insurance_provider || "",
                        insurancePolicyNumber: data.equipment?.insurance_policy_number || "",
                        insuranceEffectiveDate: data.equipment?.insurance_effective_date || "",
                        insuranceExpiryDate: data.equipment?.insurance_expiry_date || "",
                        insuranceStatus: data.equipment?.insurance_policy_number ? "Active" : "",
                        insuranceCertificateUrl: data.equipment?.insurance_document || "",
                    },
                    vehicleAssigned: {
                        plate: data.equipment?.license_plate || "",
                        model: data.equipment?.tractor_model || "",
                        type: data.equipment?.equipment_type || "",
                        capacity: "",
                        status: data.verification?.is_verified ? "Active" : "Inactive",
                    },
                    stats: initialDriverProfile.stats,
                    preferences: initialDriverProfile.preferences,
                };
            }
        } catch (err) {
            console.error("API Error in getProfile:", err);
        }
        return initialDriverProfile;
    },

    async updatePersonalInfo(formData: FormData | object): Promise<DriverProfile> {
        await apiClient.post("/driver/profile/personal", formData, {
            headers: formData instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
        });
        const updated = await this.getProfile();
        if (updated?.avatar) {
            syncAuthUserAvatar(updated.avatar, updated.name);
        }
        window.dispatchEvent(new Event("driver-profile-updated"));
        return updated;
    },

    async updateCredentials(formData: FormData | object): Promise<DriverProfile> {
        await apiClient.post("/driver/profile/credentials", formData, {
            headers: formData instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
        });
        window.dispatchEvent(new Event("driver-profile-updated"));
        window.dispatchEvent(new Event("driver-compliance-updated"));
        return this.getProfile();
    },

    async updateEquipment(data: FormData | object): Promise<DriverProfile> {
        await apiClient.post("/driver/profile/equipment", data, {
            headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
        });
        window.dispatchEvent(new Event("driver-profile-updated"));
        window.dispatchEvent(new Event("driver-compliance-updated"));
        return this.getProfile();
    },

    async updateEmergency(data: object): Promise<DriverProfile> {
        await apiClient.post("/driver/profile/emergency", data);
        window.dispatchEvent(new Event("driver-profile-updated"));
        window.dispatchEvent(new Event("driver-compliance-updated"));
        return this.getProfile();
    },

    async submitForVerification(): Promise<{ verification_status: string; message: string }> {
        const res = await apiClient.post("/driver/profile/submit-verification");
        window.dispatchEvent(new Event("driver-compliance-updated"));
        window.dispatchEvent(new Event("driver-profile-updated"));
        return res.data;
    },

    async getVerificationStatus(): Promise<{
        is_verified: boolean;
        verification_status: string;
        duty_status: string;
        rejection_reason?: string | null;
    }> {
        try {
            const res = await apiClient.get("/driver/verification/status");
            const data = res.data?.data || res.data;
            if (data) {
                return {
                    is_verified: Boolean(data.is_verified),
                    verification_status: data.verification_status || (data.is_verified ? "verified" : "pending_setup"),
                    duty_status: data.duty_status || "offline",
                    rejection_reason: data.rejection_reason || null,
                };
            }
        } catch (err) {
            console.error("API Error in getVerificationStatus:", err);
        }
        return {
            is_verified: false,
            verification_status: "pending_setup",
            duty_status: "offline",
            rejection_reason: null,
        };
    },

    async updateProfile(updates: Partial<DriverProfile>): Promise<DriverProfile> {
        try {
            if (
                updates.name ||
                updates.phone ||
                updates.address ||
                updates.slogan ||
                updates.city ||
                updates.state ||
                updates.zipCode ||
                updates.title ||
                updates.avatar !== undefined
            ) {
                let personalPayload: any;
                if (updates.avatar && typeof updates.avatar !== 'string') {
                    const fd = new FormData();
                    fd.append("profile_picture", updates.avatar as any);
                    if (updates.name) fd.append("name", updates.name);
                    if (updates.phone) fd.append("phone", updates.phone);
                    if (updates.address) fd.append("address", updates.address);
                    if (updates.city) fd.append("city", updates.city);
                    if (updates.state) fd.append("state", updates.state);
                    if (updates.zipCode) fd.append("zip_code", updates.zipCode);
                    if (updates.slogan) fd.append("bio", updates.slogan);
                    if (updates.title) fd.append("designation", updates.title);
                    personalPayload = fd;
                } else {
                    personalPayload = {
                        name: updates.name,
                        phone: updates.phone,
                        address: updates.address,
                        city: updates.city,
                        state: updates.state,
                        zip_code: updates.zipCode,
                        bio: updates.slogan,
                        designation: updates.title,
                        profile_picture: updates.avatar,
                        avatar: updates.avatar,
                    };
                }

                await apiClient.post("/driver/profile/personal", personalPayload, {
                    headers: personalPayload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
                });
            }
            if (updates.emergencyContact || updates.homeTerminal || updates.cdlDetails?.endorsements) {
                await apiClient.post("/driver/profile/emergency", {
                    emergency_contact_name: updates.emergencyContact?.name,
                    emergency_contact_phone: updates.emergencyContact?.phone,
                    emergency_contact_relation: updates.emergencyContact?.relationship,
                    terminal_location: updates.homeTerminal,
                    endorsements: updates.cdlDetails?.endorsements ? (
                        typeof updates.cdlDetails.endorsements === 'string'
                            ? updates.cdlDetails.endorsements.split(',').map(s => s.trim()).filter(Boolean)
                            : updates.cdlDetails.endorsements
                    ) : undefined,
                });
            }
            if (updates.cdlDetails || updates.dotMedical) {
                const credsPayload: Record<string, any> = {};
                if (updates.cdlDetails?.cdlNumber) credsPayload.driver_license_number = updates.cdlDetails.cdlNumber;
                if (updates.cdlDetails?.stateOfIssue) credsPayload.driver_license_state = updates.cdlDetails.stateOfIssue;
                if (updates.cdlDetails?.licenseClass) {
                    credsPayload.driver_license_class = updates.cdlDetails.licenseClass === "Class A"
                        ? "class_a"
                        : updates.cdlDetails.licenseClass === "Class B"
                        ? "class_b"
                        : updates.cdlDetails.licenseClass === "Class C"
                        ? "class_c"
                        : "standard";
                }
                if (updates.cdlDetails?.issueDate) credsPayload.license_issue_date = updates.cdlDetails.issueDate;
                if (updates.cdlDetails?.expirationDate) credsPayload.license_expiry_date = updates.cdlDetails.expirationDate;
                if (updates.dotMedical?.nrcmeRegistryId) credsPayload.medical_card_number = updates.dotMedical.nrcmeRegistryId;
                if (updates.dotMedical?.medicalExaminer) credsPayload.medical_examiner = updates.dotMedical.medicalExaminer;
                if (updates.dotMedical?.examDate) credsPayload.medical_exam_date = updates.dotMedical.examDate;
                if (updates.dotMedical?.expiryDate) credsPayload.medical_card_expiry_date = updates.dotMedical.expiryDate;
                if (updates.dotMedical?.mcsaForm) credsPayload.mcsa_form = updates.dotMedical.mcsaForm;

                if (Object.keys(credsPayload).length > 0) {
                    await apiClient.post("/driver/profile/credentials", credsPayload);
                }
            }
            if (updates.fleetEquipment) {
                await apiClient.post("/driver/profile/equipment", {
                    tractor_model: updates.fleetEquipment.tractorModel,
                    truck_number: updates.fleetEquipment.unitNumber,
                    trailer_number: updates.fleetEquipment.trailerNumber,
                    license_plate: updates.fleetEquipment.licensePlate,
                    vin_number: updates.fleetEquipment.vin,
                    equipment_type: updates.fleetEquipment.equipmentType,
                    insurance_provider: updates.fleetEquipment.insuranceProvider,
                    insurance_policy_number: updates.fleetEquipment.insurancePolicyNumber,
                    insurance_expiry_date: updates.fleetEquipment.insuranceExpiryDate,
                });
            }
        } catch (err) {
            console.warn("API sync error in updateProfile:", err);
        }
        window.dispatchEvent(new Event("driver-profile-updated"));
        window.dispatchEvent(new Event("driver-compliance-updated"));
        return this.getProfile();
    },

    async toggleDutyStatus(status: "online" | "offline" | "on_trip" | "break", coords?: { lat: number; lng: number }): Promise<DriverProfile> {
        try {
            await apiClient.put("/driver/duty-status", {
                duty_status: status,
                latitude: coords?.lat,
                longitude: coords?.lng,
            });
        } catch (err) {
            console.error("API error in toggleDutyStatus:", err);
        }
        window.dispatchEvent(new Event("driver-profile-updated"));
        return this.getProfile();
    },

    // ── Dashboard ────────────────────────────────────────────────────
    async getDashboardMetrics() {
        try {
            const res = await apiClient.get("/driver/dashboard");
            const data = res.data?.data || res.data || res;
            if (data?.metrics) return data.metrics;
        } catch (err) {
            console.error("API Error in getDashboardMetrics:", err);
        }
        return initialDashboardMetrics;
    },

    async getDashboardData() {
        try {
            const res = await apiClient.get("/driver/dashboard");
            const data = res.data?.data || res.data || res;
            if (data && (data.metrics || data.recent_trips || data.today_schedule || data.driver_info)) {
                const metricsRaw = data.metrics || {};
                const activeShipmentsCount = Number(metricsRaw.active_shipments ?? 0);
                const deliveredCount = Number(metricsRaw.delivered_shipments ?? 0);
                const totalAssigned = Number(metricsRaw.total_assigned ?? 0);
                const distanceVal = Number(metricsRaw.total_distance_km ?? 0);
                const todayDistVal = Number(metricsRaw.today_distance_km ?? 0);
                const ratingVal = Number(metricsRaw.driver_rating ?? 5.0);
                const reviewsCountVal = Number(metricsRaw.reviews_count ?? 0);

                const metrics = {
                    activeLoads: {
                        value: `${activeShipmentsCount} Loads`,
                        subtitle: activeShipmentsCount > 0 ? `${activeShipmentsCount} in active transit` : 'All loads delivered',
                        count: activeShipmentsCount,
                    },
                    tripsCompleted: {
                        value: `${deliveredCount} Orders`,
                        subtitle: `${totalAssigned} total assigned`,
                        count: deliveredCount,
                    },
                    distance: {
                        value: `${distanceVal} km`,
                        subtitle: todayDistVal > 0 ? `${todayDistVal} km assigned today` : (distanceVal > 0 ? "Total distance" : "0 km logged"),
                        km: distanceVal,
                    },
                    driverRating: {
                        value: `${ratingVal.toFixed(2)}`,
                        subtitle: reviewsCountVal > 0 ? `${reviewsCountVal} fleet reviews` : 'No reviews yet',
                        rating: ratingVal,
                        reviewsCount: reviewsCountVal,
                    },
                };

                const recentTripsRaw = Array.isArray(data.recent_trips) ? data.recent_trips : [];
                const todayScheduleRaw = Array.isArray(data.today_schedule) ? data.today_schedule : [];

                const mappedRecent = recentTripsRaw.map(mapBackendShipmentToShipmentItem);
                const mappedToday = todayScheduleRaw.map(mapBackendShipmentToShipmentItem);

                // Find active shipment (first non-completed or latest)
                const activeShipmentItem = mappedRecent.find(s => s.status !== 'delivered' && s.status !== 'cancelled') || mappedRecent[0] || null;

                let activeShipment = null;
                if (activeShipmentItem) {
                    activeShipment = {
                        id: activeShipmentItem.id,
                        orderNumber: activeShipmentItem.orderNumber,
                        cargoTag: activeShipmentItem.cargo?.freightType || activeShipmentItem.cargo?.palletType || 'Standard Freight',
                        status: activeShipmentItem.status === 'in_transit' ? 'IN TRANSIT' :
                            activeShipmentItem.status === 'at_pickup' ? 'AT PICKUP DOCK' :
                            activeShipmentItem.status === 'at_delivery' ? 'AT CONSIGNEE DOCK' :
                            activeShipmentItem.status === 'delivered' ? 'DELIVERED' : 'ASSIGNED',
                        origin: {
                            name: activeShipmentItem.shipper?.company || activeShipmentItem.shipper?.name || 'Shipper Origin',
                            address: activeShipmentItem.shipper?.address ? `${activeShipmentItem.shipper.address}, ${activeShipmentItem.shipper.city || ''}` : 'Pickup Location',
                        },
                        destination: {
                            name: activeShipmentItem.consignee?.company || activeShipmentItem.consignee?.name || 'Consignee Destination',
                            address: activeShipmentItem.consignee?.address ? `${activeShipmentItem.consignee.address}, ${activeShipmentItem.consignee.city || ''}` : 'Delivery Location',
                        },
                        cargo: {
                            type: activeShipmentItem.cargo?.freightType || 'Freight',
                            weight: `${activeShipmentItem.cargo?.weightKg || 0} kg`,
                            tempControlled: activeShipmentItem.cargo?.temperatureControlled || undefined,
                        }
                    };
                }

                // Schedule list
                const scheduleSources = mappedToday.length > 0 ? mappedToday : mappedRecent;
                const scheduleList = scheduleSources.map(s => ({
                    id: s.id,
                    tripId: s.orderNumber,
                    time: s.shipper?.pickupTimeWindow || '09:00 AM - 05:00 PM',
                    cargoType: s.cargo?.freightType || s.cargo?.palletType || 'Standard Freight',
                    origin: `${s.shipper?.company || ''}, ${s.shipper?.city || ''}`,
                    destination: `${s.consignee?.company || ''}, ${s.consignee?.city || ''}`,
                    status: s.status === 'in_transit' ? 'In Transit' :
                        s.status === 'at_pickup' ? 'At Pickup' :
                        s.status === 'at_delivery' ? 'At Delivery' :
                        s.status === 'delivered' ? 'Delivered' : 'Assigned',
                }));

                const driverInfo = {
                    vehiclePlate: data.driver_info?.vehicle_plate || '231-D-45892',
                    vehicleType: data.driver_info?.vehicle_type || 'Covered Van (14ft)',
                    name: data.driver_info?.name || 'Aidan Driver',
                    phone: data.driver_info?.phone || '',
                };

                return {
                    metrics,
                    activeShipment,
                    scheduleList,
                    driverInfo,
                };
            }
        } catch (err) {
            console.error("API Error in getDashboardData:", err);
        }
        return {
            metrics: initialDashboardMetrics,
            activeShipment: null,
            scheduleList: [],
            driverInfo: {
                vehiclePlate: '231-D-45892',
                vehicleType: 'Covered Van (14ft)',
                name: 'Driver',
                phone: '',
            },
        };
    },

    async getActiveTripSummary() {
        try {
            const res = await apiClient.get("/driver/dashboard");
            const data = res.data?.data || res.data || res;
            if (data?.recent_trips && data.recent_trips.length > 0) {
                return data.recent_trips[0];
            }
        } catch (err) {
            console.error("API Error in getActiveTripSummary:", err);
        }
        return activeTripSummary;
    },

    async getTelemetry() {
        return telemetryData;
    },

    // ── Shipments ────────────────────────────────────────────────────
    async getShipments(): Promise<ShipmentItem[]> {
        try {
            const res = await apiClient.get("/driver/shipments");
            const rawList =
                res.data?.shipments ||
                res.shipments ||
                res.data?.data?.shipments ||
                (Array.isArray(res.data) ? res.data : null) ||
                (Array.isArray(res) ? res : null);

            if (Array.isArray(rawList)) {
                return rawList.map(mapBackendShipmentToShipmentItem);
            }
        } catch (err) {
            console.error("API Error in getShipments:", err);
        }
        return [];
    },

    async getShipmentById(id: string): Promise<ShipmentItem | null> {
        try {
            const res = await apiClient.get("/driver/shipments/" + id);
            const raw = res.data?.data || res.data || res;
            if (raw && (raw.id || raw.order_number)) {
                return mapBackendShipmentToShipmentItem(raw);
            }
        } catch (err) {
            console.error("API Error in getShipmentById:", err);
        }
        return null;
    },

    async updateShipmentMilestone(id: string, newStatus: ShipmentStatus): Promise<ShipmentItem> {
        const statusMap: Record<string, string> = {
            assigned: 'assigned',
            accepted: 'in_progress',
            at_pickup: 'picked_up',
            in_transit: 'in_transit',
            at_delivery: 'arrived',
            delivered: 'delivered',
            cancelled: 'cancelled',
        };
        const backendStatus = statusMap[newStatus] || newStatus;
        const res = await apiClient.patch("/driver/shipments/" + id + "/status", { status: backendStatus });
        const raw = res.data?.data || res.data || res;
        return mapBackendShipmentToShipmentItem(raw);
    },

    async submitPOD(id: string, podData: { receiverName: string; signatureUrl?: string; documentPhotos?: string[]; notes?: string }): Promise<ShipmentItem> {
        const formData = new FormData();
        formData.append("status", "delivered");
        if (podData.receiverName) formData.append("receiver_name", podData.receiverName);
        if (podData.notes) formData.append("note", podData.notes);
        if (podData.signatureUrl) formData.append("signature", podData.signatureUrl);
        const res = await apiClient.post("/driver/shipments/" + id + "/status", formData);
        const raw = res.data?.data || res.data || res;
        return mapBackendShipmentToShipmentItem(raw);
    },

    // ── Live Chat ────────────────────────────────────────────────────
    async getConversations() {
        try {
            const res = await apiClient.get("/messages/conversations");
            const data = res.data?.data || res.data || res;
            if (data && Array.isArray(data)) return data;
        } catch (err) {
            // fallback
        }
        return initialDriverConversations;
    },

    async getMessages(conversationId: string): Promise<DriverChatMessage[]> {
        try {
            const res = await apiClient.get("/messages/with/" + conversationId);
            const data = res.data?.data || res.data || res;
            if (data && Array.isArray(data)) return data;
        } catch (err) {
            // fallback
        }
        return initialChatMessages[conversationId] || [];
    },

    async sendMessage(conversationId: string, messageText: string, type: DriverChatMessage["type"] = "text"): Promise<DriverChatMessage> {
        try {
            const res = await apiClient.post("/messages/send", {
                receiver_id: conversationId,
                message: messageText,
                type,
            });
            if (res.data?.data) return res.data.data;
        } catch (err) {
            // fallback
        }
        return {
            id: "msg-" + Date.now(),
            senderId: "DRV-9872",
            senderName: "Driver",
            senderRole: "driver",
            message: messageText,
            type,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isMe: true,
            status: "sent",
        };
    },

    // ── Notifications ────────────────────────────────────────────────
    async getNotifications(): Promise<DriverNotification[]> {
        try {
            const res = await apiClient.get("/notifications");
            const data = res.data?.data || res.data || res;
            if (data && Array.isArray(data)) return data;
        } catch (err) {
            // fallback
        }
        return initialDriverNotifications;
    },

    async markNotificationAsRead(id: string): Promise<DriverNotification[]> {
        try {
            await apiClient.post("/notifications/" + id + "/read");
        } catch (err) {
            // fallback
        }
        return this.getNotifications();
    },

    async markAllNotificationsRead(): Promise<DriverNotification[]> {
        try {
            await apiClient.post("/notifications/read-all");
        } catch (err) {
            // fallback
        }
        return this.getNotifications();
    },
};
