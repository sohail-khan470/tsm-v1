// audit-log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index
} from 'typeorm'

@Entity()
@Index('idx_audit_log_entity', ['entityName', 'entityId'])
@Index('idx_audit_log_user', ['userId'])
@Index('idx_audit_log_action', ['action'])
@Index('idx_audit_log_created_at', ['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  entityName: string

  @Column()
  entityId: string

  @Column({ type: 'enum', enum: ['INSERT', 'UPDATE', 'DELETE'] })
  action: 'INSERT' | 'UPDATE' | 'DELETE'

  @Column({ type: 'jsonb', nullable: true })
  oldValues: Record<string, any> | null  // ✅ Add | null

  @Column({ type: 'jsonb', nullable: true })
  newValues: Record<string, any> | null  // ✅ Add | null

  @Column({ nullable: true })
  userId: string

  @CreateDateColumn()
  createdAt: Date
}
