# GW UI Documentation

A comprehensive React UI component library with TypeScript support, theme system, and Material Design integration.

## Table of Contents

1. [Installation](#installation)
2. [Theme System](#theme-system)
3. [Components](#components)
4. [Design Systems](#design-systems)
5. [Customization](#customization)
6. [Best Practices](#best-practices)

## Installation

```bash
npm install @gw/ui
```

Add the styles to your application:

```tsx
import '@gw/ui/dist/style.css';
```

## Theme System

### Theme Provider

Wrap your application with the ThemeProvider to enable theme support:

```tsx
import { ThemeProvider } from '@gw/ui';

function App() {
  return (
    <ThemeProvider defaultMode="light" defaultDesignSystem="default">
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Available Themes

- `light` - Default light theme
- `dark` - Dark theme with proper contrast
- `high-contrast` - High contrast theme for accessibility
- `sepia` - Sepia theme for reduced eye strain
- `nord` - Nord color scheme theme

### Theme Hook

Use the `useTheme` hook to access and modify theme settings:

```tsx
import { useTheme } from '@gw/ui';

function ThemeSwitcher() {
  const { mode, setMode, designSystem, setDesignSystem } = useTheme();

  return (
    <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

### CSS Variables

The theme system uses CSS variables for all design tokens. Override them to customize the appearance:

```css
:root {
  /* Colors */
  --gw-primary-500: #3b82f6;
  --gw-secondary-500: #64748b;
  
  /* Typography */
  --gw-font-family: 'Inter', sans-serif;
  --gw-font-size-base: 1rem;
  
  /* Spacing */
  --gw-spacing-4: 1rem;
  
  /* Borders */
  --gw-border-radius: 0.375rem;
}
```

## Components

### General

```tsx
import { Button, Icon, Image, Link } from '@gw/ui';

// Button with variants
<Button variant="primary">Click Me</Button>
<Button variant="secondary" size="large">Large Button</Button>
<Button variant="outline" fullWidth>Full Width</Button>

// Icon usage
<Icon icon={Search} size={20} />

// Responsive image
<Image
  src="image.jpg"
  alt="Description"
  aspectRatio="16/9"
  fit="cover"
/>

// Link with variants
<Link href="/page" variant="button">Click Me</Link>
```

### Layout

```tsx
import { Card, Grid, Container } from '@gw/ui';

<Container>
  <Grid columns={12} gap={4}>
    <Card title="Card Title" elevated>
      Card content
    </Card>
  </Grid>
</Container>
```

### Forms

```tsx
import { Input, Select, Checkbox } from '@gw/ui';

<form>
  <Input
    label="Username"
    placeholder="Enter username"
    error="This field is required"
  />
  
  <Select
    label="Country"
    options={[
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' }
    ]}
  />
  
  <Checkbox
    label="Remember me"
    checked={checked}
    onChange={setChecked}
  />
</form>
```

### Data Display

```tsx
import { DataGrid, Timeline, Tree } from '@gw/ui';

<DataGrid
  data={data}
  columns={[
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' }
  ]}
  pageSize={10}
/>

<Timeline
  items={[
    { title: 'Event 1', date: '2024-03-01' },
    { title: 'Event 2', date: '2024-03-02' }
  ]}
/>

<Tree
  data={treeData}
  onSelect={handleSelect}
/>
```

### Feedback

```tsx
import { Alert, Toast, Dialog } from '@gw/ui';

<Alert variant="success">Operation successful!</Alert>

<Toast
  message="Settings saved"
  variant="success"
  duration={3000}
/>

<Dialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  Dialog content
</Dialog>
```

### Charts

```tsx
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart
} from '@gw/ui';

<LineChart
  data={data}
  series={['sales', 'revenue']}
  height={300}
  showLegend
/>
```

## Design Systems

### Default Design System

The default design system follows modern web design principles with clean, minimal aesthetics.

### Material Design

Enable Material Design by setting the design system:

```tsx
<ThemeProvider defaultDesignSystem="material">
  {/* Your app content */}
</ThemeProvider>
```

Material Design features:
- Elevation system with shadows
- Material-specific animations
- Proper typography scale
- Component-specific Material styles

## Customization

### CSS Modules

All components support className props for custom styling:

```tsx
<Button className="my-custom-button">
  Custom Button
</Button>
```

### Theme Extension

Create custom themes by extending the base themes:

```css
[data-theme="custom"] {
  --gw-primary: #ff0000;
  --gw-secondary: #00ff00;
  /* Add more custom variables */
}
```

### Component Composition

Components are designed to be composable:

```tsx
<Card>
  <CardHeader>
    <Typography variant="h2">Title</Typography>
  </CardHeader>
  <CardContent>
    <Button>Action</Button>
  </CardContent>
</Card>
```

## Best Practices

### Performance

- Components are tree-shakeable
- Styles are loaded only when needed
- Proper React.memo usage for optimization
- Efficient re-rendering strategies

### Accessibility

- ARIA attributes included
- Keyboard navigation support
- High contrast theme available
- Screen reader friendly

### Responsive Design

- Mobile-first approach
- Flexible layouts
- Responsive typography
- Adaptive components

### Type Safety

- Full TypeScript support
- Proper prop types
- Generic components where needed
- Type inference for better DX