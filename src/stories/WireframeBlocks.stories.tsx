import type { Meta, StoryObj } from "@storybook/react";
import { WireframeBlock, wireframeBlockMeta } from "@/components/wireframe-blocks";
import { WireframeBlockId } from "@/data/wireframe-types";

const allBlockIds = Object.keys(wireframeBlockMeta) as WireframeBlockId[];
const categories = [...new Set(Object.values(wireframeBlockMeta).map((m) => m.category))];

const meta: Meta<typeof WireframeBlock> = {
  title: "Wireframes/WireframeBlock",
  component: WireframeBlock,
  argTypes: {
    blockId: {
      control: "select",
      options: allBlockIds,
    },
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof WireframeBlock>;

export const Default: Story = {
  args: {
    blockId: "hero-centered",
    className: "w-[400px] h-auto text-foreground",
  },
};

export const AllHeroes: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-4xl">
      {allBlockIds
        .filter((id) => wireframeBlockMeta[id].category === "Hero")
        .map((id) => (
          <div key={id} className="space-y-2">
            <div className="rounded-lg border p-2 bg-card">
              <WireframeBlock blockId={id} className="w-full h-auto text-muted-foreground" />
            </div>
            <p className="text-xs text-center text-muted-foreground">{wireframeBlockMeta[id].label}</p>
          </div>
        ))}
    </div>
  ),
};

export const AllCards: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-4xl">
      {allBlockIds
        .filter((id) => wireframeBlockMeta[id].category === "Cards")
        .map((id) => (
          <div key={id} className="space-y-2">
            <div className="rounded-lg border p-2 bg-card">
              <WireframeBlock blockId={id} className="w-full h-auto text-muted-foreground" />
            </div>
            <p className="text-xs text-center text-muted-foreground">{wireframeBlockMeta[id].label}</p>
          </div>
        ))}
    </div>
  ),
};

export const AllBlocks: Story = {
  render: () => (
    <div className="space-y-8 max-w-5xl">
      {categories.map((cat) => (
        <div key={cat}>
          <h3 className="text-sm font-semibold mb-3 text-foreground">{cat}</h3>
          <div className="grid grid-cols-4 gap-3">
            {allBlockIds
              .filter((id) => wireframeBlockMeta[id].category === cat)
              .map((id) => (
                <div key={id} className="space-y-1.5">
                  <div className="rounded-lg border p-2 bg-card">
                    <WireframeBlock blockId={id} className="w-full h-auto text-muted-foreground" />
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground truncate">
                    {wireframeBlockMeta[id].label}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const PageMockup: Story = {
  render: () => {
    const pageBlocks: WireframeBlockId[] = [
      "hero-centered",
      "cards-icon-grid",
      "cards-3-col",
      "testimonials-cards",
      "cta-full-width",
    ];
    return (
      <div className="max-w-3xl border rounded-lg overflow-hidden bg-card">
        {pageBlocks.map((id) => (
          <div key={id} className="border-b border-dashed last:border-0">
            <WireframeBlock blockId={id} className="w-full h-auto text-muted-foreground/50" />
          </div>
        ))}
      </div>
    );
  },
};
