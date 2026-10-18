import { driverProfileService } from './driverProfileService';
import { driverDashboardService } from './driverDashboardService';
import { driverShipmentService } from './driverShipmentService';
import { driverChatNotificationService } from './driverChatNotificationService';

export { mapBackendShipmentToShipmentItem } from './shipmentMapper';
export { syncAuthUserAvatar, driverProfileService } from './driverProfileService';
export { driverDashboardService } from './driverDashboardService';
export { driverShipmentService } from './driverShipmentService';
export { driverChatNotificationService } from './driverChatNotificationService';

export const driverApi = {
    // Driver Profile & Compliance
    getProfile: driverProfileService.getProfile.bind(driverProfileService),
    completeSetup: driverProfileService.completeSetup.bind(driverProfileService),
    updatePersonalInfo: driverProfileService.updatePersonalInfo.bind(driverProfileService),
    updateCredentials: driverProfileService.updateCredentials.bind(driverProfileService),
    updateEquipment: driverProfileService.updateEquipment.bind(driverProfileService),
    updateEmergency: driverProfileService.updateEmergency.bind(driverProfileService),
    submitForVerification: driverProfileService.submitForVerification.bind(driverProfileService),
    getVerificationStatus: driverProfileService.getVerificationStatus.bind(driverProfileService),
    updateProfile: driverProfileService.updateProfile.bind(driverProfileService),
    toggleDutyStatus: driverProfileService.toggleDutyStatus.bind(driverProfileService),

    // Dashboard
    getDashboardMetrics: driverDashboardService.getDashboardMetrics.bind(driverDashboardService),
    getDashboardData: driverDashboardService.getDashboardData.bind(driverDashboardService),
    getActiveTripSummary: driverDashboardService.getActiveTripSummary.bind(driverDashboardService),
    getTelemetry: driverDashboardService.getTelemetry.bind(driverDashboardService),

    // Shipments
    getShipments: driverShipmentService.getShipments.bind(driverShipmentService),
    getShipmentById: driverShipmentService.getShipmentById.bind(driverShipmentService),
    updateShipmentMilestone: driverShipmentService.updateShipmentMilestone.bind(driverShipmentService),
    submitPOD: driverShipmentService.submitPOD.bind(driverShipmentService),
    checkCustomerReview: driverShipmentService.checkCustomerReview.bind(driverShipmentService),
    submitCustomerReview: driverShipmentService.submitCustomerReview.bind(driverShipmentService),

    // Chat
    getConversations: driverChatNotificationService.getConversations.bind(driverChatNotificationService),
    getMessages: driverChatNotificationService.getMessages.bind(driverChatNotificationService),
    sendMessage: driverChatNotificationService.sendMessage.bind(driverChatNotificationService),

    // Notifications
    getNotifications: driverChatNotificationService.getNotifications.bind(driverChatNotificationService),
    markNotificationAsRead: driverChatNotificationService.markNotificationAsRead.bind(driverChatNotificationService),
    markAllNotificationsRead: driverChatNotificationService.markAllNotificationsRead.bind(driverChatNotificationService),
};
