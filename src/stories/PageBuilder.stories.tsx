import type { Meta, StoryObj } from "@storybook/react";
import { PageBuilder } from "@/components/cms/page-builder";

const meta: Meta<typeof PageBuilder> = {
  title: "CMS/PageBuilder",
  component: PageBuilder,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PageBuilder>;

export const Default: Story = {};
