import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket-service';
import { Ticket } from '../../models/ticket.model';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-ticket-detail',
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        TextareaModule,
        IftaLabelModule,
        ButtonModule,
        MessageModule,
        PanelModule,
        TagModule,
    ],
    templateUrl: './ticket-detail.html',
    styleUrl: './ticket-detail.css',
})
export class TicketDetail {
    ticketService = inject(TicketService);
    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);

    ticket = signal<Ticket | null>(null);
    reply = signal<string>('');

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: any) => {
            this.ticketService.getTicketById(params.id).subscribe((data: any) => {
                const ticket = data;
                console.log(ticket);
                this.ticket.set(ticket);

                this.reply.set(ticket.suggested_reply);
            });
        });
    }

    getPrioritySeverity(prio: string | undefined) {
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

    onSend() {
        const url = `mailto:${this.ticket()?.from_email}?subject=Re: ${this.ticket()?.subject}&body=${this.reply()}`;
        window.open(url, '_self');
    }

    onNavigateBack() {
        this.router.navigate(['/tickets']);
    }
}
