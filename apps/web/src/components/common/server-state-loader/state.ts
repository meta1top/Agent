import { dehydrate, getQueryClient, prefetchQuery } from "@meta-1/web-common/utils/query";
import { getCommonConfig } from "@/rest/public";

export const dehydratedState = async (): Promise<ReturnType<typeof dehydrate>> => {
  const queryClient = getQueryClient();

  await Promise.all([
    prefetchQuery(queryClient, {
      queryKey: ["common:config"],
      queryFn: () => getCommonConfig(),
    }),
  ]);
  return dehydrate(queryClient);
};
