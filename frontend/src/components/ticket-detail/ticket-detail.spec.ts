import { describe, it, beforeEach, vi, expect } from 'vitest';
import { of, throwError } from 'rxjs';

import { TicketDetail } from './ticket-detail';
import { TicketService } from '../../services/ticket-service/ticket-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Ticket } from '../../models/ticket.model';

describe('TicketDetail', () => {
    let component: TicketDetail;

    const mockTicket: Ticket = {
        id: 1,
        subject: 'Test Ticket',
        priority: 'High',
        category: 'Bug',
        suggested_reply: 'Reply Text',
        from_email: 'user@example.com',
    } as Ticket;

    let ticketServiceMock: Partial<TicketService>;
    let activatedRouteMock: Partial<ActivatedRoute>;
    let messageServiceMock: Partial<MessageService>;
    let routerMock: Partial<Router>;

    beforeEach(() => {
        ticketServiceMock = {
            getTicketById: vi.fn(),
        };

        activatedRouteMock = {
            params: of({ id: 1 }),
        };

        messageServiceMock = {
            add: vi.fn(),
        };

        routerMock = {
            navigate: vi.fn(),
        };

        component = new TicketDetail(
            ticketServiceMock as TicketService,
            activatedRouteMock as ActivatedRoute,
            messageServiceMock as MessageService,
            routerMock as Router,
        );
    });

    it('should load ticket on init successfully', () => {
        (ticketServiceMock.getTicketById as any).mockReturnValue(of(mockTicket));

        component.ngOnInit();

        expect(component.loading).toBe(false);
        expect(component.ticket()).toEqual(mockTicket);
        expect(component.reply()).toBe(mockTicket.suggested_reply);
    });

    it('should handle error during ticket load', () => {
        (ticketServiceMock.getTicketById as any).mockReturnValue(
            throwError(() => new Error('API Error')),
        );

        component.ngOnInit();

        expect(component.loading).toBe(false);
        expect(messageServiceMock.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed load ticket :(',
        });
    });

    it('should return correct priority severity', () => {
        expect(component.getPrioritySeverity('Low')).toBe('success');
        expect(component.getPrioritySeverity('Medium')).toBe('warn');
        expect(component.getPrioritySeverity('High')).toBe('danger');
        expect(component.getPrioritySeverity(undefined)).toBe('success'); // default
    });

    it('should navigate back', () => {
        component.onNavigateBack();

        expect(routerMock.navigate).toHaveBeenCalledWith(['/tickets']);
    });

    it('should open mailto URL on send', () => {
        (ticketServiceMock.getTicketById as any).mockReturnValue(of(mockTicket));

        component.ngOnInit();

        // Mock window.open
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

        component.onSend();

        expect(openSpy).toHaveBeenCalledWith(
            `mailto:${mockTicket.from_email}?subject=Re: ${mockTicket.subject}&body=${mockTicket.suggested_reply}`,
            '_self',
        );

        openSpy.mockRestore();
    });

    it('should show error toast', () => {
        component.showError();

        expect(messageServiceMock.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed load ticket :(',
        });
    });
});
