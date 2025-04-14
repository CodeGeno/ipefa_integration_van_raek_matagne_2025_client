export interface PaginationWithSearch<T> {
	current_page: number;
	total_pages: number;
	search: string;
	data: T[];
}
