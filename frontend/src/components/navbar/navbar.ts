import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { TicketCreate } from '../ticket-create/ticket-create';
import { Ticket } from '../../models/ticket.model';

@Component({
    selector: 'app-navbar',
    imports: [ButtonModule, DialogModule, TicketCreate],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css',
})
export class Navbar {
    create_dialog_visible = false;

    onCreateClick() {
        this.create_dialog_visible = true;
    }

    onTicketCreated(ticket: Ticket) {
        this.create_dialog_visible = false;
    }
}
