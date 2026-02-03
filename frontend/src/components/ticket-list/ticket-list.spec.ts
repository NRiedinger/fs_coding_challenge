import { ComponentFixture } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TicketList } from './ticket-list';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket-service/ticket-service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

describe('TicketList', () => {
    let component: TicketList;
    let fixture: ComponentFixture<TicketList>;

    const mockTickets: Ticket[] = [
        { id: 1, subject: 'Test 1', priority: 'Low', category: 'Bug' } as Ticket,
        { id: 2, subject: 'Test 2', priority: 'High', category: 'Feature' } as Ticket,
    ];

    let ticketServiceMock: Partial<TicketService>;
    let messageServiceMock: Partial<MessageService>;
    let routerMock: Partial<Router>;

    beforeEach(async () => {
        ticketServiceMock = {
            getAllTickets: vi.fn(),
        };

        messageServiceMock = {
            add: vi.fn(),
        };

        routerMock = {
            navigate: vi.fn(),
        };

        component = new TicketList(
            ticketServiceMock as TicketService,
            messageServiceMock as MessageService,
            routerMock as Router,
        );
    });

    it('should load tickets on init', () => {
        (ticketServiceMock.getAllTickets as any).mockReturnValue(of(mockTickets));

        component.ngOnInit();

        expect(component.loading).toBe(false);
        expect(component.tickets()).toEqual(mockTickets);
    });

    it('should show error toast if loading fails', () => {
        (ticketServiceMock.getAllTickets as any).mockReturnValue(
            throwError(() => new Error('API Error')),
        );

        component.ngOnInit();

        expect(messageServiceMock.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load tickets :(',
        });

        expect(component.loading).toBe(false);
    });

    it('should navigate to ticket detail on click', () => {
        component.onTicketClick(42);

        expect(routerMock.navigate).toHaveBeenCalledWith(['/tickets', 42]);
    });

    it('should go to next page', () => {
        component.first = 0;
        component.rows = 10;

        component.next();

        expect(component.first).toBe(10);
    });

    it('should go to previous page and not below zero', () => {
        component.first = 10;
        component.rows = 10;

        component.prev();
        expect(component.first).toBe(0);

        component.prev();
        expect(component.first).toBe(0);
    });

    it('should reset pagination', () => {
        component.first = 20;
        component.reset();

        expect(component.first).toBe(0);
    });

    it('should update page on pageChange', () => {
        component.pageChange({ first: 20, rows: 25 });

        expect(component.first).toBe(20);
        expect(component.rows).toBe(25);
    });

    it('should detect first page', () => {
        component.first = 0;
        expect(component.isFirstPage()).toBe(true);
    });

    it('should detect last page', () => {
        component.tickets.set(mockTickets);
        component.first = 0;
        component.rows = 10;

        expect(component.isLastPage()).toBe(true);
    });

    it('should return correct priority severity', () => {
        expect(component.getPrioritySeverity('Low')).toBe('success');
        expect(component.getPrioritySeverity('Medium')).toBe('warn');
        expect(component.getPrioritySeverity('High')).toBe('danger');
    });
});
