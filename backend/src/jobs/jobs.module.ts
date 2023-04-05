import { OnModuleDestroy } from '@nestjs/common';

export class JobsModule implements OnModuleDestroy {
  onModuleDestroy() {
    // await this.emailQueue.close();
    // await this.thumbnailQueue.close();
    // await this.reportQueue.close();
  }
}
