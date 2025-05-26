import { ModuleTypeGroup, useGetModulesQuery } from "../__generated__/graphql";

export default function useModules(group: ModuleTypeGroup) {
  const { data, loading } = useGetModulesQuery({
    variables: { type: group },
  });

  return {
    modules: data?.modules ?? [],
    isFetched: !loading && !!data?.modules.length,
  };
}
