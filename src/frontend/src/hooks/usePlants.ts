import { useGetPlantsQuery } from "../__generated__/graphql";

export default function usePlants() {
  const { data, loading } = useGetPlantsQuery();
  return {
    plants: data?.plants ?? [],
    isFetched: !loading && !!data?.plants.length,
  };
}
