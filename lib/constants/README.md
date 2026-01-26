# Centralized Constants System

This directory contains all centralized constants, enums, and dropdown options used throughout the application. This approach ensures consistency, maintainability, and reduces code duplication.

## 📁 Structure

```
lib/constants/
├── index.ts          # Main constants file with all exports
├── README.md         # This documentation file
└── types.ts          # TypeScript types for constants (if needed)
```

## 🎯 Purpose

The centralized constants system addresses several key issues:

1. **Consistency**: Ensures all dropdowns and filters use the same values
2. **Maintainability**: Single source of truth for all constants
3. **Type Safety**: Proper TypeScript types for all constants
4. **Reusability**: Easy to import and use across components
5. **Scalability**: Easy to add new constants or modify existing ones

## 📋 Available Constants

### Property Related
- `PROPERTY_TYPES` - Available property types (Flat, Plot, Land, Mess)
- `TRANSACTION_TYPES` - Transaction types (Sell, Rent)
- `PROPERTY_CONDITIONS` - Property conditions (New, Resale, Used)
- `CONSTRUCTION_STATUSES` - Construction statuses
- `FACING_DIRECTIONS` - Property facing directions

### Location Related
- `CITIES` - Available cities
- `NEIGHBORHOODS` - Available neighborhoods

### Property Features
- `AMENITIES` - Available amenities
- `FURNISHING_TYPES` - Furnishing options
- `ROOM_OPTIONS` - Bedroom/bathroom options

### UI/UX Related
- `SORT_OPTIONS` - Sorting options for listings
- `PAGINATION_OPTIONS` - Items per page options
- `PRICE_RANGES` - Predefined price ranges

### User & Community
- `USER_TYPES` - User type categories
- `COMMUNITY_CATEGORIES` - Community categories
- `DOCUMENT_TYPES` - Document types for verification

### Filter & Display
- `FILTER_LABELS` - Human-readable labels for filters
- `DEFAULT_FILTERS` - Default filter values

## 🔧 Usage Examples

### Basic Import and Usage

```typescript
import { PROPERTY_TYPES, CITIES, AMENITIES } from '@/lib/constants';

// In a Select component
{PROPERTY_TYPES.map((type) => (
  <SelectItem key={type.value} value={type.value}>
    {type.label}
  </SelectItem>
))}
```

### Using Helper Functions

```typescript
import { getPropertyTypeLabel, getCityLabel } from '@/lib/constants';

const propertyLabel = getPropertyTypeLabel('flat'); // Returns "Flat"
const cityLabel = getCityLabel('dhaka'); // Returns "Dhaka"
```

### Using Filter Utilities

```typescript
import { formatFilterValue, getFilterLabel } from '@/lib/utils/filter-utils';

const formattedPrice = formatFilterValue('minPrice', '50000'); // Returns "₹50,000"
const filterLabel = getFilterLabel('propertyType'); // Returns "Property Type"
```

## 🏗️ Constant Structure

All constants follow a consistent structure:

```typescript
export const CONSTANT_NAME = [
  { value: 'internal_value', label: 'Display Label' },
  // ...
] as const;
```

### Example:

```typescript
export const PROPERTY_TYPES = [
  { value: 'flat', label: 'Flat' },
  { value: 'plot', label: 'Plot' },
  { value: 'land', label: 'Land' },
  { value: 'mess', label: 'Mess' },
] as const;
```

## 🛠️ Helper Functions

For each constant array, corresponding helper functions are provided:

```typescript
// Get label by value
export const getPropertyTypeLabel = (value: string): string => {
  return PROPERTY_TYPES.find(type => type.value === value)?.label || value;
};

// Get all values as array
export const getPropertyTypeValues = (): string[] => {
  return PROPERTY_TYPES.map(type => type.value);
};

// Get all labels as array
export const getPropertyTypeLabels = (): string[] => {
  return PROPERTY_TYPES.map(type => type.label);
};
```

## 📝 Adding New Constants

To add a new constant:

1. **Define the constant** in `lib/constants/index.ts`:

```typescript
export const NEW_CONSTANT = [
  { value: 'value1', label: 'Label 1' },
  { value: 'value2', label: 'Label 2' },
] as const;
```

2. **Add helper functions**:

```typescript
export const getNewConstantLabel = (value: string): string => {
  return NEW_CONSTANT.find(item => item.value === value)?.label || value;
};
```

3. **Add to filter labels** (if applicable):

```typescript
export const FILTER_LABELS = {
  // ... existing labels
  newConstantKey: 'New Constant',
} as const;
```

4. **Update filter utilities** (if needed) in `lib/utils/filter-utils.ts`

## 🔄 Migration Guide

When migrating existing hardcoded values:

### Before:
```typescript
const propertyTypes = ['Flat', 'Plot', 'Land', 'Mess'];

{propertyTypes.map((type) => (
  <SelectItem key={type} value={type.toLowerCase()}>
    {type}
  </SelectItem>
))}
```

### After:
```typescript
import { PROPERTY_TYPES } from '@/lib/constants';

{PROPERTY_TYPES.map((type) => (
  <SelectItem key={type.value} value={type.value}>
    {type.label}
  </SelectItem>
))}
```

## 🧪 Testing

When testing components that use constants:

```typescript
import { PROPERTY_TYPES } from '@/lib/constants';

// Test that all property types are rendered
PROPERTY_TYPES.forEach((type) => {
  expect(screen.getByText(type.label)).toBeInTheDocument();
});
```

## 🚀 Best Practices

1. **Always use constants** instead of hardcoded values
2. **Use helper functions** for value-to-label conversions
3. **Keep constants immutable** with `as const`
4. **Follow naming conventions**: `CONSTANT_NAME` in UPPER_SNAKE_CASE
5. **Document new constants** in this README
6. **Use TypeScript types** for better type safety
7. **Group related constants** logically
8. **Provide default values** where appropriate

## 🔍 Related Files

- `lib/utils/filter-utils.ts` - Utilities for filter formatting and validation
- `lib/schemas/property.ts` - Zod schemas that should align with constants
- `components/` - All components using these constants

## 📊 Benefits Achieved

✅ **Consistency**: All dropdowns use the same values
✅ **Maintainability**: Single place to update constants
✅ **Type Safety**: Proper TypeScript support
✅ **Performance**: No duplicate arrays in memory
✅ **Developer Experience**: Easy to find and use constants
✅ **Testing**: Easier to test with centralized values
✅ **Internationalization Ready**: Easy to add translations

## 🔮 Future Enhancements

- [ ] Add internationalization support
- [ ] Add validation schemas for constants
- [ ] Add runtime validation for constant usage
- [ ] Add automatic documentation generation
- [ ] Add constant usage analytics
- [ ] Add migration tools for new constants

---

**Note**: This centralized system is part of our commitment to maintainable, scalable, and consistent code architecture. Always refer to this documentation when working with constants in the application.