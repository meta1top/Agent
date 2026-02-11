"use client";

import { FC, PropsWithChildren } from "react";

import { AtomsHydrate } from "@meta-1/web-common/components/atoms-hydrate";
import { useQuery } from "@meta-1/web-common/hooks";
import { publicKeyState } from "@meta-1/web-common/state";
import { getCommonConfig } from "@/rest/public";

export type ServerStateLoaderProps = PropsWithChildren;

export const ServerStateLoader: FC<ServerStateLoaderProps> = (props) => {
  const { data: commonConfigData } = useQuery({
    queryKey: ["common:config"],
    queryFn: () => getCommonConfig(),
  });

  return <AtomsHydrate atomValues={[[publicKeyState, commonConfigData?.publicKey]]}>{props.children}</AtomsHydrate>;
};
