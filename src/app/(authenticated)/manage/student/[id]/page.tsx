export default function StudentPage({ params }: { params: { id: string } }) {
	const { id } = params;
	return <div>StudentPage {id}</div>;
}
