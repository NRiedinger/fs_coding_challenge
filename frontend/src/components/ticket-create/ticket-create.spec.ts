import { describe, it, beforeEach, vi, expect } from 'vitest';
import { of, throwError } from 'rxjs';
import { TicketCreate } from './ticket-create';
import { TicketService } from '../../services/ticket-service/ticket-service';
import { MessageService } from 'primeng/api';

describe('TicketCreate', () => {
    let component: TicketCreate;
    let ticketServiceMock: Partial<TicketService>;
    let messageServiceMock: Partial<MessageService>;

    // Mock-Formular
    const mockForm = {
        valid: true,
        reset: vi.fn(),
    };

    beforeEach(() => {
        ticketServiceMock = {
            createTicket: vi.fn(),
        };

        messageServiceMock = {
            add: vi.fn(),
        };

        component = new TicketCreate(
            ticketServiceMock as TicketService,
            messageServiceMock as MessageService,
        );

        // Initialwerte
        component.subject = 'Test Subject';
        component.email = 'test@example.com';
        component.message = 'Test Message';
    });

    it('should submit ticket successfully', () => {
        (ticketServiceMock.createTicket as any).mockReturnValue(of({ id: 1 }));

        component.onSubmit(mockForm);

        expect(component.loading()).toBe(false);
        expect(messageServiceMock.add).toHaveBeenCalledWith({
            severity: 'success',
            summary: 'Success',
            detail: 'Ticket successfully created!',
        });
        expect(mockForm.reset).toHaveBeenCalled();
    });

    it('should handle error on ticket submission', () => {
        (ticketServiceMock.createTicket as any).mockReturnValue(
            throwError(() => new Error('API Error')),
        );

        component.onSubmit(mockForm);

        expect(component.loading()).toBe(false);
        expect(messageServiceMock.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create ticket :(',
        });
        expect(mockForm.reset).toHaveBeenCalled();
    });

    it('should not submit if form is invalid', () => {
        const invalidForm = { valid: false, reset: vi.fn() };
        component.onSubmit(invalidForm);

        expect(ticketServiceMock.createTicket).not.toHaveBeenCalled();
        expect(invalidForm.reset).not.toHaveBeenCalled();
    });

    it('should show success message manually', () => {
        component.showSuccess();

        expect(messageServiceMock.add).toHaveBeenCalledWith({
            severity: 'success',
            summary: 'Success',
            detail: 'Ticket successfully created!',
        });
    });

    it('should show error message manually', () => {
        component.showError();

        expect(messageServiceMock.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create ticket :(',
        });
    });

    it('should reset form and set loading false', () => {
        const formSpy = { reset: vi.fn() };
        component.loading.set(true);

        component.resetForm(formSpy);

        expect(component.loading()).toBe(false);
        expect(formSpy.reset).toHaveBeenCalled();
    });
});
