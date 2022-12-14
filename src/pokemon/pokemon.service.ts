import { RedisService } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Redis } from 'ioredis';

@Injectable()
export class PokemonService {
  private readonly redisService: Redis;
  constructor(
    private readonly httpService: HttpService,
    private readonly redis: RedisService, // @InjectRedis() private readonly redisService: Redis,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {
    this.redisService = this.redis.getClient();
  }

  async getPokemon(id: number): Promise<string> {
    const cachedData = await this.cacheService.get<{ name: string }>(
      id.toString(),
    );

    if (cachedData) {
      console.log(`Getting data ${id} from cache!`);
      return `${cachedData.name}`;
    }

    const { data } = await this.httpService.axiosRef.get(
      `https://pokeapi.co/api/v2/pokemon/${id}`,
    );
    await this.cacheService.set(id.toString(), data);

    console.log(`Setting data ${id} to cache!`);
    return `${data.name}`;
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
