// src/event/event.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { Ticket } from './entities/ticket.entity';
import { CreateEventDto } from './dto/create-event.dto';
import * as QRCode from 'qrcode';
import { randomBytes } from 'crypto';
import { I18nService } from 'nestjs-i18n';


@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    private i18n: I18nService,
  ) {}

  private generateShortId(length: number = 8): string {
    return randomBytes(length).toString('hex').slice(0, length);
  }

  private generateTicketNumber(length: number = 10): string {
    return randomBytes(length).toString('hex').slice(0, length).toUpperCase();
  }

  // Fetch all Events
  async getAllEvents(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['tickets'],
      order: {
        // Assuming you want newest events first
        id: 'DESC',
      },
    });
  }

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const event = new Event();
    Object.assign(event, createEventDto);
    
    // Generate short URL using crypto instead of nanoid
    const shortId = this.generateShortId();
    event.shortUrl = `${process.env.BASE_URL}/e/${shortId}`;
    
    // Generate QR code
    event.qrCodeUrl = await QRCode.toDataURL(event.shortUrl);

    const savedEvent = await this.eventRepository.save(event);
    
    return {
      ...savedEvent,
      message: await this.i18n.translate('event.EVENT.CREATED')
    };
  }

  async getEventDetails(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['tickets'],
    });
    
    if (!event) {
      throw new NotFoundException(
        await this.i18n.translate('event.EVENT.NOT_FOUND')
      );
    }
    
    return event;
  }

  async getTicketDetails(eventId: string, ticketId: string): Promise<Ticket> {
    console.log("eventId "+eventId);
    const ticket = await this.ticketRepository.findOne({
      where: { 
        id: ticketId,
        event: { id: eventId }
      },
      relations: ['event'],
    });
    
    if (!ticket) {
      throw new NotFoundException(
        await this.i18n.translate('event.EVENT.TICKET.NOT_FOUND')
      );
    }
    
    return ticket;
  }

  async getTicketDetailsByTicketId(ticketId: string): Promise<Ticket> {
    //console.log("eventId "+eventId);
    const ticket = await this.ticketRepository.findOne({
      where: { 
        id: ticketId
      },
      relations: ['event'],
    });
    
    if (!ticket) {
      throw new NotFoundException(
        await this.i18n.translate('event.EVENT.TICKET.NOT_FOUND')
      );
    }
    
    return ticket;
  }

  async createTicket(eventId: string): Promise<Ticket> {
      const event = await this.getEventDetails(eventId);
      
      const ticket = new Ticket();
      ticket.event = event;
      ticket.ticketNumber = this.generateTicketNumber();
      
      // Save the ticket first to get the ID
      const savedTicket = await this.ticketRepository.save(ticket);
      
      // Generate frontend URL instead of API URL
      savedTicket.attendanceUrl = `${process.env.BASE_URL}/scan?ticketId=${savedTicket.id}`;
      savedTicket.qrCodeUrl = await QRCode.toDataURL(savedTicket.attendanceUrl);
      
      // Save again with the updated URLs
      const finalTicket = await this.ticketRepository.save(savedTicket);
      return {
        ...finalTicket,
        message: await this.i18n.translate('event.EVENT.TICKET.CREATED')
      };
  }

  // async createTicket(eventId: string): Promise<Ticket> {
  //     const event = await this.getEventDetails(eventId);
      
  //     const ticket = new Ticket();
  //     ticket.event = event;
  //     ticket.ticketNumber = this.generateTicketNumber();
      
  //     // Save the ticket first to get the ID
  //     const savedTicket = await this.ticketRepository.save(ticket);
      
  //     // Now generate attendance URL and QR code with the saved ticket ID
  //     savedTicket.attendanceUrl = `${process.env.BASE_URL}/api/events/tickets/${savedTicket.id}/attendance`;
  //     savedTicket.qrCodeUrl = await QRCode.toDataURL(savedTicket.attendanceUrl);
      
  //     // Save again with the updated URLs
  //     return this.ticketRepository.save(savedTicket);
  // }

  // async createTicket(eventId: string): Promise<Ticket> {
  //   const event = await this.getEventDetails(eventId);
    
  //   const ticket = new Ticket();
  //   ticket.event = event;
  //   ticket.ticketNumber = this.generateTicketNumber();

  //   // Generate attendance URL and QR code
  //   ticket.attendanceUrl = `${process.env.BASE_URL}/api/events/tickets/${ticket.id}/attendance`;
  //   ticket.qrCodeUrl = await QRCode.toDataURL(ticket.attendanceUrl);
    
  //   return this.ticketRepository.save(ticket);
  // }

  async markAttendance(ticketId: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
    });
    
    if (!ticket) {
      throw new NotFoundException(
        await this.i18n.translate('event.EVENT.TICKET.NOT_FOUND')
      );
    }
    
    ticket.attended = true;
    ticket.attendanceTimestamp = new Date();
    
    const savedTicket = await this.ticketRepository.save(ticket);
    return {
      ...savedTicket,
      message: await this.i18n.translate('event.EVENT.TICKET.ATTENDANCE_MARKED')
    };
  }
}