import type { Meta, StoryObj } from "@storybook/react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="mt-2">Make changes to your account here.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="mt-2">Change your password here.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-full max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="mt-2">Overview content goes here.</p>
      </TabsContent>
      <TabsContent value="analytics">
        <p className="mt-2">Analytics content goes here.</p>
      </TabsContent>
      <TabsContent value="reports">
        <p className="mt-2">Reports content goes here.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const ThreeTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-full max-w-lg">
      <TabsList>
        <TabsTrigger value="tab1">General</TabsTrigger>
        <TabsTrigger value="tab2">Security</TabsTrigger>
        <TabsTrigger value="tab3">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="mt-2">General settings content.</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="mt-2">Security settings content.</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="mt-2">Notification preferences content.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="active" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
        <TabsTrigger value="another">Another</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <p className="mt-2">This tab is active.</p>
      </TabsContent>
      <TabsContent value="disabled">
        <p className="mt-2">You should not see this.</p>
      </TabsContent>
      <TabsContent value="another">
        <p className="mt-2">Another tab content.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="general" orientation="vertical" className="w-full max-w-lg">
      <TabsList variant="line">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <p>General settings for your account.</p>
      </TabsContent>
      <TabsContent value="security">
        <p>Security and authentication settings.</p>
      </TabsContent>
      <TabsContent value="billing">
        <p>Billing and subscription details.</p>
      </TabsContent>
    </Tabs>
  ),
}
