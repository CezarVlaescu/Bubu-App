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