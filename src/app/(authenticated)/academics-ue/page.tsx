"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AcademicUE {
  id: string;
  label: string;
  numberOfPeriods: number;
  sectionId: string;
  sectionName: string;
  cycleYear: number;
  startDate: string;
  endDate: string;
  prerequisites: string[];
  sessions: UESession[];
}

interface UESession {
  id: string;
  date: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface Section {
  sectionId: number;
  name: string;
  sectionType: string;
  sectionCategory: string;
  description: string;
}

interface FormValues {
  label: string;
  sectionId: string;
  cycleYear: number;
  numberOfPeriods: number;
  startDate: Date;
  endDate: Date;
}

export default function AcademicsUEPage() {
  const { toast } = useToast();
  const [ues, setUes] = useState<AcademicUE[]>([]);
  const [filteredUes, setFilteredUes] = useState<AcademicUE[]>([]);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [formData, setFormData] = useState<FormValues>({
    label: "",
    sectionId: "",
    cycleYear: 1,
    numberOfPeriods: 0,
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    fetchUEs();
    fetchSections();
  }, []);

  useEffect(() => {
    filterUes();
  }, [ues, selectedSection, selectedYear]);

  const filterUes = () => {
    let filtered = [...ues];
    if (selectedSection !== "all") {
      filtered = filtered.filter((ue) => ue.sectionId === selectedSection);
    }
    if (selectedYear !== "all") {
      filtered = filtered.filter(
        (ue) => ue.cycleYear.toString() === selectedYear
      );
    }
    setFilteredUes(filtered);
  };

  const fetchUEs = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/ue/list/");
      if (!response.ok) {
        throw new Error("Failed to fetch UEs");
      }
      const responseData = await response.json();
      // Extract UEs from the nested data property
      const ues = responseData.data || [];
      setUes(ues);
    } catch (err) {
      console.error("Error fetching UEs:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch UEs",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/section/list/");
      if (!response.ok) {
        throw new Error("Failed to fetch sections");
      }
      const responseData = await response.json();
      // Extract sections from the nested data property
      const sections = responseData.data || [];
      setSections(sections);
    } catch (err) {
      console.error("Error fetching sections:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch sections",
      });
    }
  };

  const handleCreateUE = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8000/ue-management/academic-ues/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            startDate: formData.startDate.toISOString(),
            endDate: formData.endDate.toISOString(),
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "UE created successfully",
        });
        setFormData({
          label: "",
          sectionId: "",
          cycleYear: 1,
          numberOfPeriods: 0,
          startDate: new Date(),
          endDate: new Date(),
        });
        fetchUEs();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create UE",
        });
      }
    } catch (err) {
      console.error("Error creating UE:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while creating the UE",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return format(date, "dd/MM/yyyy");
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Academic UEs</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Academic UE
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Academic UE</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateUE} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="label">UE Label</Label>
                    <Input
                      id="label"
                      value={formData.label}
                      onChange={(e) =>
                        setFormData({ ...formData, label: e.target.value })
                      }
                      placeholder="e.g., Projet SGDB"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Select
                      value={formData.sectionId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, sectionId: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem
                            key={section.sectionId}
                            value={section.sectionId.toString()}
                          >
                            {section.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cycleYear">Cycle Year</Label>
                    <Select
                      value={formData.cycleYear.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, cycleYear: parseInt(value) })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cycle year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="periods">Number of Periods</Label>
                    <Input
                      id="periods"
                      type="number"
                      min={1}
                      value={formData.numberOfPeriods}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          numberOfPeriods: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? (
                            format(formData.startDate, "PPP", { locale: fr })
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) =>
                            date &&
                            setFormData({ ...formData, startDate: date })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? (
                            format(formData.endDate, "PPP", { locale: fr })
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) =>
                            date && setFormData({ ...formData, endDate: date })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Create UE
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="w-1/3">
              <Label>Filter by Section</Label>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sections.map((section) => (
                    <SelectItem
                      key={section.sectionId}
                      value={section.sectionId.toString()}
                    >
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/3">
              <Label>Filter by Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Cycle Year</TableHead>
                <TableHead>Periods</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredUes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No UEs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUes.map((ue) => (
                  <TableRow key={ue.id}>
                    <TableCell>{ue.label}</TableCell>
                    <TableCell>{ue.sectionName}</TableCell>
                    <TableCell>{ue.cycleYear}</TableCell>
                    <TableCell>{ue.numberOfPeriods}</TableCell>
                    <TableCell>{formatDate(ue.startDate)}</TableCell>
                    <TableCell>{formatDate(ue.endDate)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
