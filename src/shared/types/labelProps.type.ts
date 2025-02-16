export type TChoicesLabelProps = {
    name: string;
    link: string;
}

export type TLinkCheckerResponse = {
    link: string;
    status: string;
}

export enum StatusEnum {
    VALID = 'VALID',
    INVALID = 'INVALID'
}

const badStatus = ['300', '400', '404']

export const mapStatus = (status: string): StatusEnum => {
    return badStatus.includes(status) ? StatusEnum.INVALID : StatusEnum.VALID;
};