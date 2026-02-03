import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ticket } from '../../models/ticket.model';

@Injectable({
    providedIn: 'root',
})
export class TicketService {
    constructor(private http: HttpClient) {}

    public getAllTickets() {
        return this.http.get('/api/tickets/');
    }

    public getTicketById(id: number) {
        return this.http.get(`/api/tickets/${id}`);
    }

    public createTicket(ticket: any) {
        return this.http.post('/api/tickets/', ticket);
    }
}
