import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'List of all events' })
  async getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event details' })
  @ApiResponse({ status: 200, description: 'Event details retrieved successfully' })
  async getEventDetails(@Param('id') id: string) {
    return this.eventService.getEventDetails(id);
  }

  @Get(':eventId/tickets/:ticketId')
  @ApiOperation({ summary: 'Get ticket details' })
  @ApiResponse({ status: 200, description: 'Ticket details retrieved successfully' })
  async getTicketDetails(
    @Param('eventId') eventId: string,
    @Param('ticketId') ticketId: string,
  ) {
    return this.eventService.getTicketDetails(eventId, ticketId);
  }

  @Get('tickets/:ticketId')
  @ApiOperation({ summary: 'Get ticket details' })
  @ApiResponse({ status: 200, description: 'Ticket details retrieved successfully' })
  async getTicketDetailsByTicketId(
    //@Param('eventId') eventId: string,
    @Param('ticketId') ticketId: string,
  ) {
    return this.eventService.getTicketDetailsByTicketId(ticketId);
  }

  @Post(':id/tickets')
  @ApiOperation({ summary: 'Create a ticket for an event' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  async createTicket(@Param('id') eventId: string) {
    return this.eventService.createTicket(eventId);
  }

  @Put('tickets/:id/attendance')  // Remove 'events' from the path
  @ApiOperation({ summary: 'Mark attendance for a ticket' })
  @ApiResponse({ status: 200, description: 'Attendance marked successfully' })
  async markAttendance(@Param('id') ticketId: string) {
      return this.eventService.markAttendance(ticketId);
  }

  // @Put('tickets/:id/attendance')
  // @ApiOperation({ summary: 'Mark attendance for a ticket' })
  // @ApiResponse({ status: 200, description: 'Attendance marked successfully' })
  // async markAttendance(@Param('id') ticketId: string) {
  //   return this.eventService.markAttendance(ticketId);
  // }
}