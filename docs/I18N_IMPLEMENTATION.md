# Internationalization (i18n) Implementation Guide

This document provides a comprehensive guide for the internationalization implementation in the AmarPlot application.

## Overview

The application supports multiple languages with a focus on English and Bengali (Bangla). The i18n system is built using `react-i18next` and `i18next` libraries.

## File Structure

```
public/locales/
├── en/                     # English translations
│   ├── common.json         # Common UI elements, hero, categories
│   ├── navigation.json     # Header, footer, navigation
│   ├── forms.json          # Form labels, validation messages
│   └── constants.json      # Property types, cities, amenities
└── bn/                     # Bengali translations
    ├── common.json         # Common UI elements, hero, categories
    ├── navigation.json     # Header, footer, navigation
    ├── forms.json          # Form labels, validation messages
    └── constants.json      # Property types, cities, amenities
```

## Configuration

### i18n Setup (`lib/i18n.ts`)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common', 'navigation', 'forms', 'constants'], // Available namespaces
    defaultNS: 'common',
    react: {
      useSuspense: false,
    },
  });

export default i18n;
```

## Translation Namespaces

### 1. Common (`common.json`)
Contains general UI elements, loading states, hero section, and categories.

**Key sections:**
- `ui`: Basic UI elements (loading, error, success messages)
- `app`: Application title and subtitle
- `hero`: Homepage hero section content
- `categories`: Property category descriptions
- `property`: Property-related labels and messages
- `pages`: Page-specific content

### 2. Navigation (`navigation.json`)
Contains header, footer, and navigation-related translations.

**Key sections:**
- `header`: Navigation links, user menu, notifications
- `footer`: Footer links, contact information, copyright

### 3. Forms (`forms.json`)
Contains form labels, placeholders, validation messages, and button text.

**Key sections:**
- `auth`: Login/registration forms
- `property`: Property listing forms
- `search`: Search and filter forms
- `contact`: Contact forms

### 4. Constants (`constants.json`)
Contains translations for property-related constants and dropdown options.

**Key sections:**
- `property_types`: Land, Flat, Plot, Mess, House
- `transaction_types`: For Sale, For Rent
- `cities`: Dhaka, Chittagong, Sylhet, etc.
- `amenities`: Parking, Lift, Security, etc.
- `sort_options`: Price, Date, Views, etc.

## Usage in Components

### Basic Usage

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  );
}
```

### Multiple Namespaces

```typescript
import { useTranslation } from 'react-i18next';

function PropertyForm() {
  const { t } = useTranslation(['forms', 'constants']);
  
  return (
    <form>
      <label>{t('forms:property.property_title')}</label>
      <select>
        <option>{t('constants:property_types.Flat')}</option>
        <option>{t('constants:property_types.House')}</option>
      </select>
    </form>
  );
}
```

### Language Switching

```typescript
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
  };
  
  return (
    <button onClick={toggleLanguage}>
      {i18n.language === 'en' ? 'বাংলা' : 'English'}
    </button>
  );
}
```

## Translation Key Naming Convention

### Hierarchical Structure
Use dot notation for nested keys:
```json
{
  "hero": {
    "title": "Find Your Perfect Property",
    "subtitle": "Buy, sell, or rent with confidence"
  }
}
```

### Naming Guidelines
1. Use lowercase with underscores: `property_type`, `search_button`
2. Be descriptive: `failed_to_load` instead of `error`
3. Group related keys: `auth.login`, `auth.register`
4. Use consistent naming across languages

## Best Practices

### 1. Component Integration
- Always use translation keys instead of hardcoded strings
- Import only the namespaces you need
- Use descriptive key names

### 2. Translation Management
- Keep translations synchronized between languages
- Use consistent terminology across the application
- Provide context for translators when needed

### 3. Performance
- Load only required namespaces
- Use lazy loading for large translation files
- Cache translations appropriately

### 4. Fallbacks
- Always provide fallback text
- Use English as the fallback language
- Handle missing translations gracefully

## Example Implementation

See `components/examples/i18n-example.tsx` for a comprehensive example showing:
- Multiple namespace usage
- Language switching
- Form integration
- Property data display
- Navigation elements

## Adding New Translations

### 1. Add to English files first
```json
// public/locales/en/common.json
{
  "new_section": {
    "new_key": "New English text"
  }
}
```

### 2. Add corresponding Bengali translation
```json
// public/locales/bn/common.json
{
  "new_section": {
    "new_key": "নতুন বাংলা টেক্সট"
  }
}
```

### 3. Update component
```typescript
const { t } = useTranslation('common');
return <span>{t('new_section.new_key')}</span>;
```

## Testing

### Language Switching Test
```typescript
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../lib/i18n';

test('displays content in Bengali when language is changed', async () => {
  await i18n.changeLanguage('bn');
  render(
    <I18nextProvider i18n={i18n}>
      <MyComponent />
    </I18nextProvider>
  );
  
  expect(screen.getByText('বাংলা টেক্সট')).toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

1. **Missing translations**: Check console for missing key warnings
2. **Language not switching**: Verify i18n configuration and namespace loading
3. **Performance issues**: Reduce loaded namespaces and implement lazy loading
4. **Inconsistent translations**: Use translation management tools

### Debug Mode
Enable debug mode in development:
```typescript
i18n.init({
  debug: process.env.NODE_ENV === 'development',
  // ... other config
});
```

## Future Enhancements

1. **Additional Languages**: Add support for more regional languages
2. **RTL Support**: Implement right-to-left text direction
3. **Pluralization**: Add proper plural form handling
4. **Date/Number Formatting**: Locale-specific formatting
5. **Translation Management**: Integrate with translation management platforms

## Resources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Bengali Language Guidelines](https://en.wikipedia.org/wiki/Bengali_language)
- [Unicode Bengali Support](https://unicode.org/charts/PDF/U0980.pdf)