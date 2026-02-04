"use client";

import { FC, PropsWithChildren } from "react";

import { AtomsHydrate } from "@meta-1/web-common/components/atoms-hydrate";
import { useQuery } from "@meta-1/web-common/hooks";
import { publicKeyState } from "@meta-1/web-common/state";
import { profile } from "@/rest/account";
import { getCommonConfig } from "@/rest/public";
import { isLoginState, profileState } from "@/state/profile";

export type ServerStateLoaderProps = PropsWithChildren;

export const ServerStateLoader: FC<ServerStateLoaderProps> = (props) => {
  const { data: profileData } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profile(),
  });
  const { data: commonConfigData } = useQuery({
    queryKey: ["common:config"],
    queryFn: () => getCommonConfig(),
  });

  return (
    <AtomsHydrate
      atomValues={[
        [isLoginState, !!profileData],
        [profileState, profileData],
        [publicKeyState, commonConfigData?.publicKey],
      ]}
    >
      {props.children}
    </AtomsHydrate>
  );
};
