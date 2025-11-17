export interface CollectionResult<T> {
    payload: T[];
    totalAmount: number;
}

export interface PaginatedRequest {
    pageIndex: number;
    pageSize: number;
}