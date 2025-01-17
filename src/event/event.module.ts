import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { Ticket } from './entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Ticket])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}