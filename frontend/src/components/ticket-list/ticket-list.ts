import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { TicketService } from '../../services/ticket-service';
import { Ticket } from '../../models/ticket.model';
import { Router } from '@angular/router';

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'app-ticket-list',
    imports: [TableModule, FormsModule, ButtonModule, TagModule, CommonModule],
    templateUrl: './ticket-list.html',
    styleUrl: './ticket-list.css',
})
export class TicketList {
    ticketService = inject(TicketService);
    tickets = signal<Ticket[]>([]);

    router = inject(Router);

    first: number = 0;
    rows: number = 10;

    ngOnInit() {
        this.ticketService.getAllTickets().subscribe((data) => {
            this.tickets.set(data as Ticket[]);
        });
    }

    onTicketClick(id: any) {
        this.router.navigate(['/tickets', id]);
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
}
