import { Component, inject, signal } from '@angular/core';

import { PanelModule } from 'primeng/panel';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';

import { MessageService } from 'primeng/api';
import { TicketService } from '../../services/ticket-service';

@Component({
    selector: 'app-ticket-create',
    imports: [
        PanelModule,
        FloatLabelModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        TextareaModule,
        ButtonModule,
        ToastModule,
        MessageModule,
    ],
    providers: [MessageService],
    templateUrl: './ticket-create.html',
    styleUrl: './ticket-create.css',
})
export class TicketCreate {
    ticketService = inject(TicketService);
    messageService = inject(MessageService);

    subject = '';
    email = '';
    message = '';

    loading = signal(false);
    submitted = false;

    onSubmit(form: any) {
        if (form.valid) {
            const ticket = {
                subject: this.subject,
                from_email: this.email,
                message: this.message,
            };

            this.loading.set(true);
            this.ticketService.createTicket(ticket).subscribe({
                next: (data) => {
                    this.showSuccess();
                    this.resetForm(form);
                    window.location.reload();
                },
                error: (err) => {
                    console.error(err);
                    this.showError();
                    this.resetForm(form);
                },
            });
        }
    }

    showSuccess() {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Ticket successfully created!',
        });
    }

    showError() {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create ticket :(',
        });
    }

    resetForm(form: any) {
        this.loading.set(false);
        form.reset();
    }
}
