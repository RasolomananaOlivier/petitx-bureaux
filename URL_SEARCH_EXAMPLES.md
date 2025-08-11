# URL Search Parameters Examples

The search page now uses URL search parameters to manage all filter state. Here are some examples of how the URLs work:

## Basic Search

```
/search
```

- Default view with no filters applied

## Location Filter

```
/search?location=paris,lyon
```

- Filters offices in Paris and Lyon

## Posts Range

```
/search?minPosts=5&maxPosts=20
```

- Shows offices with 5-20 workstations

## Budget Range

```
/search?minPrice=1000&maxPrice=5000
```

- Shows offices with monthly rent between €1,000-€5,000

## Office Types

```
/search?officeTypes=independent,private&showCombinations=true
```

- Shows independent and private offices with combinations enabled

## Services Filter

```
/search?services=1,3,5
```

- Filters by specific service IDs

## Sorting

```
/search?sortBy=price&sortOrder=asc
```

- Sorts by price in ascending order

## Pagination

```
/search?page=2&limit=24
```

- Shows page 2 with 24 results per page

## Complex Example

```
/search?location=paris&minPosts=10&maxPosts=50&minPrice=2000&maxPrice=8000&officeTypes=private&services=1,2,3&sortBy=price&sortOrder=desc&page=1
```

- Location: Paris
- Posts: 10-50 workstations
- Budget: €2,000-€8,000/month
- Type: Private offices only
- Services: Service IDs 1, 2, 3
- Sort: Price descending
- Page: 1

## Features

1. **URL State Persistence**: All filters are saved in the URL, allowing users to:

   - Bookmark specific searches
   - Share search results via URL
   - Use browser back/forward navigation
   - Refresh the page without losing filters

2. **Component Architecture**: The search page is now split into manageable components:

   - `SearchProvider`: Wraps the page with nuqs URL state management
   - `SearchFilters`: Main filter bar with all filter options
   - `OfficeList`: Display and sorting of search results
   - `MobileViewToggle`: Switch between list and map view on mobile
   - Individual filter components for each filter type

3. **Hooks**: Custom hooks for:

   - `useSearchParams`: Manages URL search parameters with type safety
   - `useOffices`: Handles API calls and state for office data

4. **Type Safety**: All URL parameters are properly typed and validated using nuqs parsers.
