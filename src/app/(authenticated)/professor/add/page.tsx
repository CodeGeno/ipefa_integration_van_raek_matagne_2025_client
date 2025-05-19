import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type FormData = {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  sexe: string;
  telephone: string;
  email: string;
  section: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
};

export default function AddStudentForm() {
  const onSubmit = (data: FormData) => {
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Ajouter un Étudiant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-4">
          {/* Colonne gauche - Infos étudiant */}
          <div className="flex-1">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Coordonnées</h2>

              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input id="nom" placeholder="Nom" />
              </div>

              {/* Prénom */}
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input id="prenom" placeholder="Prénom" />
              </div>

              {/* Date de naissance */}
              <div className="space-y-2">
                <Label>Date de naissance</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Sélectionner une date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar mode="single" initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Sexe */}
              <div className="space-y-2">
                <Label>Sexe</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Homme">Homme</SelectItem>
                    <SelectItem value="Femme">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone (GSM)</Label>
                <Input id="telephone" placeholder="+32 400 00 00" />
              </div>

              {/* Section */}
              <div className="space-y-2">
                <Label>Section</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bachelier en Informatique">
                      Bachelier en Informatique
                    </SelectItem>
                    <SelectItem value="Bachelier en Sciences de gestion">
                      Bachelier en Sciences de gestion
                    </SelectItem>
                    <SelectItem value="Bachelier en Droit">
                      Bachelier en Droit
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Séparateur */}
          <Separator orientation="vertical" className="hidden sm:block" />

          {/* Colonne droite - Adresse */}
          <div className="flex-1">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Adresse</h2>

              {/* Adresse */}
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input id="adresse" placeholder="Rue et numéro" />
              </div>

              {/* Code Postal */}
              <div className="space-y-2">
                <Label htmlFor="codePostal">Code Postal</Label>
                <Input id="codePostal" placeholder="1000" />
              </div>

              {/* Ville */}
              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input id="ville" placeholder="Bruxelles" />
              </div>

              {/* Pays */}
              <div className="space-y-2">
                <Label htmlFor="pays">Pays</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Belgique">Belgique</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full mt-4">
          Ajouter
        </Button>
      </CardContent>
    </>
  );
}
