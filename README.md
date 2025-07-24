# ANH Fuel API

API desarrollada en NestJS para consultar y almacenar datos de estaciones de servicio y niveles de combustible en Bolivia. Los datos se obtienen del API de FuelBol y se almacenan en Redis para consultas rápidas y búsquedas avanzadas.

## Características

- Consulta automática de datos de FuelBol cada 11 minutos (configurable).
- Almacenamiento en Redis para alta velocidad de respuesta.
- Endpoints para buscar estaciones por departamento, tipo de combustible, nombre, dirección o ID.
- Seguridad por API Key y rate limiting por IP.
- Documentación Swagger disponible en `/docs`.

## Requisitos

- Node.js >= 18
- Redis en ejecución
- Variables de entorno configuradas (ver `.env.example`)

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz con el siguiente contenido:

```
FUELBOL_API_BASE=
REDIS_HOST=
REDIS_PORT=
REFRESH_INTERVAL_MINUTES=
API_KEY=
```

## Ejecución

```bash
npm run start:dev
```

La API estará disponible en `http://localhost:3000`.

## Documentación Swagger

Accede a la documentación interactiva en:

```
http://localhost:3000/docs
```

## Endpoints principales

- `GET /fuel/all`  
  Obtiene todos los datos almacenados en Redis.

- `GET /fuel/by?departamento=cochabamba&tipo=gasolina`  
  Obtiene datos por departamento y tipo de combustible.

- `GET /fuel/search?id=2456`  
  Busca estación por ID, nombre o dirección.

- `GET /fuel/simple-search?departamento=cochabamba&tipo=gasolina&name=super`  
  Busca estaciones por departamento, tipo y filtro opcional por nombre/dirección.

