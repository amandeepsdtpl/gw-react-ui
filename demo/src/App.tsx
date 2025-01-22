import React, { useState } from 'react';
import {
  Card,
  DataGrid,
  Button,
  Chart,
  Tabs,
  Input,
  Sidebar,
  Badge,
  Avatar,
  ProgressBar,
  Alert,
  Map,
  SparkLine
} from '@gw/ui';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Bell,
  Settings,
  Search,
  Menu as MenuIcon
} from 'lucide-react';

const salesData = [
  { month: 'Jan', sales: 65, profit: 54, orders: 85 },
  { month: 'Feb', sales: 59, profit: 48, orders: 78 },
  { month: 'Mar', sales: 80, profit: 65, orders: 90 },
  { month: 'Apr', sales: 81, profit: 70, orders: 110 },
  { month: 'May', sales: 56, profit: 45, orders: 71 },
  { month: 'Jun', sales: 55, profit: 48, orders: 80 },
  { month: 'Jul', sales: 40, profit: 35, orders: 65 }
];

const recentOrders = [
  { id: 1, customer: 'John Doe', product: 'Product A', amount: 150, status: 'Completed' },
  { id: 2, customer: 'Jane Smith', product: 'Product B', amount: 245, status: 'Pending' },
  { id: 3, customer: 'Bob Johnson', product: 'Product C', amount: 550, status: 'Processing' }
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <MenuIcon size={20} />
            </Button>
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                placeholder="Search..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <Button variant="outline" className="relative">
              <Bell size={20} />
              <Badge variant="error" className="absolute -top-1 -right-1">3</Badge>
            </Button>
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User"
              size="small"
            />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="lg:translate-x-0"
        items={[
          { icon: <TrendingUp size={20} />, label: 'Dashboard', href: '#' },
          { icon: <Users size={20} />, label: 'Customers', href: '#' },
          { icon: <ShoppingCart size={20} />, label: 'Orders', href: '#' },
          { icon: <DollarSign size={20} />, label: 'Revenue', href: '#' },
          { icon: <Settings size={20} />, label: 'Settings', href: '#' }
        ]}
      />

      {/* Main Content */}
      <main className="lg:ml-64 p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="flex items-center p-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <h3 className="text-2xl font-bold">1,482</h3>
              <SparkLine
                data={[4, 6, 8, 5, 9, 7, 8]}
                width={100}
                height={30}
                color="#2563eb"
              />
            </div>
          </Card>

          <Card className="flex items-center p-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <ShoppingCart size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">352</h3>
              <SparkLine
                data={[5, 7, 4, 8, 6, 9, 7]}
                width={100}
                height={30}
                color="#16a34a"
              />
            </div>
          </Card>

          <Card className="flex items-center p-4">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <h3 className="text-2xl font-bold">$24,582</h3>
              <SparkLine
                data={[7, 5, 8, 9, 6, 8, 7]}
                width={100}
                height={30}
                color="#ca8a04"
              />
            </div>
          </Card>

          <Card className="flex items-center p-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Growth</p>
              <h3 className="text-2xl font-bold">+12.5%</h3>
              <SparkLine
                data={[6, 8, 7, 9, 8, 7, 9]}
                width={100}
                height={30}
                color="#9333ea"
              />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts */}
          <Card className="lg:col-span-2">
            <Tabs
              tabs={[
                {
                  id: 'sales',
                  label: 'Sales Overview',
                  content: (
                    <div className="p-4">
                      <Chart
                        type="area"
                        data={salesData}
                        series={['sales', 'profit', 'orders']}
                        height={300}
                      />
                    </div>
                  )
                },
                {
                  id: 'customers',
                  label: 'Customer Growth',
                  content: (
                    <div className="p-4">
                      <Chart
                        type="line"
                        data={salesData}
                        series={['sales']}
                        height={300}
                      />
                    </div>
                  )
                }
              ]}
            />
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity">
            <div className="p-4 space-y-4">
              <Alert
                variant="success"
                title="Order Completed"
              >
                Order #1234 has been completed
              </Alert>
              <Alert
                variant="warning"
                title="Low Stock"
              >
                Product "Wireless Earbuds" is running low
              </Alert>
              <Alert
                variant="info"
                title="New Customer"
              >
                Jane Smith just registered
              </Alert>
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card title="Recent Orders" className="mt-6">
          <DataGrid
            data={recentOrders}
            columns={[
              { field: 'id', header: 'Order ID', width: '100px' },
              { field: 'customer', header: 'Customer' },
              { field: 'product', header: 'Product' },
              { field: 'amount', header: 'Amount', width: '120px' },
              { field: 'status', header: 'Status', width: '120px' }
            ]}
            pageSize={5}
          />
        </Card>

        {/* Store Locations */}
        <Card title="Store Locations" className="mt-6">
          <Map
            center={[40.7128, -74.0060]}
            zoom={13}
            markers={[
              { position: [40.7128, -74.0060], popup: 'Main Store' },
              { position: [40.7580, -73.9855], popup: 'Branch Store' }
            ]}
            height={400}
          />
        </Card>
      </main>
    </div>
  );
}

export default App;