import { describe, it, beforeEach, vi, expect } from 'vitest';
import { of } from 'rxjs';
import { TicketService } from './ticket-service';
import { HttpClient } from '@angular/common/http';

describe('TicketService', () => {
    let service: TicketService;
    let httpMock: Partial<HttpClient>;

    beforeEach(() => {
        httpMock = {
            get: vi.fn(),
            post: vi.fn(),
        };

        service = new TicketService(httpMock as HttpClient);
    });

    it('should call GET /api/tickets/ on getAllTickets', () => {
        const mockData = [{ id: 1 }];
        (httpMock.get as any).mockReturnValue(of(mockData));

        const result = service.getAllTickets();

        expect(httpMock.get).toHaveBeenCalledWith('/api/tickets/');
        result.subscribe((res) => {
            expect(res).toEqual(mockData);
        });
    });

    it('should call GET /api/tickets/:id on getTicketById', () => {
        const mockData = { id: 1 };
        (httpMock.get as any).mockReturnValue(of(mockData));

        const result = service.getTicketById(1);

        expect(httpMock.get).toHaveBeenCalledWith('/api/tickets/1');
        result.subscribe((res) => {
            expect(res).toEqual(mockData);
        });
    });

    it('should call POST /api/tickets/ on createTicket', () => {
        const ticket = { subject: 'Test' };
        const mockResponse = { id: 1, ...ticket };
        (httpMock.post as any).mockReturnValue(of(mockResponse));

        const result = service.createTicket(ticket);

        expect(httpMock.post).toHaveBeenCalledWith('/api/tickets/', ticket);
        result.subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });
});
