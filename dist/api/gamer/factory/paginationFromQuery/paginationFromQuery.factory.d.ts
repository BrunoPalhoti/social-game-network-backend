export declare function paginationFromQueryFactory(q: {
    page?: string;
    page_size?: string;
    ordering?: string;
}): {
    page: number | undefined;
    page_size: number | undefined;
    ordering: string | undefined;
};
