# Theming Guide

## Theme Structure

The theme system is built on CSS variables and follows a hierarchical structure:

```
theme/
├── core/
│   ├── colors.css
│   ├── typography.css
│   ├── spacing.css
│   └── shadows.css
├── components/
│   ├── button.css
│   ├── input.css
│   └── ...
└── variants/
    ├── light.css
    ├── dark.css
    └── ...
```

## CSS Variables

### Colors

```css
/* Base Colors */
--gw-primary-50: #eff6ff;
--gw-primary-100: #dbeafe;
--gw-primary-500: #3b82f6;
--gw-primary-900: #1e3a8a;

/* Semantic Colors */
--gw-success: var(--gw-success-500);
--gw-warning: var(--gw-warning-500);
--gw-error: var(--gw-error-500);
--gw-info: var(--gw-info-500);

/* Text Colors */
--gw-text-primary: var(--gw-neutral-900);
--gw-text-secondary: var(--gw-neutral-600);
--gw-text-disabled: var(--gw-neutral-400);
```

### Typography

```css
/* Font Family */
--gw-font-family: system-ui, sans-serif;

/* Font Sizes */
--gw-font-size-xs: 0.75rem;
--gw-font-size-sm: 0.875rem;
--gw-font-size-base: 1rem;
--gw-font-size-lg: 1.125rem;
--gw-font-size-xl: 1.25rem;

/* Line Heights */
--gw-line-height-none: 1;
--gw-line-height-tight: 1.25;
--gw-line-height-normal: 1.5;
--gw-line-height-relaxed: 1.625;
```

### Spacing

```css
/* Spacing Scale */
--gw-spacing-px: 1px;
--gw-spacing-0: 0;
--gw-spacing-1: 0.25rem;
--gw-spacing-2: 0.5rem;
--gw-spacing-4: 1rem;
--gw-spacing-8: 2rem;
```

### Shadows

```css
/* Shadow Scale */
--gw-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--gw-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--gw-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--gw-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

## Theme Variants

### Light Theme (Default)

```css
[data-theme="light"] {
  --gw-background: white;
  --gw-surface: var(--gw-neutral-50);
  --gw-border-color: var(--gw-neutral-200);
  --gw-text-primary: var(--gw-neutral-900);
}
```

### Dark Theme

```css
[data-theme="dark"] {
  --gw-background: var(--gw-neutral-900);
  --gw-surface: var(--gw-neutral-800);
  --gw-border-color: var(--gw-neutral-700);
  --gw-text-primary: var(--gw-neutral-50);
}
```

### High Contrast Theme

```css
[data-theme="high-contrast"] {
  --gw-primary: black;
  --gw-text-primary: black;
  --gw-background: white;
  --gw-border-color: black;
}
```

## Material Design Integration

### Enabling Material Design

```tsx
<ThemeProvider defaultDesignSystem="material">
  <App />
</ThemeProvider>
```

### Material Variables

```css
[data-design-system="material"] {
  /* Colors */
  --gw-primary: #2196f3;
  
  /* Typography */
  --gw-font-family: 'Roboto', sans-serif;
  
  /* Elevation */
  --gw-shadow-1: 0 1px 3px rgba(0,0,0,0.12);
  --gw-shadow-2: 0 3px 6px rgba(0,0,0,0.16);
  
  /* Animation */
  --gw-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Custom Themes

### Creating a Custom Theme

```css
/* themes/custom.css */
[data-theme="custom"] {
  /* Override base variables */
  --gw-primary-500: #ff0000;
  --gw-secondary-500: #00ff00;
  
  /* Add custom variables */
  --custom-color: #0000ff;
}
```

### Using Custom Themes

```tsx
import './themes/custom.css';

function App() {
  return (
    <ThemeProvider defaultMode="custom">
      <div className="using-custom-var">
        Content
      </div>
    </ThemeProvider>
  );
}
```

```css
.using-custom-var {
  color: var(--custom-color);
}
```

## Component Theming

### Button Example

```css
.gw-btn {
  /* Base styles */
  background-color: var(--gw-primary);
  color: white;
  padding: var(--gw-spacing-2) var(--gw-spacing-4);
  border-radius: var(--gw-border-radius);
  
  /* Variants */
  &--secondary {
    background-color: var(--gw-secondary);
  }
  
  &--outline {
    background-color: transparent;
    border: 1px solid var(--gw-border-color);
    color: var(--gw-text-primary);
  }
}
```

### Input Example

```css
.gw-input {
  /* Base styles */
  border: 1px solid var(--gw-border-color);
  background-color: var(--gw-background);
  color: var(--gw-text-primary);
  
  /* States */
  &:focus {
    border-color: var(--gw-primary);
    box-shadow: 0 0 0 2px var(--gw-primary-100);
  }
  
  &--error {
    border-color: var(--gw-error);
  }
}
```

## Best Practices

### Variable Naming

- Use the `--gw-` prefix for all variables
- Follow a logical hierarchy (e.g., `--gw-primary-500`)
- Use descriptive names (e.g., `--gw-text-primary`)

### Theme Switching

- Use CSS variables for dynamic values
- Avoid hard-coded colors/values
- Test all themes for contrast

### Performance

- Minimize CSS variable changes
- Use CSS transitions for smooth theme switches
- Consider using CSS containment

### Accessibility

- Maintain proper contrast ratios
- Test with screen readers
- Support reduced motion