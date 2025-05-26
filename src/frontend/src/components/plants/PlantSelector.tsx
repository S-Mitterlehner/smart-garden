import { ActionIcon, Button, Modal, NavLink, Table, TextInput, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch, IconSeeding, IconX } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { PlantDto } from "../../__generated__/graphql";
import usePlants from "../../hooks/usePlants";
import { toNiceCasing } from "../../utils";

export type PlantSelectorProps = {
  selectedPlant: PlantDto | null;
  setSelectedPlant: (plant: PlantDto) => void;
};

export default function PlantSelector({ selectedPlant, setSelectedPlant }: PlantSelectorProps) {
  const { plants } = usePlants();
  const [opened, { open, close }] = useDisclosure(false, {
    onClose: () => {
      setPreviewPlant(null);
      setSearchString("");
    },
  });
  const [searchString, setSearchString] = useState("");
  const [previewPlant, setPreviewPlant] = useState<PlantDto | null>(null);

  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => plant.name.toLowerCase().includes(searchString.toLowerCase()));
  }, [plants, searchString]);

  const getPreview = () => {
    if (!previewPlant) {
      return (
        <div className="flex h-full min-h-96 w-full flex-col items-center justify-center gap-4 text-gray-500">
          <IconSeeding className="h-16 w-16"></IconSeeding>
          <p>Select a plant to see details</p>
        </div>
      );
    }
    // TODO: make phone ready
    return (
      <div className="flex h-full max-h-96 min-h-96 flex-col justify-between gap-4">
        <div className="flex max-h-[252px] flex-col gap-2 overflow-y-auto">
          <div className="flex flex-row items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold">{previewPlant?.name}</h3>
              <p className="text-sm">{previewPlant?.description}</p>
            </div>
            <div>
              <img className="ml-auto h-16 w-16 rounded-md" src={previewPlant?.imageUrl} alt={previewPlant?.name} />
            </div>
          </div>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Sensor Type</Table.Th>
                <Table.Th w={"200px"} className="text-right!">
                  Range
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {previewPlant.moduleConfigs.map((cfg, idx) => (
                <Table.Tr key={idx}>
                  <Table.Td>{toNiceCasing(cfg.moduleType)}</Table.Td>
                  <Table.Td w={"200px"} className="text-right">
                    {cfg.rangeFrom} - {cfg.rangeTo}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
        <div className="mt-8 flex self-end">
          <Button
            onClick={() => {
              setSelectedPlant(previewPlant!);
              close();
            }}
            variant="filled"
          >
            Select
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} size={"xl"}>
        <div className="grid grid-cols-[1fr_2fr] gap-4">
          <div className="col-span-2">
            <TextInput
              leftSection={<IconSearch />}
              rightSection={
                <ActionIcon onClick={() => setSearchString("")} variant="white">
                  <IconX />
                </ActionIcon>
              }
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 border-r border-gray-300 pr-4">
            {filteredPlants.map((p) => (
              <NavLink
                active={previewPlant?.id === p.id}
                onClick={() => setPreviewPlant(p)}
                key={p.id}
                label={p.name}
                leftSection={<img className="h-8 w-8" src={p.imageUrl} alt={p.name} />}
              />
            ))}
          </div>
          <div>{getPreview()}</div>
        </div>
      </Modal>
      <UnstyledButton onClick={open}>
        <div className="flex h-24 w-24 items-center gap-2 rounded-md border border-gray-300 bg-white p-2 hover:bg-gray-50!">
          <img className="h-full w-full overflow-hidden" src={selectedPlant?.imageUrl} alt={selectedPlant?.name} />
        </div>
      </UnstyledButton>
    </>
  );
}
