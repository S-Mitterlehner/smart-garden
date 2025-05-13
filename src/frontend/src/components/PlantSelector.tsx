"use client";

import { Menu, UnstyledButton } from "@mantine/core";
import { useState } from "react";
import { PlantDto } from "../__generated__/graphql";
import usePlants from "../hooks/usePlants";

export type PlantSelectorProps = {
  selectedPlant: PlantDto | null;
  setSelectedPlant: (plant: PlantDto) => void;
};

export default function PlantSelector({
  selectedPlant,
  setSelectedPlant,
}: PlantSelectorProps) {
  const { plants } = usePlants();
  const [opened, setOpened] = useState(false);

  const plantList = plants.map((p) => (
    <Menu.Item
      key={p.id}
      value={p.id}
      className="flex w-14 items-center gap-2"
      onClick={() => {
        setSelectedPlant(p);
        setOpened(false);
      }}
    >
      <img className="h-8 w-8" src={p.imageUrl} alt={p.name} />
      <span>{p.name}</span>
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton data-expanded={opened || undefined}>
          <div className="flex h-24 w-24 items-center gap-2 rounded-md border border-gray-300 bg-white p-2">
            <img
              className="h-full w-full overflow-hidden"
              src={selectedPlant?.imageUrl}
              alt={selectedPlant?.name}
            />
          </div>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{plantList}</Menu.Dropdown>
    </Menu>
  );
}
