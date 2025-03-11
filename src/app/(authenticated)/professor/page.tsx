import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationPrevious } from "@/components/ui/pagination";
import { ProfessorOverviewTable } from "./professor-overview";

const ProfessorPage=()=>{
    return <div>
        <h1>Professor</h1>
        <ProfessorOverviewTable 
        />
    </div>
}

export default ProfessorPage;
