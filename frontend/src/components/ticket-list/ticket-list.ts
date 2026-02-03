import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { TicketService } from '../../services/ticket-service/ticket-service';
import { Ticket } from '../../models/ticket.model';
import { Router } from '@angular/router';
import { TicketCreate } from '../ticket-create/ticket-create';
import { DialogModule } from 'primeng/dialog';

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'app-ticket-list',
    imports: [
        TicketCreate,
        DialogModule,
        TableModule,
        FormsModule,
        ButtonModule,
        TagModule,
        CommonModule,
        SkeletonModule,
        MultiSelectModule,
        MessageModule,
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './ticket-list.html',
    styleUrl: './ticket-list.css',
})
export class TicketList {
    tickets = signal<Ticket[]>([]);
    loading = true;
    create_dialog_visible = false;

    first: number = 0;
    rows: number = 10;

    priorityOptions = [
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
        { label: 'High', value: 'High' },
    ];

    categoryOptions = [
        { label: 'Billing', value: 'Billing' },
        { label: 'Bug', value: 'Bug' },
        { label: 'Feature', value: 'Feature' },
        { label: 'Account', value: 'Account' },
        { label: 'Other', value: 'Other' },
    ];

    constructor(
        private ticketService: TicketService,
        private messageService: MessageService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.tickets.set(Array.from({ length: 10 }).map((_, i) => ({}) as Ticket));
        this.updateData();
    }

    updateData() {
        this.loading = true;

        this.ticketService.getAllTickets().subscribe({
            next: (data) => {
                this.tickets.set(data as Ticket[]);
                this.loading = false;
            },
            error: (error) => {
                this.showError();
                this.loading = false;
            },
        });
    }

    onTicketClick(id: any) {
        this.router.navigate(['/tickets', id]);
    }

    onCreateClick() {
        this.create_dialog_visible = true;
    }

    next() {
        this.first += this.rows;
    }

    prev() {
        this.first -= this.rows;
        if (this.first < 0) this.first = 0;
    }

    reset() {
        this.first = 0;
    }

    pageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }

    isLastPage(): boolean {
        return this.tickets() ? this.first + this.rows >= this.tickets().length : true;
    }

    isFirstPage(): boolean {
        return this.tickets() ? this.first === 0 : true;
    }

    getPrioritySeverity(prio: string) {
        switch (prio) {
            default:
            case 'Low':
                return 'success';
            case 'Medium':
                return 'warn';
            case 'High':
                return 'danger';
        }
    }

    showError() {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load tickets :(',
        });
    }
}
