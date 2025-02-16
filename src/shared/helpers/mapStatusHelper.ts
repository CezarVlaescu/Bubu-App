import { BAD_HTTP_STATUS_CODES } from "../constants/httpStatus.ts";
import { StatusEnum } from "../types/labelProps.type.ts";

export const mapStatusHelper = (status: string): StatusEnum => {
    return status === "INVALID" || BAD_HTTP_STATUS_CODES.includes(status) ? StatusEnum.INVALID : StatusEnum.VALID;
};