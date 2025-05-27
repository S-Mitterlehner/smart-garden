import { ModuleGroup, useGetModulesQuery } from "../__generated__/graphql";

export default function useModules(group: ModuleGroup) {
  const { data, loading } = useGetModulesQuery({
    variables: { group },
  });

  return {
    modules: data?.modules ?? [],
    isFetched: !loading && !!data?.modules.length,
  };
}
