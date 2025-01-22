# Component Documentation

## General Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@gw/ui';

// Basic usage
<Button>Click Me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>

// Sizes
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>

// Full width
<Button fullWidth>Full Width</Button>

// With icon
<Button>
  <Search size={16} />
  Search
</Button>
```

Props:
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'small' | 'medium' | 'large'
- `fullWidth`: boolean
- `disabled`: boolean
- `className`: string

### Input

A flexible input component with label and error support.

```tsx
import { Input } from '@gw/ui';

// Basic usage
<Input
  label="Username"
  placeholder="Enter username"
/>

// With error
<Input
  label="Email"
  error="Please enter a valid email"
/>

// Full width
<Input fullWidth />

// With icon
<Input
  icon={<Search size={16} />}
  placeholder="Search..."
/>
```

Props:
- `label`: string
- `error`: string
- `fullWidth`: boolean
- `disabled`: boolean
- `icon`: ReactNode
- `className`: string

## Layout Components

### Card

A container component for grouping related content.

```tsx
import { Card } from '@gw/ui';

// Basic usage
<Card>
  Content
</Card>

// With title
<Card title="Card Title">
  Content
</Card>

// With elevation
<Card elevated>
  Content
</Card>

// With header and footer
<Card
  header={<div>Header</div>}
  footer={<div>Footer</div>}
>
  Content
</Card>
```

Props:
- `title`: string
- `elevated`: boolean
- `header`: ReactNode
- `footer`: ReactNode
- `className`: string

### Grid

A responsive grid system for layout.

```tsx
import { Grid, Column } from '@gw/ui';

<Grid columns={12} gap={4}>
  <Column span={6}>
    Half width
  </Column>
  <Column span={6}>
    Half width
  </Column>
</Grid>
```

Props:
- `columns`: number
- `gap`: number
- `className`: string

## Data Display Components

### DataGrid

A powerful data grid component with sorting and pagination.

```tsx
import { DataGrid } from '@gw/ui';

const columns = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name', sortable: true },
  { field: 'email', header: 'Email' }
];

const data = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
];

<DataGrid
  data={data}
  columns={columns}
  pageSize={10}
/>
```

Props:
- `data`: T[]
- `columns`: Column<T>[]
- `pageSize`: number
- `className`: string

### Timeline

A component for displaying temporal data.

```tsx
import { Timeline } from '@gw/ui';

const items = [
  {
    title: 'Event 1',
    description: 'Description',
    date: '2024-03-01'
  },
  {
    title: 'Event 2',
    description: 'Description',
    date: '2024-03-02'
  }
];

<Timeline items={items} />
```

Props:
- `items`: TimelineItem[]
- `className`: string

## Chart Components

### LineChart

A line chart component for visualizing trends.

```tsx
import { LineChart } from '@gw/ui';

const data = [
  { label: 'Jan', values: [100, 200] },
  { label: 'Feb', values: [150, 250] },
  { label: 'Mar', values: [200, 300] }
];

<LineChart
  data={data}
  series={['Sales', 'Revenue']}
  height={300}
  showLegend
/>
```

Props:
- `data`: MultiSeriesDataPoint[]
- `series`: string[]
- `height`: number
- `showLegend`: boolean
- `showTooltip`: boolean
- `className`: string

### BarChart

A bar chart component for comparing values.

```tsx
import { BarChart } from '@gw/ui';

const data = [
  { label: 'A', value: 100 },
  { label: 'B', value: 200 },
  { label: 'C', value: 150 }
];

<BarChart
  data={data}
  height={300}
  showLegend
/>
```

Props:
- `data`: ChartDataPoint[]
- `height`: number
- `showLegend`: boolean
- `showTooltip`: boolean
- `className`: string

## Form Components

### Select

A dropdown select component.

```tsx
import { Select } from '@gw/ui';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' }
];

<Select
  label="Choose an option"
  options={options}
  value={value}
  onChange={setValue}
/>
```

Props:
- `options`: SelectOption[]
- `value`: string
- `onChange`: (value: string) => void
- `label`: string
- `error`: string
- `disabled`: boolean
- `className`: string

### Checkbox

A checkbox input component.

```tsx
import { Checkbox } from '@gw/ui';

<Checkbox
  label="Remember me"
  checked={checked}
  onChange={setChecked}
/>
```

Props:
- `checked`: boolean
- `onChange`: (checked: boolean) => void
- `label`: string
- `disabled`: boolean
- `error`: string
- `className`: string

## Feedback Components

### Toast

A toast notification component.

```tsx
import { Toast } from '@gw/ui';

<Toast
  message="Operation successful"
  variant="success"
  duration={3000}
/>
```

Props:
- `message`: string
- `variant`: 'success' | 'error' | 'info' | 'warning'
- `duration`: number
- `position`: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
- `className`: string

### Dialog

A modal dialog component.

```tsx
import { Dialog } from '@gw/ui';

<Dialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  Dialog content
</Dialog>
```

Props:
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `children`: ReactNode
- `className`: string