export type ApiState<T> = {
    data: T;
    loading: boolean;
    error: string | null;
};