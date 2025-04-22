"use client";

import { useState } from "react";
import { Plant } from "../models/plant";
import { Menu, UnstyledButton } from "@mantine/core";
import usePlants from "../hooks/usePlants";

export type PlantSelectorProps = {
  selectedPlant: Plant | null;
  setSelectedPlant: (plant: Plant) => void;
};

export default function PlantSelector({
  selectedPlant,
  setSelectedPlant,
}: PlantSelectorProps) {
  const { data: plants } = usePlants();
  const [opened, setOpened] = useState(false);

  const plantList = plants.map((p) => (
    <Menu.Item
      key={p.id}
      value={p.id}
      className="flex items-center gap-2 w-14"
      onClick={() => {
        setSelectedPlant(p);
        setOpened(false);
      }}
    >
      <img className="w-8 h-8" src={p.imageUrl} alt={p.name} />
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
          <div className="flex items-center gap-2 border border-gray-300 rounded-md p-2 bg-white w-24 h-24 ">
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
