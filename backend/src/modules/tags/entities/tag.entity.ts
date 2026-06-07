// tag.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany
} from 'typeorm'
import { Task } from '../../tasks/entities/task.entity'



@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  name: string

  @Column({ type: 'varchar', length: 7, default: '#000000' })
  color: string  // hex color (e.g., '#FF5733')

  @ManyToMany(() => Task, task => task.tags)
  tasks: Task[]
}
