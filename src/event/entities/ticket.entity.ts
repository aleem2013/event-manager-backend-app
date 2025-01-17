import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ticketNumber: string;

  @Column({ default: false })
  attended: boolean;

  @Column({ type: 'timestamp', nullable: true })
  attendanceTimestamp: Date;

  @Column({ nullable: true })
  qrCodeUrl: string;

  @Column({ nullable: true })
  attendanceUrl: string;

  @ManyToOne(() => Event, event => event.tickets)
  event: Event;
}