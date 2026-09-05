export const FREIGHT_TEMPLATES: Array<{ id: string; label: string; text: string }> = [
    {
        id: 'standard',
        label: 'Standard Direct (2h window + CMR)',
        text: 'Dedicated door-to-door transit with 2h loading/unloading window. Standard CMR cargo transit insurance included.',
    },
    {
        id: 'express',
        label: 'Express Transit (Live GPS)',
        text: 'Direct non-stop express transit without transshipment. Driver live GPS tracking link provided upon dispatch.',
    },
    {
        id: 'tail_lift',
        label: 'Tail-Lift & Driver Assist',
        text: 'Equipped with hydraulic tail-lift (1,500 kg) and pallet jack. Driver assisted ground-level loading included.',
    },
    {
        id: 'secured',
        label: 'High-Value & Security Seal',
        text: 'Rigid box trailer with tamper-evident security seals. CMR insurance up to €100k + digital e-CMR on delivery.',
    },
    {
        id: 'temperature',
        label: 'Temp-Controlled (FRC)',
        text: 'FRC certified refrigerated transport with automated datalogger temperature records provided on handover.',
    },
    {
        id: 'customs',
        label: 'Cross-Border & Customs Support',
        text: 'Full export/import customs document management (T1 transit document, EUR.1, and export clearance support).',
    },
];

export const POPULAR_CLAUSES: Array<{ label: string; text: string }> = [
    { label: '2h free waiting', text: 'Includes 2 hours complimentary loading/unloading time.' },
    { label: 'Live GPS link', text: 'Real-time driver GPS tracking provided upon vehicle dispatch.' },
    { label: 'Tail-lift equipped', text: 'Vehicle equipped with hydraulic tail-lift and pallet jack.' },
    { label: 'Inside delivery', text: 'Ground-floor inside delivery and threshold placement included.' },
    { label: 'e-CMR POD', text: 'Instant digital Proof of Delivery with signature & photos.' },
];
