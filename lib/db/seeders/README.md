# Database Seeders

This directory contains modular seeders for populating the database with test data.

## Structure

- `index.ts` - Exports all seeder functions
- `services.seeder.ts` - Seeds services data (WiFi, Parking, etc.)
- `offices.seeder.ts` - Seeds offices data with comprehensive Paris locations

## Usage

### Running all seeders

```bash
npm run db:seed
```

### Individual seeders

```typescript
import { seedServices, seedOffices } from "@/lib/db/seeders";

// Seed services first
const services = await seedServices();

// Then seed offices (requires services for relationships)
const offices = await seedOffices(services);
```

## Office Locations

The offices seeder includes 21 offices strategically located around Paris:

### Central Paris (1er-6ème)

- **Louvre** (1er) - Premium office with Louvre views
- **Le Marais** (3ème) - Creative studio in historic district
- **Île de la Cité** (4ème) - Office with Notre-Dame views
- **Quartier Latin** (5ème) - Test office for filters
- **Saint-Germain** (6ème) - Traditional office in prestigious area

### Left Bank (7ème-13ème)

- **Champ de Mars** (7ème) - Office with direct Eiffel Tower views
- **Invalides** (7ème) - Office with Seine and Invalides views
- **Champs-Élysées** (8ème) - Modern office with avenue views
- **Arc de Triomphe** (8ème) - Office with Arc de Triomphe views
- **Opéra** (9ème) - Flexible workspace near Opéra Garnier
- **Canal Saint-Martin** (10ème) - Collaborative space by the canal
- **République** (11ème) - Dynamic coworking space
- **Bastille** (11ème) - Modern studio in vibrant area
- **Oberkampf** (11ème) - Loft studio in trendy neighborhood
- **Bibliothèque** (13ème) - Innovation hub near BNF
- **Station F** (13ème) - Startup space near Station F

### Right Bank (16ème-20ème)

- **Trocadéro** (16ème) - Elegant office with Eiffel Tower views
- **Pigalle** (18ème) - Office with Montmartre views
- **Buttes-Chaumont** (19ème) - Ecological office near the park
- **Belleville** (20ème) - Artistic studio in multicultural area

### La Défense

- **La Défense** (92) - Tech space in business district

## Services

Each office is equipped with various services:

- WiFi
- Parking
- Café
- Meeting rooms
- Printer
- Air conditioning
- 24/7 security
- Reception
- Relaxation area
- Terrace

## Data Structure

### Office Data

```typescript
interface OfficeData {
  title: string;
  description: string;
  slug: string;
  arr: number; // Arrondissement
  priceCents: number;
  nbPosts: number;
  lat: number;
  lng: number;
  isFake: boolean;
  publishedAt: Date;
}
```

### Service Data

```typescript
interface ServiceData {
  name: string;
  icon: string; // Lucide React icon name
}
```

## Adding New Seeders

1. Create a new seeder file: `new-entity.seeder.ts`
2. Export the seeder function
3. Add the export to `index.ts`
4. Update the main `seed.ts` file if needed

## Testing

The seeders are designed to be idempotent - they can be run multiple times safely. Existing data will be skipped with a warning message.
