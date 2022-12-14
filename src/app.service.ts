import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRedis() private readonly redisService: Redis,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getCounterMethod(id: number): Promise<string> {
    const cachedData = await this.redisService.hgetall(
      `pok:hsh:${id.toString()}`,
    );

    if (cachedData && cachedData.name) {
      console.log(`Getting data ${id} from cache!`);
      console.log(cachedData);
      return `${cachedData.name}`;
    }

    const { data } = await this.httpService.axiosRef.get(
      `https://pokeapi.co/api/v2/encounter-method/${id}`,
    );

    console.log(data);

    await this.redisService.hmset(
      `pok:hsh:${id.toString()}`,
      `name`,
      `${data.name}`,
    );
    console.log(`Setting data ${id} to cache!`);
    return `${data.name}`;
  }
}
