import { FileText, Package, Truck, Euro, Bell } from 'lucide-react';
import { RecentQuoteRow } from '../components/RecentQuotesList';
import { ActiveOrderRow } from '../components/ActiveOrdersList';
import { DashboardNotificationRow } from '../components/DashboardNotificationsList';
import { timeAgo, formatCurrency, formatQuoteBudget } from './dashboardUtils';

export function mapRecentQuotes(quoteRequests: any[]): RecentQuoteRow[] {
    if (quoteRequests.length === 0) return [];

    return quoteRequests.slice(0, 10).map((q: any) => {
        const s = (q.status || 'New').toLowerCase();
        let color = 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400';
        let statusLabel = 'New';

        if (s.includes('view') || s.includes('pending')) {
            color = 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand';
            statusLabel = 'Viewed';
        } else if (s.includes('quote') || s.includes('submit')) {
            color = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400';
            statusLabel = 'Quoted';
        } else if (s.includes('lost') || s.includes('reject') || s.includes('cancel')) {
            color = 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300';
            statusLabel = 'Lost';
        } else if (s.includes('won') || s.includes('accept')) {
            color = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400';
            statusLabel = 'Won';
        }

        const customerRating = q.user?.average_rating ?? q.user?.rating ?? q.customer_rating ?? q.customerRating ?? q.rating ?? 0.0;
        const completedOrdersCount = q.user?.completed_orders_count ?? q.user?.orders_count ?? q.customer_completed_orders ?? q.customerOrdersCount ?? q.completed_orders ?? q.orders_count ?? 0;
        
        const rawCreatedAt = q.created_at || q.createdAt || q.requestDate || q.pickup_date;
        let formattedCreatedAt = 'Today';
        if (rawCreatedAt) {
            try {
                const d = new Date(rawCreatedAt);
                if (!isNaN(d.getTime())) {
                    formattedCreatedAt = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                }
            } catch {
                formattedCreatedAt = 'Today';
            }
        }

        const customerName = q.user?.name || q.customer?.name || q.customer_name || q.client_name || q.pickup_company || q.pickup_contact_name || q.customer || 'Customer';
        const customerAvatar = q.user?.avatar || q.user?.avatar_url || q.user?.profile_photo_url || q.user?.profile_photo_path || q.customer?.avatar || q.customer_avatar || q.avatar || '';
        const pallets = q.pallets ?? q.pallet_count ?? q.cargo_details?.pallets ?? q.total_pallets ?? q.packages_count ?? (q.pallets_count ?? 8);
        const rawBudget = q.budget ?? q.estimated_budget ?? q.target_price ?? q.price ?? q.amount;
        const budget = formatQuoteBudget(rawBudget);

        return {
            id: q.id ? `QR-${q.id}` : (q.reference_id || `QR-${q.slug || '0000'}`),
            slug: q.id || q.slug,
            status: statusLabel,
            color,
            createdAt: formattedCreatedAt,
            customerRating,
            completedOrdersCount,
            customerName,
            customerAvatar,
            pallets,
            budget,
        };
    });
}

export function mapDisplayOrders(activeOrders: any[]): ActiveOrderRow[] {
    if (activeOrders.length === 0) return [];

    return activeOrders.slice(0, 10).map((o: any) => {
        const s = (o.status || 'Pending').toLowerCase();
        let color = 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand';
        let statusLabel = 'Pending';

        if (s.includes('transit') || s.includes('road')) {
            color = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400';
            statusLabel = 'In Transit';
        } else if (s.includes('load') || s.includes('pickup')) {
            color = 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400';
            statusLabel = 'Loading';
        } else if (s.includes('deliver') || s.includes('complete')) {
            color = 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300';
            statusLabel = 'Delivered';
        }

        const route = o.route || (o.pickup_city && o.delivery_city ? `${o.pickup_city} → ${o.delivery_city}` : (o.pickup_address && o.delivery_address ? `${o.pickup_address.split(',')[0]} → ${o.delivery_address.split(',')[0]}` : (o.pickup_location && o.delivery_location ? `${o.pickup_location} → ${o.delivery_location}` : 'London → Manchester')));

        return {
            id: o.order_number || (o.id ? `ORD-${o.id}` : `ORD-${o.slug || '0000'}`),
            slug: o.id || o.slug,
            status: statusLabel,
            color,
            route,
        };
    });
}

export function mapDisplayNotifications(notifications: any[]): DashboardNotificationRow[] {
    if (notifications.length === 0) return [];

    return notifications.slice(0, 9).map((n: any) => {
        const text = n.data?.message || n.message || n.title || 'Notification alert';
        const t = text.toLowerCase();

        let icon = Bell;
        let bg = 'bg-amber-100 dark:bg-amber-950/60';
        let color = 'text-amber-600 dark:text-amber-400';

        if (t.includes('quote')) {
            icon = FileText;
            bg = 'bg-purple-100 dark:bg-purple-950/60';
            color = 'text-purple-600 dark:text-purple-400';
        } else if (t.includes('order') || t.includes('accept') || t.includes('job')) {
            icon = Package;
            bg = 'bg-emerald-100 dark:bg-emerald-950/60';
            color = 'text-emerald-600 dark:text-emerald-400';
        } else if (t.includes('transit') || t.includes('deliver') || t.includes('truck')) {
            icon = Truck;
            bg = 'bg-blue-100 dark:bg-blue-950/60';
            color = 'text-brand';
        } else if (t.includes('payment') || t.includes('€') || t.includes('euro') || t.includes('paid')) {
            icon = Euro;
            bg = 'bg-emerald-100 dark:bg-emerald-950/60';
            color = 'text-emerald-600 dark:text-emerald-400';
        }

        return {
            icon,
            text,
            bg,
            color,
            time: timeAgo(n.created_at),
        };
    });
}
