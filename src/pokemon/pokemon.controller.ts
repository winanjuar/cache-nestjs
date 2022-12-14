import { Controller, Get, Param } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly service: PokemonService) {}

  @Get('/:id')
  async getPokemon(@Param('id') id: number): Promise<string> {
    return await this.service.getPokemon(+id);
  }

  @Get('/counter/:id')
  async getCounterMethod(@Param('id') id: number): Promise<string> {
    return await this.service.getCounterMethod(+id);
  }
}
