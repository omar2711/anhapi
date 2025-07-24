import { Controller, Get, Query } from '@nestjs/common';
import { FuelService } from './fuel.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../common/api-key.guard';




const DEPARTAMENTOS_MAP = {
  chuquisaca: 1,
  la_paz: 2,
  cochabamba: 3,
  oruro: 4,
  potosi: 5,
  tarija: 6,
  santa_cruz: 7,
  beni: 8,
  pando: 9,
};

const TIPOS_MAP = {
  gasolina: 0,
  gasolina_premium: 1,
  diesel: 2,
  diesel_uls: 3,
};

@ApiTags('fuel')
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key para autenticación',
  required: true,
})
@UseGuards(ApiKeyGuard)
@Controller('fuel')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los datos de combustible almacenados en Redis' })
  @ApiResponse({ status: 200, description: 'Datos obtenidos correctamente.' })
  async getAllFuelData() {
    return this.fuelService.getAllFromRedis();
  }

  @Get('by')
  @ApiOperation({ summary: 'Obtener datos de combustible por departamento y tipo' })
  @ApiQuery({ name: 'departamento', type: String, required: true, example: '1' })
  @ApiQuery({ name: 'tipo', type: String, required: true, example: '0' })
  @ApiResponse({ status: 200, description: 'Datos obtenidos correctamente.' })
  async getByDeptAndType(
    @Query('departamento') departamento: string,
    @Query('tipo') tipo: string,
  ) {
    return this.fuelService.getFromRedis(departamento, tipo);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar estación de servicio por id, nombre o dirección' })
  @ApiQuery({ name: 'id', type: Number, required: false })
  @ApiQuery({ name: 'name', type: String, required: false })
  @ApiQuery({ name: 'direction', type: String, required: false })
  @ApiResponse({ status: 200, description: 'Resultados de la búsqueda.' })
  async search(
    @Query('id') id?: number,
    @Query('name') name?: string,
    @Query('direction') direction?: string,
  ) {
    return this.fuelService.searchStations({
      id: id ? Number(id) : undefined,
      name,
      direction,
    });
  }

}
