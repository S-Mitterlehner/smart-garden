import { useGetSensorsQuery } from "../__generated__/graphql";

export default function useSensors() {
  const { data, loading } = useGetSensorsQuery();

  return {
    sensors: data?.sensors ?? [],
    isFetched: !loading && !!data?.sensors.length,
  };
}
