export interface PaginationInterface {
    totalPages: number;
    currentPage: number;
    maxPageLimit: number;
    minPageLimit: number;
    classes?: string;
    onPrevClick: () => void;
    onNextClick: () => void;
    onLastClick: (num: number) => void;
    onPageChange: (pageNumber: number) => void;
}
