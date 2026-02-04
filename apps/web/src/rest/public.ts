import { CommonConfig } from "@meta-1/agent-types";
import { SendCodeData } from "@meta-1/nest-types";
import { get, post } from "@meta-1/web-common/utils/rest";

export const sendEmailCode = (data: SendCodeData) => post<void, SendCodeData>("@api/mail/code/send", data);

export const getCommonConfig = () => get<CommonConfig>("@api/config/common");
