export interface ApiResponse<T> {
	data: T | undefined;
	message: string;
	status: number;
	success: boolean;
}
