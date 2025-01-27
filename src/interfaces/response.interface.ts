// src/interfaces/response.interface.ts
import { Event } from '../event/entities/event.entity';
import { Ticket } from '../event/entities/ticket.entity';

export interface BaseResponse {
  message: string;
}

export interface EventResponse extends BaseResponse {
  data: Event;
}

export interface EventListResponse extends BaseResponse {
  data: Event[];
}

export interface TicketResponse extends BaseResponse {
  data: Ticket;
}