// attachment.entity.ts
import { Task } from 'src/modules/tasks/entities/task.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index
} from 'typeorm'

import { User } from 'src/modules/users/user.entity'

@Entity()
@Index('idx_attachments_task', ['taskId'])
@Index('idx_attachments_uploaded_by', ['uploadedById'])
@Index('idx_attachments_is_orphan', ['isOrphan'])
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  filename: string

  @Column()
  originalName: string

  @Column()
  mimeType: string

  @Column({ type: 'bigint' })
  size: number

  @Column()
  s3Key: string

  @Column()
  s3Bucket: string

  @Column({ default: false })
  isOrphan: boolean

  @Column({ nullable: true })
  taskId: string

  @ManyToOne(() => Task, task => task.attachments, { onDelete: 'CASCADE' })
  task: Task

  @Column({ nullable: true })
  uploadedById: string

  @ManyToOne(() => User)
  uploadedBy: User

  @CreateDateColumn()
  createdAt: Date
}
