export interface ApiResponse<T> {
	data: T | undefined;
	message: string;
	status: number;
	success: boolean;
}
export interface ApiSuccess<T> extends ApiResponse<T> {
	success: true;
	data: T;
}
export interface ApiError<T> extends ApiResponse<T> {
	success: false;
	data: undefined;
}

export interface ApiPaginatedResponse<T> extends ApiResponse<T> {
	success: true;
	message: string;
	data: T;
	total_pages: number;
	page: number;
}
