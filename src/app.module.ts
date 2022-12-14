import { RedisModule } from '@liaoliaots/nestjs-redis';
import { HttpModule } from '@nestjs/axios';
import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: (await redisStore({
          url: 'redis://localhost:63791',
          ttl: 100,
        })) as unknown as CacheStore,
      }),
    }),
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 63791,
      },
    }),
    PokemonModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
