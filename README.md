# @gw/ui

A comprehensive React UI component library with TypeScript support and Tailwind CSS styling.

## Installation

```bash
npm install @gw/ui
```

## Usage

```tsx
import { Button, Card, DataGrid } from '@gw/ui';
import '@gw/ui/dist/style.css';

## Customization

### CSS Variables

You can customize the look and feel by overriding CSS variables:

```css
:root {
  --gw-primary-color: #0066cc;
  --gw-font-family-value: 'Roboto', sans-serif;
  --gw-border-radius-value: 0.5rem;
}
```

### Themes

Switch between themes using the `data-theme` attribute:

```html
<div data-theme="dark">
  <!-- Dark theme content -->
</div>

<div data-theme="high-contrast">
  <!-- High contrast theme content -->
</div>
```

### CSS Classes

All components use the `gw-` prefix to avoid conflicts:

```html
<button class="gw-btn gw-btn--primary">
  Click Me
</button>

<div class="gw-card gw-card--elevated">
  Card Content
</div>
```

function App() {
  return (
    <Card title="Example">
      <Button variant="primary">Click Me</Button>
    </Card>
  );
}
```

## Features

- 🎨 Beautiful, production-ready components
- 📦 Tree-shakeable exports
- 🔒 Type-safe with TypeScript
- 🎯 Zero-runtime CSS-in-JS
- 📱 Responsive and accessible
- 🛠 Highly customizable

## Components

### General
- Button
- Icon
- Image
- Link
- ProgressBar
- Skeleton

### Containers
- Accordion
- Card
- Column
- Fieldset
- Panel
- Row
- Splitter
- Tabs

### Forms
- AutoComplete
- Checkbox
- ColorPicker
- DatePicker
- DropDown
- FileInput
- Input
- ListBox
- MultiSelect
- Numeric
- RadioButtonList
- Rating
- Slider
- Switch
- TextArea
- TimePicker

### Data Display
- DataGrid
- Timeline
- Tree
- TreeGrid

### Navigation
- Breadcrumbs
- Menu
- Sidebar

### Notifications
- Alert
- Badge
- Chip
- Dialog
- Toast
- Tooltip

### Charts
- AreaChart
- BarChart
- LineChart
- PieChart
- And more...

## License

MIT