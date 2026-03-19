export type SetRequired<T, K extends keyof T> = T extends unknown
    ? Omit<T, K> & Required<Pick<T, K>>
    : never;
