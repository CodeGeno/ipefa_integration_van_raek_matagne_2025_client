import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
} from "./ui/pagination";

export default function PaginationComponent({
	totalPages,
	currentPage,
	onPageChange,
	search,
}: {
	totalPages: number;
	currentPage: number;
	onPageChange?: (page: number) => void;
	search: string;
}) {
	return (
		<Pagination>
			<PaginationContent>
				<PaginationItems
					currentPage={currentPage}
					totalPages={totalPages}
					search={search}
				/>
			</PaginationContent>
		</Pagination>
	);
}
const PaginationItems = ({
	totalPages,
	currentPage,
	search,
}: {
	totalPages: number;
	currentPage: number;

	search: string;
}) => {
	let items = [];
	for (let i = 1; i <= totalPages; i++) {
		items.push(
			<PaginationItem key={i}>
				<PaginationLink
					isActive={i === currentPage}
					href={
						`?page=${i}` +
						(search != undefined ? `&search=${search}` : "")
					}
				>
					{i}
				</PaginationLink>
			</PaginationItem>
		);
	}
	return items;
};
