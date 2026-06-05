
import { Attachment } from '@/modules/attachments/entities/attachment.entity'
import { Comment } from '@/modules/comments/entities/comment.entity'
import { Project } from '@/modules/projects/entities/project.entity'
import { Tag } from '@/modules/tags/entities/tag.entity'
import { User } from '@/modules/users/user.entity'

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index
} from 'typeorm'


export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  BACKLOG = 'BACKLOG',
  CANCELLED = 'CANCELLED'
}

@Entity("tasks")
@Index('idx_tasks_project_status', ['projectId', 'status'])
@Index('idx_tasks_assignee', ['assigneeId'])
@Index('idx_tasks_due_date', ['dueDate'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ nullable: true, type: 'text' })
  description: string

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus

  @Column({ nullable: true })
  dueDate: Date

  @Column({ nullable: true })
  projectId: string

  @ManyToOne(() => Project, project => project.tasks, { onDelete: 'CASCADE' })
  project: Project  // CASCADE means if a project is deleted, all its tasks are deleted too

  @Column({ nullable: true })
  assigneeId: string

  @ManyToOne(() => User, { nullable: true })
  assignee: User

  @Column({ nullable: true })
  parentTaskId: string  // self-referential for hierarchical tasks

  @ManyToOne(() => Task, task => task.subtasks, { nullable: true })
  parentTask: Task  // adjacency list pattern

  @OneToMany(() => Task, task => task.parentTask)
  subtasks: Task[]

  @ManyToMany(() => Tag, tag => tag.tasks)
  @JoinTable()  // @JoinTable() goes on the owning side only
  tags: Tag[]

  @OneToMany(() => Comment, comment => comment.task)
  comments: Comment[]

  @OneToMany(() => Attachment, attachment => attachment.task)
  attachments: Attachment[]


  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>  // JSONB for arbitrary key-value pairs; PostgreSQL can index inside JSONB fields

  @VersionColumn()
  version: number  // optimistic locking: TypeORM increments this on every update and adds it to WHERE clauses; if two requests try to update the same row simultaneously, the second one fails with OptimisticLockVersionMismatch

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
