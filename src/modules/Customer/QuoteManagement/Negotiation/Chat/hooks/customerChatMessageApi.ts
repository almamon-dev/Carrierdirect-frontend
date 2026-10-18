import apiClient from '@/lib/axios';

export async function fetchCustomerMessagesApi(activeChatId: string | number) {
    try {
        const res = await apiClient.get(`/customer/negotiations/${activeChatId}/messages`);
        return res;
    } catch {
        return await apiClient.get(`/negotiations/${activeChatId}/messages`);
    }
}

export async function fetchCustomerTypingStatusApi(activeChatId: string | number) {
    return await apiClient.get(`/customer/negotiations/${activeChatId}/typing`).catch(() =>
        apiClient.get(`/negotiations/${activeChatId}/typing`)
    );
}

export async function notifyCustomerTypingApi(activeChatId: string | number, isTyping: boolean) {
    return apiClient.post(`/customer/negotiations/${activeChatId}/typing`, { is_typing: isTyping }).catch(() =>
        apiClient.post(`/negotiations/${activeChatId}/typing`, { is_typing: isTyping }).catch(() => {})
    );
}

export async function markCustomerNegotiationSeenApi(activeChatId: string | number) {
    return apiClient.post(`/customer/negotiations/${activeChatId}/seen`).catch(() =>
        apiClient.post(`/negotiations/${activeChatId}/seen`).catch(() => {})
    );
}

export async function sendCustomerMessageApi(
    activeChatId: string | number,
    text: string,
    files?: File[]
) {
    const formData = new FormData();
    formData.append('quote_id', String(activeChatId));
    formData.append('negotiation_id', String(activeChatId));
    formData.append('message', text || '');
    formData.append('text', text || '');
    if (files && files.length > 0) {
        files.forEach(f => formData.append('attachments[]', f));
    }
    return apiClient.post(`/customer/negotiations/${activeChatId}/messages`, formData).catch(() =>
        apiClient.post(`/negotiations/${activeChatId}/messages`, formData)
    );
}

export async function editCustomerMessageApi(
    activeChatId: string | number,
    msgId: string | number,
    text: string
) {
    return apiClient.patch(`/negotiations/${activeChatId}/messages/${msgId}`, { message: text }).catch(() =>
        apiClient.put(`/negotiations/${activeChatId}/messages/${msgId}`, { message: text }).catch(() => {})
    );
}

export async function pinCustomerMessageApi(
    activeChatId: string | number,
    msgId: string | number
) {
    return apiClient.post(`/customer/negotiations/${activeChatId}/messages/${msgId}/pin`).catch(() =>
        apiClient.post(`/negotiations/${activeChatId}/messages/${msgId}/pin`).catch(() =>
            apiClient.post(`/negotiations/messages/${msgId}/pin`).catch(() => {})
        )
    );
}

export async function deleteCustomerMessageApi(
    activeChatId: string | number,
    msgId: string | number
) {
    return apiClient.delete(`/negotiations/${activeChatId}/messages/${msgId}`).catch(() =>
        apiClient.post(`/negotiations/${activeChatId}/messages/${msgId}/delete`).catch(() => {})
    );
}
