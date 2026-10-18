export interface PlanTier {
    name: string;
    description: string;
    popular: boolean;
    badge_text: string | null;
    order: number;
    features: string[];
    monthlyPlan?: any;
    yearlyPlan?: any;
    trialPlan?: any;
}


export function buildTierMap(dbPlans: any[]): Record<string, PlanTier> {
    const tierMap: Record<string, PlanTier> = {};
    if (!Array.isArray(dbPlans) || dbPlans.length === 0) return tierMap;

    dbPlans.forEach((p: any) => {
        if (p.billing_period === 'trial' || (p.name && p.name.toLowerCase().includes('trial'))) {
            tierMap['trial'] = {
                name: p.name || '7-Day Free Trial',
                description: p.description || 'Test full platform features with free trial access.',
                popular: false,
                badge_text: 'Free Trial',
                features: Array.isArray(p.features) ? p.features : [],
                order: 0,
                trialPlan: p,
                monthlyPlan: null,
                yearlyPlan: null,
            };
            return;
        }

        const baseName = (p.name || 'Plan').replace(/\s*\((Monthly|Yearly|Annual)\)/i, '').trim();
        const tierKey = baseName.toLowerCase();

        if (!tierMap[tierKey]) {
            tierMap[tierKey] = {
                name: baseName,
                description: p.description || 'Road freight logistics and transport plan.',
                popular: Boolean(p.is_popular || p.popular),
                badge_text: p.is_popular || p.popular ? 'Most Popular' : null,
                features: Array.isArray(p.features) ? p.features : [],
                order: p.order || 1,
                monthlyPlan: null,
                yearlyPlan: null,
            };
        }

        if (p.is_popular || p.popular) {
            tierMap[tierKey].popular = true;
            tierMap[tierKey].badge_text = 'Most Popular';
        }

        if (p.description && (!tierMap[tierKey].description || tierMap[tierKey].description === "Road freight logistics and transport plan.")) {
            tierMap[tierKey].description = p.description;
        }

        if (p.billing_period === 'monthly') {
            tierMap[tierKey].monthlyPlan = p;
            if ((!tierMap[tierKey].features || tierMap[tierKey].features.length === 0) && Array.isArray(p.features)) {
                tierMap[tierKey].features = p.features;
            }
        } else if (p.billing_period === 'annual' || p.billing_period === 'yearly') {
            tierMap[tierKey].yearlyPlan = p;
            if ((!tierMap[tierKey].features || tierMap[tierKey].features.length === 0) && Array.isArray(p.features)) {
                tierMap[tierKey].features = p.features;
            }
        } else {
            tierMap[tierKey].monthlyPlan = p;
        }
    });

    return tierMap;
}
