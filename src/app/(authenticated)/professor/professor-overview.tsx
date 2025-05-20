"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Button } from "@/components/ui"  
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useState } from "react"
    // Professors data
  const professeurs = [
    {
      matricule: "1-900101-001",
      nom: "Dupont",
      prenom: "Martin",
      email: "martin.dupont@efpl.be",
    },
    {
      matricule: "2-850505-002",
      nom: "Durand",
      prenom: "Claire",
      email: "claire.durand@efpl.be",
    },
  ]
  
  export function ProfessorOverviewTable() {
    const [page, setPage] = useState(1);
    return (
        <> 
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Matricule</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professeurs.map((prof) => (
            <TableRow key={prof.matricule}>
              <TableCell className="font-medium">{prof.matricule}</TableCell>
              <TableCell>{prof.nom}</TableCell>
              <TableCell>{prof.prenom}</TableCell>
              <TableCell>{prof.email}</TableCell>
              <TableCell className="flex justify-center space-x-2">
                <Button >
                  Modifier
                </Button>
                <Button variant="destructive">
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
         {page > 1 && (
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
         )}
          <PaginationItem>
            <PaginationLink href="#">{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination></>
    )
  }
  