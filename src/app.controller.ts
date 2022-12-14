import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/counter/:id')
  async getCounterMethod(@Param('id') id: number): Promise<string> {
    return await this.appService.getCounterMethod(+id);
  }
}
