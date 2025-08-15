# Bulk Import Feature for Offices

## Overview

The bulk import feature allows administrators to import up to 500 offices at once from a CSV file. This feature is designed to streamline the process of adding multiple offices to the system.

## Features

- **Maximum 500 offices per import**: Prevents system overload
- **CSV file validation**: Validates data format and content
- **Real-time preview**: Shows validation results before import
- **Error handling**: Detailed error reporting for failed imports
- **Duplicate detection**: Skips offices with existing slugs
- **Template download**: Provides a sample CSV template
- **Progress feedback**: Shows import progress and results

## CSV Format

The CSV file must have the following columns:

| Column      | Type    | Required | Description                  | Example                                          |
| ----------- | ------- | -------- | ---------------------------- | ------------------------------------------------ |
| title       | string  | Yes      | Office name                  | "Bureau moderne - Champs-Élysées"                |
| description | string  | No       | Office description           | "Bureau moderne avec vue sur les Champs-Élysées" |
| slug        | string  | Yes      | URL-friendly identifier      | "bureau-champs-elysees"                          |
| arr         | number  | Yes      | Arrondissement (1-20)        | 8                                                |
| priceCents  | number  | Yes      | Price in cents               | 150000                                           |
| nbPosts     | number  | No       | Number of workstations       | 5                                                |
| lat         | number  | Yes      | Latitude (-90 to 90)         | 48.8698                                          |
| lng         | number  | Yes      | Longitude (-180 to 180)      | 2.3077                                           |
| isFake      | boolean | No       | Test office flag             | false                                            |
| amenities   | string  | No       | Semicolon-separated services | "WiFi;Salle de réunion;Imprimante"               |

### CSV Example

```csv
title,description,slug,arr,priceCents,nbPosts,lat,lng,isFake,amenities
"Bureau moderne - Champs-Élysées","Bureau moderne avec vue sur les Champs-Élysées","bureau-champs-elysees",8,150000,5,48.8698,2.3077,false,"WiFi;Salle de réunion;Imprimante;Climatisation"
"Espace coworking - Le Marais","Espace de coworking dynamique dans le quartier du Marais","coworking-marais",3,120000,8,48.8606,2.3376,false,"WiFi;Parking;Café;Espace détente"
```

## Available Amenities

The following amenities are supported in the CSV import:

- WiFi
- Parking
- Café
- Salle de réunion
- Imprimante
- Climatisation
- Sécurité 24/7
- Réception
- Espace détente
- Terrasse

## Usage

### 1. Access the Import Feature

1. Navigate to the admin dashboard
2. Go to "Gestion des Bureaux"
3. Click the "Import CSV" button

### 2. Prepare Your CSV File

1. Download the template using the "Télécharger le modèle" button
2. Fill in your office data following the template format
3. Ensure all required fields are completed
4. Validate coordinates are within valid ranges

### 3. Import Process

1. Drag and drop your CSV file or click to select
2. Review the validation preview
3. Fix any errors if needed
4. Click "Importer" to start the import process
5. Monitor the progress and review results

## Validation Rules

### Required Fields

- **title**: Non-empty string, max 255 characters
- **slug**: Non-empty string, max 255 characters, must be unique
- **arr**: Integer between 1 and 20
- **priceCents**: Non-negative integer
- **lat**: Number between -90 and 90
- **lng**: Number between -180 and 180

### Optional Fields

- **description**: String, max 1000 characters
- **nbPosts**: Integer, minimum 1 (defaults to 1)
- **isFake**: Boolean (defaults to false)
- **amenities**: Semicolon-separated list of service names

## Error Handling

The system provides detailed error reporting:

- **Validation errors**: Field-specific validation failures
- **Duplicate slugs**: Offices with existing slugs are skipped
- **Database errors**: Transaction failures are reported
- **File format errors**: Invalid CSV structure

## API Endpoint

### POST /api/admin/offices/bulk-import

**Request Body:**

```json
{
  "offices": [
    {
      "title": "Office Name",
      "description": "Office description",
      "slug": "office-slug",
      "arr": 1,
      "priceCents": 100000,
      "nbPosts": 5,
      "lat": 48.8566,
      "lng": 2.3522,
      "isFake": false,
      "amenities": ["WiFi", "Parking"]
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Import completed: 2 created, 1 skipped",
  "results": {
    "total": 3,
    "created": 2,
    "skipped": 1,
    "errors": [
      {
        "row": 2,
        "error": "Slug already exists: existing-office"
      }
    ]
  }
}
```

## Technical Implementation

### Components

- **BulkImportDialog**: Main UI component for file upload and validation
- **API Route**: `/api/admin/offices/bulk-import` handles the import logic
- **CSV Utils**: Robust CSV parsing and generation using the `csv` package
- **Validation**: Zod schemas ensure data integrity
- **Database**: Transaction-based imports with rollback on errors

### File Structure

```
app/api/admin/offices/bulk-import/
├── route.ts                    # API endpoint
└── __tests__/
    └── route.test.ts          # API tests

app/api/admin/offices/template/
└── route.ts                   # Dynamic CSV template endpoint

components/admin/
├── bulk-import-dialog.tsx     # UI component
└── __tests__/
    └── bulk-import-dialog.test.tsx  # Component tests

lib/utils/
├── csv-utils.ts              # CSV parsing and generation utilities
└── __tests__/
    └── csv-utils.test.ts     # CSV utilities tests

public/
└── office-import-template.csv # Static sample template
```

## Testing

The feature includes comprehensive tests:

- **API Tests**: Validate endpoint behavior
- **Component Tests**: Test UI interactions
- **Validation Tests**: Ensure data validation works correctly
- **Error Handling Tests**: Verify error scenarios

Run tests with:

```bash
npm test -- app/api/admin/offices/bulk-import/__tests__/route.test.ts
npm test -- components/admin/__tests__/bulk-import-dialog.test.tsx
npm test -- lib/utils/__tests__/csv-utils.test.ts
```

## CSV Package Benefits

The implementation uses the [csv](https://www.npmjs.com/package/csv) package for robust CSV handling:

- **Reliable parsing**: Handles edge cases like quoted fields, commas in data, and special characters
- **Proper escaping**: Automatically handles CSV escaping and quoting rules
- **Stream support**: Can handle large files efficiently
- **Error handling**: Provides detailed error messages for malformed CSV
- **Standards compliance**: Follows RFC 4180 CSV specification

## Security Considerations

- **File size limit**: 5MB maximum file size
- **Row limit**: Maximum 500 offices per import
- **Input validation**: All data is validated before processing
- **Transaction safety**: Database operations use transactions
- **Error isolation**: Individual office failures don't affect others

## Performance

- **Batch processing**: Offices are processed individually for error isolation
- **Database transactions**: Ensures data consistency
- **Memory efficient**: Files are processed as streams
- **Progress feedback**: Real-time validation and import status

## Troubleshooting

### Common Issues

1. **File too large**: Ensure CSV is under 5MB
2. **Too many rows**: Limit to 500 offices per import
3. **Invalid coordinates**: Check latitude (-90 to 90) and longitude (-180 to 180)
4. **Duplicate slugs**: Ensure unique slugs for each office
5. **Invalid amenities**: Use only supported service names

### Error Messages

- "Maximum 500 offices allowed per import"
- "File size must be less than 5MB"
- "Slug already exists: [slug]"
- "Invalid CSV format"
- "Validation failed"

## Future Enhancements

Potential improvements for future versions:

- **Batch size configuration**: Allow custom batch sizes
- **Import scheduling**: Background processing for large imports
- **Progress tracking**: Real-time progress updates
- **Export functionality**: Export existing offices to CSV
- **Template customization**: Allow custom CSV templates
- **Validation preview**: Enhanced error visualization
