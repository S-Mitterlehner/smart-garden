import { useGetActuatorsQuery } from "../__generated__/graphql";

export default function useActuators() {
  const { data, loading } = useGetActuatorsQuery();

  return {
    actuators: data?.actuators ?? [],
    isFetched: !loading && !!data?.actuators.length,
  };
}
