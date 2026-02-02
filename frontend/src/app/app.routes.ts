import { Routes } from '@angular/router';
import { TicketList } from '../components/ticket-list/ticket-list';
import { TicketDetail } from '../components/ticket-detail/ticket-detail';
import { TicketCreate } from '../components/ticket-create/ticket-create';

export const routes: Routes = [
    {
        path: 'tickets',
        component: TicketList,
    },
    {
        path: 'tickets/:id',
        component: TicketDetail,
    },
    {
        path: '**',
        redirectTo: 'tickets',
    },
];
