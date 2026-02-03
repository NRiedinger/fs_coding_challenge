import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket-service/ticket-service';
import { Ticket } from '../../models/ticket.model';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { IftaLabelModule } from 'primeng/iftalabel';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
        SkeletonModule,
        ToastModule,
    ],
    providers: [MessageService],
    templateUrl: './ticket-detail.html',
    styleUrl: './ticket-detail.css',
})
export class TicketDetail {
    loading = true;
    ticket = signal<Ticket | null>(null);
    reply = signal<string>('');

    constructor(
        private ticketService: TicketService,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loading = true;
        this.activatedRoute.params.subscribe((params: any) => {
            this.ticketService.getTicketById(params.id).subscribe({
                next: (data) => {
                    const ticket = data as Ticket;
                    this.ticket.set(ticket);
                    this.reply.set(ticket.suggested_reply);
                    this.loading = false;
                },
                error: (error) => {
                    // console.error(error);
                    this.showError();
                    this.loading = false;
                },
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

    showError() {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed load ticket :(',
        });
    }
}
