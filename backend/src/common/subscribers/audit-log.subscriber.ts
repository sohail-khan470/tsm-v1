// backend/src/common/subscribers/audit-log.subscriber.ts
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
  DataSource,
} from 'typeorm'
import { Injectable } from '@nestjs/common'
import { AuditLog } from 'src/modules/audit/entities/audit-log.entity'

@Injectable()
@EventSubscriber()
export class AuditLogSubscriber implements EntitySubscriberInterface {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this)
  }

  async afterInsert(event: InsertEvent<any>): Promise<void> {
    if (event.entity instanceof AuditLog) {
      return
    }

    const auditLog = new AuditLog()
    auditLog.entityName = event.metadata.tableName
    auditLog.entityId = this.extractEntityId(event.entity, event.metadata)
    auditLog.action = 'INSERT'
    auditLog.newValues = this.sanitizeEntity(event.entity)
    auditLog.oldValues = null
    auditLog.userId = this.extractUserId(event)

    await event.manager.save(AuditLog, auditLog)
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<void> {
    if (event.entity instanceof AuditLog) {
      return
    }

    if (!event.databaseEntity || !event.entity) {
      return
    }

    const auditLog = new AuditLog()
    auditLog.entityName = event.metadata.tableName
    auditLog.entityId = this.extractEntityId(event.entity, event.metadata)
    auditLog.action = 'UPDATE'
    auditLog.oldValues = this.sanitizeEntity(event.databaseEntity)
    auditLog.newValues = this.sanitizeEntity(event.entity)
    auditLog.userId = this.extractUserId(event)

    await event.manager.save(AuditLog, auditLog)
  }

  async afterRemove(event: RemoveEvent<any>): Promise<void> {
    if (event.entity instanceof AuditLog) {
      return
    }

    const auditLog = new AuditLog()
    auditLog.entityName = event.metadata.tableName
    auditLog.entityId = this.extractEntityId(
      event.databaseEntity || event.entity,
      event.metadata
    )
    auditLog.action = 'DELETE'
    auditLog.oldValues = this.sanitizeEntity(event.databaseEntity || event.entity)
    auditLog.newValues = null
    auditLog.userId = this.extractUserId(event)

    await event.manager.save(AuditLog, auditLog)
  }

  /**
   * Extracts entity ID safely - always returns a string
   */
  private extractEntityId(entity: any, metadata: any): string {
    if (!entity) {
      return 'unknown'
    }

    // Try to get id from common patterns
    if (entity.id !== undefined && entity.id !== null) {
      return String(entity.id)
    }

    // Try to get from primary columns metadata
    if (metadata.primaryColumns && metadata.primaryColumns.length > 0) {
      const primaryColumn = metadata.primaryColumns[0]
      const propertyName = primaryColumn.propertyName
      if (entity[propertyName] !== undefined && entity[propertyName] !== null) {
        return String(entity[propertyName])
      }
    }

    return 'unknown'
  }

  /**
   * Extracts the current user ID from the request context.
   */
  private extractUserId(
  event: InsertEvent<any> | UpdateEvent<any> | RemoveEvent<any>
): string {
  // Implement based on your auth strategy
  return 'defaultUserId'; // or any other default value
}

  /**
   * Sanitizes entity data to remove sensitive information and circular references.
   */
  private sanitizeEntity(entity: any): Record<string, any> | null {
    if (!entity) return null

    const sanitized = { ...entity }

    // Remove sensitive fields
    const sensitiveFields = ['password', 'passwordHash', 'secret', 'token']
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]'
      }
    }

    // Remove TypeORM internal properties
    delete sanitized['__has_loaded_relations']
    delete sanitized['__has_loaded_embeddeds']
    delete sanitized['__typeorm_metadata']

    // Handle circular references
    try {
      JSON.stringify(sanitized)
      return sanitized
    } catch (error) {
      const simplified: Record<string, any> = {}
      for (const [key, value] of Object.entries(sanitized)) {
        if (typeof value !== 'object' || value === null || value instanceof Date) {
          simplified[key] = value
        } else if (value instanceof Object && 'id' in value) {
          simplified[key] = { id: value.id }
        }
      }
      return simplified
    }
  }
}
