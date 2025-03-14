export interface Announcement {
    _id?: string;
    title: string;
    content: string;
    from: string;
    until: string;
    budget?: number | string;
    currencyType: string
    imageUrl?: string;
    invoice?: boolean;
    reviewed?: string;
    applyState?: boolean,
    maxMilestone?: number
}