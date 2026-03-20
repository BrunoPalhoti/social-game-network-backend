import { Module } from '@nestjs/common';
import { RawgClient } from './rawg.client.js';
import { RawgService } from './rawg.service.js';

@Module({
  providers: [RawgClient, RawgService],
  exports: [RawgService],
})
export class RawgModule {}
