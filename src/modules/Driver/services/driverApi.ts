import apiClient from "@/lib/axios";
import { initialDriverProfile } from "../Profile/data/profileData";
import { initialDashboardMetrics, activeTripSummary, telemetryData } from "../Dashboard/data/dashboardData";
import { initialShipmentsList } from "../Shipments/data/shipmentsData";
import { initialDriverConversations, initialChatMessages } from "../Chat/data/chatData";
import { initialDriverNotifications } from "../Notifications/data/notificationsData";
import { DriverProfile, ShipmentItem, ShipmentStatus, DriverChatMessage, DriverNotification } from "../types";

export const driverApi = {
    // ── Driver Profile & Compliance ──────────────────────────────────
    async getProfile(): Promise<DriverProfile> {
        try {
            const res = await apiClient.get("/driver/profile");
            const data = res.data?.data || res.data;
            if (data && (data.name || data.id || data.employee_id)) {
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
        window.dispatchEvent(new Event("driver-profile-updated"));
        return this.getProfile();
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
            if (updates.name || updates.phone || updates.address || updates.slogan) {
                await apiClient.post("/driver/profile/personal", {
                    name: updates.name,
                    phone: updates.phone,
                    address: updates.address,
                    city: updates.city,
                    state: updates.state,
                    zip_code: updates.zipCode,
                    bio: updates.slogan,
                });
            }
            if (updates.emergencyContact || updates.homeTerminal) {
                await apiClient.post("/driver/profile/emergency", {
                    emergency_contact_name: updates.emergencyContact?.name,
                    emergency_contact_phone: updates.emergencyContact?.phone,
                    emergency_contact_relation: updates.emergencyContact?.relationship,
                    terminal_location: updates.homeTerminal,
                });
            }
            if (updates.fleetEquipment) {
                await apiClient.post("/driver/profile/equipment", {
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
            if (res.data?.data?.metrics) return res.data.data.metrics;
        } catch (err) {
            console.error("API Error in getDashboardMetrics:", err);
        }
        return initialDashboardMetrics;
    },

    async getActiveTripSummary() {
        try {
            const res = await apiClient.get("/driver/dashboard");
            if (res.data?.data?.recent_trips && res.data.data.recent_trips.length > 0) {
                return res.data.data.recent_trips[0];
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
            const list = res.data?.data?.shipments || res.data?.data || res.data;
            if (Array.isArray(list)) return list;
        } catch (err) {
            console.error("API Error in getShipments:", err);
        }
        return initialShipmentsList;
    },

    async getShipmentById(id: string): Promise<ShipmentItem | null> {
        try {
            const res = await apiClient.get("/driver/shipments/" + id);
            if (res.data?.data) return res.data.data;
        } catch (err) {
            console.error("API Error in getShipmentById:", err);
        }
        return null;
    },

    async updateShipmentMilestone(id: string, newStatus: ShipmentStatus): Promise<ShipmentItem> {
        const res = await apiClient.patch("/driver/shipments/" + id + "/status", { status: newStatus });
        return res.data?.data || res.data;
    },

    async submitPOD(id: string, podData: { receiverName: string; signatureUrl?: string; documentPhotos?: string[]; notes?: string }): Promise<ShipmentItem> {
        const formData = new FormData();
        formData.append("status", "delivered");
        formData.append("note", podData.notes || "");
        const res = await apiClient.post("/driver/shipments/" + id + "/status", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data?.data || res.data;
    },

    // ── Live Chat ────────────────────────────────────────────────────
    async getConversations() {
        try {
            const res = await apiClient.get("/messages/conversations");
            if (res.data?.data) return res.data.data;
        } catch (err) {
            // fallback
        }
        return initialDriverConversations;
    },

    async getMessages(conversationId: string): Promise<DriverChatMessage[]> {
        try {
            const res = await apiClient.get("/messages/with/" + conversationId);
            if (res.data?.data) return res.data.data;
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
            if (res.data?.data) return res.data.data;
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
