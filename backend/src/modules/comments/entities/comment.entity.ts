// comment.entity.ts

import { Task } from '../../tasks/entities/task.entity'
import { User } from '../../users/user.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  Index
} from 'typeorm'



@Entity()
@Index('idx_comments_task', ['taskId'])
@Index('idx_comments_author', ['authorId'])
@Index('idx_comments_created_at', ['createdAt'])
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  content: string

  @Column({ nullable: true })
  taskId: string

  @ManyToOne(() => Task, task => task.comments)
  task: Task

  @Column({ nullable: true })
  authorId: string

  @ManyToOne(() => User)
  author: User

  @CreateDateColumn()
  createdAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
