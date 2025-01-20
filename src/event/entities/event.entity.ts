import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  address: string;

  @Column()
  googleMapsUrl: string;

  @Column()
  qrCodeUrl: string;

  @Column()
  shortUrl: string;

  @Column()
  numberOfDays: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @ManyToOne(() => User, user => user.organizedEvents)
  organizer: User;

  @OneToMany(() => Ticket, ticket => ticket.event)
  tickets: Ticket[];
}