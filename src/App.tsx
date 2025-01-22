import React, { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import {
  Typography,
  Button,
  Card,
  Input,
  Checkbox,
  RadioButtonList,
  Switch,
  Slider,
  DataGrid,
  Tabs,
  Alert,
  Badge,
  ProgressBar,
  Avatar,
  Divider,
  Breadcrumbs,
  Tooltip,
  Dialog,
  Chip
} from './components/elements';
import {
  Home,
  User,
  Plus,
  Search,
} from 'lucide-react';

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('buttons');

  const gridData = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' }
  ];

  const gridColumns = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'role', header: 'Role' }
  ];

  const breadcrumbItems = [
    { id: 'home', label: 'Home', href: '#', icon: <Home size={16} /> },
    { id: 'components', label: 'Components', href: '#' },
    { id: 'demo', label: 'Demo' }
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Typography variant="h4">Component Library</Typography>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />

          <Tabs
            tabs={[
              {
                id: 'buttons',
                label: 'Buttons & Inputs',
                content: (
                  <div className="space-y-8">
                    {/* Buttons Section */}
                    <Card title="Buttons" className="p-6">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                          <Button>Default Button</Button>
                          <Button variant="secondary">Secondary</Button>
                          <Button variant="outline">Outline</Button>
                          <Button variant="ghost">Ghost</Button>
                          <Button variant="link">Link</Button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <Button size="small">Small</Button>
                          <Button>Medium</Button>
                          <Button size="large">Large</Button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <Button loading>Loading</Button>
                          <Button disabled>Disabled</Button>
                          <Button leftIcon={<Plus size={16} />}>With Icon</Button>
                        </div>
                      </div>
                    </Card>

                    {/* Form Controls Section */}
                    <Card title="Form Controls" className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Text Input"
                          placeholder="Enter text..."
                          leftIcon={<Search size={16} />}
                        />
                        {/* <Select
                          label="Select"
                          options={[
                            { value: '1', label: 'Option 1' },
                            { value: '2', label: 'Option 2' },
                            { value: '3', label: 'Option 3' }
                          ]}
                        /> */}
                        <div className="space-y-4">
                          <Checkbox label="Checkbox Option" />
                          <Switch label="Toggle Switch" />
                        </div>
                        <RadioButtonList
                          label="Radio Options"
                          options={[
                            { value: '1', label: 'Option 1' },
                            { value: '2', label: 'Option 2' },
                            { value: '3', label: 'Option 3' }
                          ]}
                        />
                        <div className="col-span-2">
                          <Slider
                            label="Slider"
                            min={0}
                            max={100}
                            value={50}
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                )
              },
              {
                id: 'data',
                label: 'Data Display',
                content: (
                  <div className="space-y-8">
                    {/* Data Grid */}
                    <Card title="Data Grid" className="p-6">
                      <DataGrid
                        data={gridData}
                        columns={gridColumns}
                        pageSize={5}
                      />
                    </Card>

                    {/* Progress & Stats */}
                    <Card title="Progress & Stats" className="p-6">
                      <div className="space-y-6">
                        <ProgressBar value={75} showLabel />
                        <div className="flex flex-wrap gap-4">
                          <Badge variant="primary">Primary</Badge>
                          <Badge variant="secondary">Secondary</Badge>
                          <Badge variant="success">Success</Badge>
                          <Badge variant="error">Error</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <Chip label="Basic Chip" />
                          <Chip
                            label="Removable"
                            onRemove={() => console.log('removed')}
                          />
                          <Chip
                            label="With Icon"
                            icon={<User size={14} />}
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                )
              },
              {
                id: 'feedback',
                label: 'Feedback',
                content: (
                  <div className="space-y-8">
                    {/* Alerts */}
                    <Card title="Alerts" className="p-6">
                      <div className="space-y-4">
                        <Alert variant="info" title="Information">
                          This is an information message.
                        </Alert>
                        <Alert variant="success" title="Success">
                          Operation completed successfully.
                        </Alert>
                        <Alert variant="warning" title="Warning">
                          Please review your input.
                        </Alert>
                        <Alert variant="error" title="Error">
                          An error occurred.
                        </Alert>
                      </div>
                    </Card>

                    {/* Dialog */}
                    <Card title="Dialog" className="p-6">
                      <Button onClick={() => setIsDialogOpen(true)}>
                        Open Dialog
                      </Button>
                      <Dialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        title="Sample Dialog"
                      >
                        <div className="p-6">
                          <Typography>
                            This is a sample dialog content.
                          </Typography>
                          <div className="mt-6 flex justify-end gap-4">
                            <Button
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={() => setIsDialogOpen(false)}>
                              Confirm
                            </Button>
                          </div>
                        </div>
                      </Dialog>
                    </Card>
                  </div>
                )
              },
              {
                id: 'misc',
                label: 'Miscellaneous',
                content: (
                  <div className="space-y-8">
                    {/* Avatars & Badges */}
                    <Card title="Avatars & Badges" className="p-6">
                      <div className="flex flex-wrap gap-6 items-center">
                        <Avatar
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                          alt="User"
                        />
                        <Avatar
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                          alt="User"
                          size="large"
                        />
                        <div className="relative">
                          <Avatar
                            src="https://images.unsplash.com/photo-1527980965255-d3b416303d12"
                            alt="User"
                          />
                          <Badge
                            className="absolute -top-1 -right-1"
                            variant="error"
                          >
                            3
                          </Badge>
                        </div>
                      </div>
                    </Card>

                    {/* Tooltips */}
                    <Card title="Tooltips" className="p-6">
                      <div className="flex flex-wrap gap-4">
                        <Tooltip content="Top tooltip">
                          <Button variant="outline">Hover me (Top)</Button>
                        </Tooltip>
                        <Tooltip content="Right tooltip" position="right">
                          <Button variant="outline">Hover me (Right)</Button>
                        </Tooltip>
                        <Tooltip content="Bottom tooltip" position="bottom">
                          <Button variant="outline">Hover me (Bottom)</Button>
                        </Tooltip>
                        <Tooltip content="Left tooltip" position="left">
                          <Button variant="outline">Hover me (Left)</Button>
                        </Tooltip>
                      </div>
                    </Card>

                    {/* Dividers */}
                    <Card title="Dividers" className="p-6">
                      <div className="space-y-6">
                        <Divider />
                        <Divider label={<Typography variant="body2">With Text</Typography>} />
                        <Divider variant="dashed" />
                      </div>
                    </Card>
                  </div>
                )
              }
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;