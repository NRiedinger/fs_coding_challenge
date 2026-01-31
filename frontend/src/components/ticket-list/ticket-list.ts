import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { TicketService } from '../../services/ticket-service';
import { Ticket } from '../../models/ticket.model';

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'app-ticket-list',
    imports: [TableModule, FormsModule, ButtonModule],
    templateUrl: './ticket-list.html',
    styleUrl: './ticket-list.css',
})
export class TicketList {
    ticketService = inject(TicketService);
    tickets = signal<Ticket[]>([]);
    columns = signal<Column[]>([
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
        { field: 'category', header: 'Category' },
        { field: 'quantity', header: 'Quantity' },
    ]);

    ngOnInit() {
        this.ticketService.getAllTickets().subscribe((data: any) => {
            const tickets = data.results;
            console.log(tickets);
            this.tickets.set(tickets);
        });
    }
}
