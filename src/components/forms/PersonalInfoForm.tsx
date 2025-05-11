import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { GenderEnum } from "@/model/enum/gender.enum";
import DatePicker from "../ui/date-picker";

interface PersonalInfoFormProps {
  control: Control<any>;
  isEditing: boolean;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  control,
  isEditing = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="contactDetails.firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="contactDetails.lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isEditing ? (
          <div className="flex flex-col justify-between pt-1.5">
            <FormLabel>Date de naissance</FormLabel>
            <div className="w-full pl-3 text-left font-normal border rounded-md p-2 bg-muted text-muted-foreground">
              {control._formValues.contactDetails.birthDate ? (
                format(control._formValues.contactDetails.birthDate, "PPP", {
                  locale: fr,
                })
              ) : (
                <span>Non spécifiée</span>
              )}
            </div>
          </div>
        ) : (
          <FormField
            control={control}
            name="contactDetails.birthDate"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between pt-1.5">
                <FormLabel>Date de naissance</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP", {
                            locale: fr,
                          })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePicker
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={control}
          name="contactDetails.gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un genre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(GenderEnum).map((gender) => {
                    return (
                      <SelectItem key={gender} value={gender}>
                        {GenderEnum[gender as keyof typeof GenderEnum]}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="contactDetails.phoneNumber"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Numéro de téléphone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isEditing ? (
          <div className="md:col-span-2">
            <FormLabel>Matricule</FormLabel>
            <div className="w-full pl-3 text-left font-normal border rounded-md p-2 bg-muted text-muted-foreground">
              {control._formValues.contactDetails.identifier || "Non spécifié"}
            </div>
          </div>
        ) : (
          <FormField
            control={control}
            name="contactDetails.identifier"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Matricule</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {isEditing ? (
          <div className="md:col-span-2">
            <FormLabel>Email</FormLabel>
            <div className="w-full pl-3 text-left font-normal border rounded-md p-2 bg-muted text-muted-foreground">
              {control._formValues.email || "Non spécifié"}
            </div>
          </div>
        ) : (
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};
