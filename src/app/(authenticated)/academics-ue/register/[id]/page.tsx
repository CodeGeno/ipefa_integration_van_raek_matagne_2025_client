import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

enum RegistrationStatus {
  APPROVED = "AP",
  REJECTED = "NP",
}

const AcademicsUERegisterPage = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Inscription aux UE</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Matricule</TableHead>
            <TableHead>Nom Prénom</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>12345</TableCell>
            <TableCell>John Doe</TableCell>
            <TableCell>{RegistrationStatus.APPROVED}</TableCell>
            <TableCell className="text-right">
              <Button variant="default">Inscrire</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default AcademicsUERegisterPage;
