export enum TicketCategory {
    BILLING = 'Billing',
    BUG = 'Bug',
    FEATURE = 'Feature',
    ACCOUNT = 'Account',
    OTHER = 'Other',
}

export enum TicketPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
}

export interface Ticket {
    id: number;
    owner: string;
    subject: string;
    from_email: string;
    message: string;
    created_at: string;
    category: TicketCategory;
    priority: TicketPriority;
    summary?: string;
    suggested_reply?: string;
    feedback_accepted?: boolean | null;
}
