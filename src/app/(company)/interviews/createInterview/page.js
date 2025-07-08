"use client";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
  format,
  addMinutes,
  parse,
  isBefore,
  isAfter,
  addDays,
} from "date-fns";
// import { Sidebar } from '@/components/layout/Sidebar';
// import { Header } from '@/components/layout/Header';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  ArrowLeft,
  CalendarCheck,
  FileCheck,
  Check,
  Percent,
  Palette,
  Sparkles,
  WandSparkles,
  GanttChartSquare,
  ChevronRight,
  SaveAll,
  LoaderCircle,
  AlertCircle,
  AlertCircleIcon,
  Edit,
  X,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
// import RichTextEditor from '@/components/editors/RichTextEditor';
// import AIDescriptionGenerator from '@/components/generators/AIDescriptionGenerator';
// import SkillsInput from '@/components/inputs/SkillsInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkillsInput from "@/components/inputs/skillsInput";
import dynamic from "next/dynamic";
const QuillEditor = dynamic(() => import("@/components/quillEditor"), {
  ssr: false,
});
// Define your form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import {
  generateInterviewJobDescription,
  generateInterviewSchedules,
  generateRecommondations,
  generateSoftSkills,
} from "@/lib/api/ai";
import { getSession } from "next-auth/react";
import {
  createCategory,
  getInterviewCategoryCompanyById,
} from "@/lib/api/interview-category";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createInterview } from "@/lib/api/interview";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { name } from "@stream-io/video-react-sdk";
const COLORS = [
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
  "#0EA5E9",
  "#8B5CF6",
];

const DURATION_PRESETS = [
  { id: "short", label: "Short", value: 30, description: "30 min interview" },
  {
    id: "standard",
    label: "Standard",
    value: 60,
    description: "1 hour interview",
  },
  {
    id: "extended",
    label: "Extended",
    value: 90,
    description: "1.5 hour interview",
  },
  {
    id: "comprehensive",
    label: "Comprehensive",
    value: 120,
    description: "2 hour interview",
  },
];

const INTERVAL_PRESETS = [
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 240, label: "4 hours" },
];

const CreateInterview = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", percentage: 0 });
  const [schedules, setSchedules] = useState([]);
  const [dateRange, setDateRange] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [duration, setDuration] = useState("60");
  const [skills, setSkills] = useState([]);
  const [selectedPredefinedCategory, setSelectedPredefinedCategory] =
    useState("");
  const [predefinedCategoryPercentage, setPredefinedCategoryPercentage] =
    useState(20);
  // const [technicalPercentage, setTechnicalPercentage] = useState(30);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [newCategoryColor, setNewCategoryColor] = useState(COLORS[1]);
  const [interviewCategory, setInterviewCategory] = React.useState("Technical");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotStartTime, setSlotStartTime] = useState("09:00");
  const [slotEndTime, setSlotEndTime] = useState("17:00");
  const [selectedDuration, setSelectedDuration] = useState(
    DURATION_PRESETS[1].id
  );
  const [intervalMinutes, setIntervalMinutes] = useState(60);
  const [generatedSlots, setGeneratedSlots] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const [descriptionPrompt, setDescriptionPrompt] = React.useState("");
  const [jobDescription, setJobDescription] = React.useState("");
  const [genJobDescription, setGenJobDescription] = React.useState();
  const [jobTitle, setJobTitle] = React.useState("");
  const [interviewCatName, setInterviewCatName] = React.useState([]);
  const [interviewCatDesc, setInterviewCateDesc] = React.useState([]);
  const [color, setColor] = useState("#034f84");
  const [interviewCategories, setInterviewCategories] = React.useState([]);
  const [filteredCategories, setFilteredCategories] = React.useState([]);
  const [inputCatagory, setInputCatagory] = React.useState("");
  const [technicalCategoryId, setTechnicalCategoryId] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [inputPercentage, setInputPercentage] = React.useState("");
  const [date, setDate] = React.useState("");
  const router = useRouter();
  const [interviewMedium, setInterviewMedium] = useState("VIRTUAL");
  const [hasDevice, setHasDevice] = useState(true);
  const [intervieweeType, setIntervieweeType] = useState("EMPLOYEE");
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [technicalPercentage, setTechnicalPercentage] = useState(60);
  const [softSkillsPercentage, setSoftSkillsPercentage] = useState(40);
  const [useQuestionnaire, setUseQuestionnaire] = useState(true);
  const [newSoftSkill, setNewSoftSkill] = useState({
    name: "",
    description: "",
    percentage: 0,
    subcategories: [],
  });
  const [isSoftSkillPromptOpen, setIsSoftSkillPromptOpen] = useState(false);
  const [softSkillPrompt, setSoftSkillPrompt] = useState("");
  const [editingSoftSkill, setEditingSoftSkill] = useState(null);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);

  // Add new state for subcategory management
  const [newSubcategory, setNewSubcategory] = useState({
    skillId: null,
    name: "",
    description: "",
  });
  const [proficiencyLevel, setProficiencyLevel] = useState(null);
  const [relatedField, setRelatedField] = useState(null);

  const [isSubcategoryPromptOpen, setIsSubcategoryPromptOpen] = useState(false);
  const [subcategoryPrompt, setSubcategoryPrompt] = useState("");
  const [currentSkillForSubcategories, setCurrentSkillForSubcategories] =
    useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [softSkills, setSoftSkills] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [isAddingSoftSkill, setIsAddingSoftSkill] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [softSkillsLoading, setSoftSkillsLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [hasAutomated, setHasAutomated] = useState(false);
  const [totalAutomatedQuestions, setTotalAutomatedQuestions] = useState(0);


  useEffect(() => {
    if (technicalCategoryId && categoryList.length === 0) {
      setCategoryList([
        {
          key: technicalCategoryId,
          catagory: "Technical Skills",
          percentage: technicalPercentage,
        },
      ]);
    }
  }, [technicalCategoryId, technicalPercentage]);

  // useEffect(() => {
  //   if (categories.length === 0) {
  //     setCategories([
  //       {
  //         id: 'technical',
  //         name: 'Technical Skills',
  //         percentage: technicalPercentage,
  //       }
  //     ]);
  //   }
  // }, [technicalPercentage]);

  const handleTechnicalPercentageValueChange = (value) => {
    setTechnicalPercentage(value);
    setCategoryList((prev) =>
      prev.map((cat) =>
        cat.key === technicalCategoryId ? { ...cat, percentage: value } : cat
      )
    );
  };

  const handleGenerateSoftSkills = async (e) => {
    e.preventDefault();
    setSoftSkillsLoading(true);
    try {
      const data = {
        position: jobTitle,
        qualifications: jobDescription,
        industry: relatedField,
        experience_level: proficiencyLevel,
      };
      const response = await generateSoftSkills(data);
      if (response) {
        // const data = response.data.skills;
        setSoftSkills(
          response.data.softskills.map((skill, index) => ({
            ...skill,
            expanded: false,
            id: `s${index + 1}`,
          }))
        );
        setSoftSkillsLoading(false);
      }
    } catch (err) {
      setSoftSkillsLoading(false);
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Soft Skill generation failed: ${data.message}`,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "An unexpected error occurred. Please try again.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An unexpected error occurred. Please check your network and try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  const handleGenerateAISuggestioins = async (e) => {
    e.preventDefault();
    setSuggestionsLoading(true);
    try {
      const data = {
        position: jobTitle,
        qualifications: jobDescription,
        industry: relatedField,
        experience_level: proficiencyLevel,
        technicalPercentage: technicalPercentage,
        softSkillsPercentage: softSkillsPercentage,
        flexibleAssessment: true,
        softSkills: softSkills,
        questions: [],
      };
      const response = await generateRecommondations(data);
      if (response) {
        setShowAnalysis(true);
        setAiSuggestions(response.data.recommendation);
        // const data = response.data.skills;
        // setSoftSkills(
        //   response.data.softskills.map((skill, index) => ({
        //     ...skill,
        //     expanded: false,
        //     id: `s${index + 1}`,
        //   }))
        // );
        setSuggestionsLoading(false);
      }
    } catch (err) {
      setSuggestionsLoading(false);
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Recommondation generation failed: ${data.message}`,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "An unexpected error occurred. Please try again.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An unexpected error occurred. Please check your network and try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  // const findPredefinedCategory = (name) => {
  //   return PREDEFINED_CATEGORIES.find(cat => cat.name === name);
  // };

  const resetPredefinedCategorySelection = () => {
    setSelectedPredefinedCategory("");
    setPredefinedCategoryPercentage(20);
    setSelectedColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  };

  const handleAddPredefinedCategory = () => {
    if (!selectedPredefinedCategory) return;

    const categoryToAdd = findPredefinedCategory(selectedPredefinedCategory);
    if (!categoryToAdd) return;

    if (categories.some((cat) => cat.name === categoryToAdd.name)) {
      toast.error(`${categoryToAdd.name} already added`);
      return;
    }

    const totalPercentage = categories.reduce(
      (sum, cat) => sum + cat.percentage,
      0
    );
    if (totalPercentage + predefinedCategoryPercentage > 100) {
      toast.error("Total percentage cannot exceed 100%");
      return;
    }

    const newCategoryObj = {
      id: Date.now().toString(),
      name: categoryToAdd.name,
      percentage: predefinedCategoryPercentage,
      color: selectedColor,
    };

    setCategories([...categories, newCategoryObj]);
    resetPredefinedCategorySelection();
  };

  const addCategory = () => {
    if (!newCategory.name) {
      toast.error("Please enter a category name");
      return;
    }

    const totalPercentage = categories.reduce(
      (sum, cat) => sum + cat.percentage,
      0
    );
    if (totalPercentage + newCategory.percentage > 100) {
      toast.error("Total percentage cannot exceed 100%");
      return;
    }

    const newCategoryObj = {
      id: Date.now().toString(),
      name: newCategory.name,
      percentage: newCategory.percentage,
      color: newCategoryColor,
    };

    setCategories([...categories, newCategoryObj]);
    setNewCategory({ name: "", percentage: 0 });
    setNewCategoryColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  };

  const removeCategory = (key) => {
    if (key === technicalCategoryId) {
      toast.error(
        "Technical Skills category is mandatory and cannot be removed"
      );
      return;
    }
    setCategoryList(categoryList.filter((cat) => cat.key !== key));
  };

  const generateTimeSlots = () => {
    if (!selectedDate || !slotStartTime || !slotEndTime) {
      toast.error("Please select date and time range");
      return;
    }

    const durationValue =
      DURATION_PRESETS.find((d) => d.id === selectedDuration)?.value || 60;
    setDuration(durationValue.toString());

    const startDate = new Date(selectedDate);
    startDate.setHours(
      parseInt(slotStartTime.split(":")[0]),
      parseInt(slotStartTime.split(":")[1]),
      0
    );

    const endDate = new Date(selectedDate);
    endDate.setHours(
      parseInt(slotEndTime.split(":")[0]),
      parseInt(slotEndTime.split(":")[1]),
      0
    );

    if (isAfter(startDate, endDate)) {
      toast.error("Start time must be before end time");
      return;
    }

    const slots = [];
    let currentSlotStart = new Date(startDate);

    while (isBefore(currentSlotStart, endDate)) {
      const currentSlotEnd = addMinutes(
        new Date(currentSlotStart),
        durationValue
      );

      if (isAfter(currentSlotEnd, endDate)) {
        break;
      }

      slots.push({
        date: new Date(currentSlotStart),
        startTime: format(currentSlotStart, "HH:mm"),
        endTime: format(currentSlotEnd, "HH:mm"),
      });

      currentSlotStart = addMinutes(currentSlotStart, intervalMinutes);
    }

    setGeneratedSlots(slots);

    if (slots.length > 0) {
      setDateRange(format(selectedDate, "yyyy-MM-dd"));
    }
  };

  const addGeneratedSlot = (slot) => {
    const newSchedule = {
      id: Date.now().toString(),
      date: format(slot.date, "yyyy-MM-dd"),
      startTime: slot.startTime,
      endTime: slot.endTime,
    };

    setSchedules([...schedules, newSchedule]);
    toast({
      description: "Time slot added to schedule",
    });
  };

  const addSchedule = () => {
    if (!dateRange || !startTime || !endTime) {
      toast.error("Please fill all schedule fields");
      return;
    }

    const newSchedule = {
      id: Date.now().toString(),
      date: dateRange,
      startTime,
      endTime,
    };

    setSchedules([...schedules, newSchedule]);
  };

  const removeSchedule = (id) => {
    setSchedules(schedules.filter((sch) => sch.id !== id));
  };

  const calculateEndTime = (start, durationMinutes) => {
    const [hours, minutes] = start.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes + durationMinutes;

    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;

    return `${newHours.toString().padStart(2, "0")}:${newMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const addAllGeneratedSlots = () => {
    if (generatedSlots.length === 0) {
      toast.error("No time slots generated yet");
      return;
    }

    const newSchedules = generatedSlots.map((slot) => ({
      id: Date.now() + Math.random().toString(),
      date: format(slot.date, "yyyy-MM-dd"),
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    setSchedules([...schedules, ...newSchedules]);
    toast({
      description: `Added ${generatedSlots.length} time slots to schedule`,
    });
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleOnChange = (content) => {
    setJobDescription(content);
  };

  const generateDescription = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const data = {
        description: descriptionPrompt,
      };
      const response = await generateInterviewJobDescription(data);

      if (response) {
        setGenJobDescription(response.data.description);
        setJobDescription(response.data.description);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Interview create failed: ${data.message}`,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "An unexpected error occurred. Please try again.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An unexpected error occurred. Please check your network and try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } finally {
      setIsPromptModalOpen(false);
      setIsLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const session = await getSession();
      const companyId = session?.user?.companyID;
      const response = await createCategory({
        companyId: companyId,
        categoryName: interviewCatName,
        description: interviewCatDesc,
        color: newCategoryColor,
      });

      if (response) {
        // Assuming `response.data` contains the newly created category
        const newCategory = response.data.category;

        // Update the state without re-fetching data
        setInterviewCategories((prevCategories) => [
          ...prevCategories,
          newCategory,
        ]);
        setFilteredCategories((prevCategories) => [
          ...prevCategories,
          newCategory,
        ]);

        // setModalOpen(false);
        toast({
          title: "Interview Category Created Successfully!",
          description: "The interview category has been successfully created.",
        });

        // Optionally, reset input fields
        setInterviewCatName("");
        setInterviewCateDesc("");
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Interview category create failed: ${data.message}`,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "An unexpected error occurred. Please try again.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } else {
      }
    }
  };

  const handleAddCatagoty = (e) => {
    e.preventDefault();

    const newPercentage = parseFloat(inputPercentage.trim());
    // const currentTotal = categoryList.reduce((total, cat) => total + parseFloat(cat.percentage), 0);

    if (inputCatagory.trim() === "" || inputPercentage.trim() === "") {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "Please provide both the category name and percentage to add to the list.",
      });
      return;
    }

    // if (currentTotal + newPercentage > 100) {
    //   toast({
    //     variant: "destructive",
    //     title: "Uh oh! Something went wrong.",
    //     description: "The percentage cannot exceed 100%.",
    //   });
    //   return;
    // }

    {
      setCategoryList((prev) => [
        ...prev,
        {
          key: inputCatagory.trim(),
          catagory:
            interviewCategories.find(
              (cat) => cat.categoryId === inputCatagory.trim()
            )?.categoryName || "Unknown Category",
          percentage: newPercentage, // Store as a number, not a string
          color:
            interviewCategories.find(
              (cat) => cat.categoryId === inputCatagory.trim()
            )?.color || COLORS[prev.length % COLORS.length], // Default color if not found
        },
      ]);
      setInputPercentage("");
      setInputCatagory("");
    }
  };

  const getRandomHexColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add debugging logs
    // console.log("Skills array:", skills);
    // console.log("Is skills an array?", Array.isArray(skills));
    // console.log("Skills length:", skills.length);
    if (skills.length > 0) {
      console.log("First skill object:", skills[0]);
    }

    if (schedules.length === 0) {
      toast.error("Please add at least one schedule");
      return;
    }

    // Validate that schedules exist
    if (schedules.length === 0) {
      toast.error("Please add at least one schedule");
      return;
    }

    try {
      // Get session and company ID
      const session = await getSession();
      const companyId = session?.user?.companyID;

      // Calculate startDate and endDate from schedules
      const allStartTimes = schedules.map(
        (sch) => new Date(`${sch.date}T${sch.startTime}:00`)
      );
      const allEndTimes = schedules.map(
        (sch) => new Date(`${sch.date}T${sch.endTime}:00`)
      );
      const startDate = new Date(Math.min(...allStartTimes));
      const endDate = new Date(Math.max(...allEndTimes));

      // Prepare interview data
      const interviewData = {
        companyID: companyId,
        jobTitle: jobTitle,
        jobDescription: jobDescription,
        interviewCategory,
        requiredSkills: skills.map(String).join(", "),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: "DRAFT",
        // categoryAssignments: categoryList.map((cat) => ({
        //   categoryId: cat.key,
        //   percentage: parseFloat(cat.percentage),
        // })),
        categoryAssignments: [
          {
            categoryId: interviewCategories.find(
              (intervalMinutes) => intervalMinutes.categoryName === "Technical"
            )?.categoryId,
            percentage: technicalPercentage,
            subAssignments: [],
          },
          {
            categoryId: interviewCategories.find(
              (intervalMinutes) => intervalMinutes.categoryName === "Soft"
            )?.categoryId,
            percentage: softSkillsPercentage,
            subAssignments: softSkills.map((skill) => ({
              name: skill.name,
              percentage: parseInt(skill.percentage, 10),
              color: getRandomHexColor(),
              subcategoryParameters: skill.subcategories.map((sub) => ({
                name: sub.name,
                percentage: parseInt(sub.percentage, 10),
              })),
            })),
          },
        ],
        interviewMedium: interviewMedium,
        isWithDevice: hasDevice,
        isAutomated: hasAutomated,
        industry: relatedField,
        intervieweeType: intervieweeType,
        proficiencyLevel: proficiencyLevel,
        flexibleAssignment: useQuestionnaire,
        schedules: schedules
          .filter((schedule) => !schedule.isBooked) // Exclude booked schedules, if applicable
          .map((schedule) => {
            const startDateObj = new Date(schedule.date);
            const [startHours, startMinutes] = schedule.startTime
              .split(":")
              .map(Number);
            const localStart = new Date(
              startDateObj.setHours(startHours, startMinutes, 0, 0)
            );

            const endDateObj = new Date(schedule.date);
            const [endHours, endMinutes] = schedule.endTime
              .split(":")
              .map(Number);
            const localEnd = new Date(
              endDateObj.setHours(endHours, endMinutes, 0, 0)
            );

            return {
              startTime: localStart.toISOString(),
              endTime: localEnd.toISOString(),
            };
          }),
      };

      // Log data for debugging (optional)
      console.log("Submitting interview data:", interviewData);

      // Call the API to create the interview
      const response = await createInterview(interviewData);
      console.log("interview sucessfully create response:", response);

      if (response) {
        toast({
          title: "Interview Created Successfully!",
          description: "The interview has been successfully created.",
        });

        router.push("/interviews");
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Interview creation failed: ${
            data?.message || "An unexpected error occurred."
          }`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An unexpected error occurred. Please check your network and try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  const handleScheduleGenerate = async (e) => {
    setIsGeneratingSchedule(true);
    e.preventDefault();

    try {
      // Validate inputs
      if (!date?.from || !date?.to || !slotStartTime || !slotEndTime) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Please select a date range and time range.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        setIsGeneratingSchedule(false);
        return;
      }

      // Get duration from selectedDuration or fallback to duration state
      const durationValue =
        DURATION_PRESETS.find((d) => d.id === selectedDuration)?.value ||
        parseInt(duration, 10);
      if (!durationValue || durationValue <= 0) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Please select a valid interview duration.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        setIsGeneratingSchedule(false);
        return;
      }

      // Format startDate and endDate
      const startDate = new Date(date.from);
      const [startHours, startMinutes] = slotStartTime.split(":").map(Number);
      startDate.setHours(startHours, startMinutes, 0, 0);

      const endDate = new Date(date.to);
      const [endHours, endMinutes] = slotEndTime.split(":").map(Number);
      endDate.setHours(endHours, endMinutes, 0, 0);

      if (isAfter(startDate, endDate)) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Start date/time must be before end date/time.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        setIsGeneratingSchedule(false);
        return;
      }

      // Prepare the API payload
      const data = {
        duration: durationValue,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        dailySessions: [
          {
            startTime: slotStartTime,
            endTime: slotEndTime,
            intervalMinutes: parseInt(intervalMinutes, 10),
          },
        ],
        nonWorkingDates: [],
      };

      // Call the API
      const response = await generateInterviewSchedules(data);
      console.log("Generated schedules:", response.data.schedules);

      if (response && response.data && Array.isArray(response.data.schedules)) {
        // Map the API response to the format expected by generatedSlots
        const newSlots = response.data.schedules
          .map((slot, index) => {
            // Validate that date, startTime, and endTime exist and are strings
            if (
              !slot.date ||
              !slot.startTime ||
              !slot.endTime ||
              typeof slot.date !== "string" ||
              typeof slot.startTime !== "string" ||
              typeof slot.endTime !== "string"
            ) {
              console.warn(`Invalid schedule at index ${index}:`, slot);
              return null;
            }

            // Parse the date string (e.g., "2025-04-10") into a Date object
            const slotDate = new Date(slot.date);
            if (isNaN(slotDate.getTime())) {
              console.warn(
                `Invalid date in schedule at index ${index}:`,
                slot.date
              );
              return null;
            }

            // Parse the time strings (HH:mm)
            const [startHours, startMinutes] = slot.startTime
              .split(":")
              .map(Number);
            const [endHours, endMinutes] = slot.endTime.split(":").map(Number);

            // Create Date objects by combining the date with the start and end times
            const slotStart = new Date(slot.date);
            slotStart.setHours(startHours, startMinutes, 0, 0);

            const slotEnd = new Date(slot.date);
            slotEnd.setHours(endHours, endMinutes, 0, 0);

            // Check if the dates are valid
            if (isNaN(slotStart.getTime()) || isNaN(slotEnd.getTime())) {
              console.warn(`Invalid date in schedule at index ${index}:`, {
                startTime: slot.startTime,
                endTime: slot.endTime,
              });
              return null;
            }

            return {
              date: slotStart, // Date object for the start time
              startTime: slot.startTime, // e.g., "08:00"
              endTime: slot.endTime, // e.g., "10:00"
            };
          })
          .filter((slot) => slot !== null); // Remove invalid slots

        // Update the generatedSlots state
        setGeneratedSlots(newSlots);

        if (newSlots.length === 0) {
          toast({
            variant: "destructive",
            title: "No Valid Time Slots",
            description:
              "The server returned schedules, but none could be parsed into valid time slots.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        } else {
          toast({
            title: "Success!",
            description: `${newSlots.length} time slots generated successfully.`,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "No schedules returned from the server.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (err) {
      setIsGeneratingSchedule(false);
      if (err.response) {
        const { data } = err.response;
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Schedule generation failed: ${
            data?.message || "An unexpected error occurred."
          }`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An unexpected error occurred. Please check your network and try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  useEffect(() => {
    const fetchInterviewCategories = async () => {
      try {
        const session = await getSession();
        const companyId = session?.user?.companyID;
        const response = await getInterviewCategoryCompanyById(companyId);
        // console.log(response.data.categories);
        if (response) {
          setInterviewCategories(response.data.categories);
          setFilteredCategories(response.data.categories);
          console.log("fectbhinbg categories::::;", response.data.categories);
          // Find the "Technical Skills" category and store its ID
          const technicalCategory = response.data.categories.find(
            (cat) => cat.categoryName == "Technical"
          );
          if (technicalCategory) {
            setTechnicalCategoryId(technicalCategory.categoryId); // New state for technical category ID
          }
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error fetching interviews: ${error}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    };
    fetchInterviewCategories();
  }, []);

  // useEffect(() => {
  //   const filter = interviewCategories.filter((category) =>
  //     categoryList.every((item) => item.key !== category.categoryId)
  //   );
  //   setFilteredCategories(filter);
  // }, []);

  useEffect(() => {
    // Filter out categories that are already in categoryList
    const updatedFilteredCategories = interviewCategories.filter((category) =>
      categoryList.every((item) => item.key !== category.categoryId)
    );
    setFilteredCategories(updatedFilteredCategories);
  }, [categoryList, interviewCategories]); // Depend on categoryList and interviewCategories

  // Handle percentage changes
  const handleTechnicalPercentageChange = (value) => {
    const newValue = value[0];
    setTechnicalPercentage(newValue);
    setSoftSkillsPercentage(100 - newValue);
  };

  const handleSoftSkillsPercentageChange = (value) => {
    const newValue = value[0];
    setSoftSkillsPercentage(newValue);
    setTechnicalPercentage(100 - newValue);
  };

  const handleToggleExpand = (skillId) => {
    // e.preventDefault();
    setSoftSkills(
      softSkills.map((skill) =>
        skill.id === skillId ? { ...skill, expanded: !skill.expanded } : skill
      )
    );
  };

  const handleAnalyze = () => {
    setShowAnalysis(true);
  };

  const handleAddSubcategory = (e) => {
    if (
      newSubcategory.skillId &&
      newSubcategory.name.trim() &&
      newSubcategory.description.trim()
    ) {
      setSoftSkills(
        softSkills.map((skill) => {
          if (skill.id === newSubcategory.skillId) {
            // Calculate default percentage
            const existingTotal = skill.subcategories.reduce(
              (sum, sub) => sum + sub.percentage,
              0
            );
            const defaultPercentage =
              existingTotal < 100 ? 100 - existingTotal : 0;

            // If adding this would make total > 100%, adjust existing subcategories
            let updatedSubcategories = [...skill.subcategories];
            if (existingTotal >= 100 && updatedSubcategories.length > 0) {
              const reduction =
                existingTotal > 0 ? 20 / updatedSubcategories.length : 0;
              updatedSubcategories = updatedSubcategories.map((sub) => ({
                ...sub,
                percentage: Math.max(5, sub.percentage - reduction),
              }));

              // Recalculate total after adjustments
              const newTotal = updatedSubcategories.reduce(
                (sum, sub) => sum + sub.percentage,
                0
              );
              const newDefaultPercentage = Math.max(5, 100 - newTotal);

              return {
                ...skill,
                subcategories: [
                  ...updatedSubcategories,
                  {
                    id: `sub${Date.now()}`,
                    name: newSubcategory.name,
                    description: newSubcategory.description,
                    percentage: newDefaultPercentage,
                  },
                ],
              };
            }

            return {
              ...skill,
              subcategories: [
                ...skill.subcategories,
                {
                  id: `sub${Date.now()}`,
                  name: newSubcategory.name,
                  description: newSubcategory.description,
                  percentage: defaultPercentage,
                },
              ],
            };
          }
          return skill;
        })
      );

      setNewSubcategory({
        skillId: null,
        name: "",
        description: "",
      });
    }
  };

  const handleSoftSkillPercentageChange = (skillId, newPercentage) => {
    // Get the current skill
    const currentSkill = softSkills.find((s) => s.id === skillId);
    if (!currentSkill) return;

    const oldPercentage = currentSkill.percentage;
    const percentageDiff = newPercentage - oldPercentage;

    // If there's only one skill, it should always be 100%
    if (softSkills.length === 1) {
      setSoftSkills([{ ...softSkills[0], percentage: 100 }]);
      return;
    }

    // Calculate how much to adjust other skills
    const otherSkills = softSkills.filter((s) => s.id !== skillId);
    const totalOtherPercentage = otherSkills.reduce(
      (sum, s) => sum + s.percentage,
      0
    );

    if (totalOtherPercentage <= 0) return;

    // Proportionally adjust other skills
    const adjustmentFactor = percentageDiff / totalOtherPercentage;

    setSoftSkills(
      softSkills.map((skill) => {
        if (skill.id === skillId) {
          return { ...skill, percentage: newPercentage };
        } else {
          // Ensure no skill goes below 5%
          const adjustedPercentage = Math.max(
            5,
            skill.percentage - skill.percentage * adjustmentFactor
          );
          return { ...skill, percentage: adjustedPercentage };
        }
      })
    );
  };

  const handleEditSubcategory = (
    skillId,
    subcategoryId,
    name,
    description,
    percentage
  ) => {
    setSoftSkills(
      softSkills.map((skill) => {
        if (skill.id === skillId) {
          // Get the current subcategory
          const currentSubcategory = skill.subcategories.find(
            (sub) => sub.id === subcategoryId
          );
          if (!currentSubcategory) return skill;

          const oldPercentage = currentSubcategory.percentage;
          const percentageDiff = percentage - oldPercentage;

          // If there's only one subcategory, it should always be 100%
          if (skill.subcategories.length === 1) {
            return {
              ...skill,
              subcategories: [
                {
                  ...skill.subcategories[0],
                  name,
                  description,
                  percentage: 100,
                },
              ],
            };
          }

          // Adjust other subcategories proportionally
          const otherSubcategories = skill.subcategories.filter(
            (sub) => sub.id !== subcategoryId
          );
          const totalOtherPercentage = otherSubcategories.reduce(
            (sum, sub) => sum + sub.percentage,
            0
          );

          if (totalOtherPercentage <= 0) return skill;

          // Calculate adjustment factor
          const adjustmentFactor = percentageDiff / totalOtherPercentage;

          // Update all subcategories
          const updatedSubcategories = skill.subcategories.map((sub) => {
            if (sub.id === subcategoryId) {
              return { ...sub, name, description, percentage };
            } else {
              // Adjust other subcategories proportionally
              const adjustedPercentage = Math.max(
                1,
                Math.round(sub.percentage - sub.percentage * adjustmentFactor)
              );
              return { ...sub, percentage: adjustedPercentage };
            }
          });

          // Ensure total is exactly 100%
          const total = updatedSubcategories.reduce(
            (sum, sub) => sum + sub.percentage,
            0
          );
          if (total !== 100 && updatedSubcategories.length > 0) {
            // Find the subcategory that's not being edited with the highest percentage
            const subToAdjust =
              updatedSubcategories
                .filter((sub) => sub.id !== subcategoryId)
                .sort((a, b) => b.percentage - a.percentage)[0] ||
              updatedSubcategories[0];

            const index = updatedSubcategories.findIndex(
              (sub) => sub.id === subToAdjust.id
            );
            if (index >= 0) {
              updatedSubcategories[index] = {
                ...updatedSubcategories[index],
                percentage:
                  updatedSubcategories[index].percentage + (100 - total),
              };
            }
          }

          return {
            ...skill,
            subcategories: updatedSubcategories,
          };
        }
        return skill;
      })
    );
    // setEditingSubcategory(null);
  };

  const handleAddSoftSkill = () => {
    if (newSoftSkill.name.trim() && newSoftSkill.description.trim()) {
      // Create default subcategories if none provided
      const subcategories =
        newSoftSkill.subcategories.length > 0
          ? newSoftSkill.subcategories
          : [
              {
                id: `sub${Date.now()}`,
                name: "General Assessment",
                description: "Overall evaluation of this quality",
                percentage: 100,
              },
            ];

      // Calculate default percentage for the new skill
      let newSkillPercentage = newSoftSkill.percentage || 20; // Default to 20% for the new skill

      // Adjust existing skills to make room for the new one
      const totalExistingPercentage = softSkills.reduce(
        (sum, skill) => sum + skill.percentage,
        0
      );
      const adjustmentFactor =
        (100 - newSkillPercentage) / totalExistingPercentage;

      const updatedSkills = softSkills.map((skill) => {
        const adjustedPercentage = Math.max(
          5,
          Math.round(skill.percentage * adjustmentFactor)
        );
        return { ...skill, percentage: adjustedPercentage };
      });

      // Ensure the total is exactly 100%
      const totalAdjustedPercentage = updatedSkills.reduce(
        (sum, skill) => sum + skill.percentage,
        0
      );
      newSkillPercentage = 100 - totalAdjustedPercentage;

      setSoftSkills([
        ...updatedSkills,
        {
          id: `s${Date.now()}`,
          name: newSoftSkill.name,
          description: newSoftSkill.description,
          expanded: false,
          percentage: newSkillPercentage,
          subcategories,
        },
      ]);

      // Reset form
      setNewSoftSkill({
        name: "",
        description: "",
        percentage: 20,
        subcategories: [],
      });
      setIsAddingSoftSkill(false);
    }
  };

  const handleDeleteSoftSkill = (id) => {
    const skillToDelete = softSkills.find((s) => s.id === id);
    if (!skillToDelete) return;

    const remainingSkills = softSkills.filter((s) => s.id !== id);

    // Redistribute the deleted skill's percentage among remaining skills
    if (remainingSkills.length > 0) {
      const percentageToDistribute = skillToDelete.percentage;
      const totalRemainingPercentage = remainingSkills.reduce(
        (sum, s) => sum + s.percentage,
        0
      );

      const updatedSkills = remainingSkills.map((skill) => {
        const proportion = skill.percentage / totalRemainingPercentage;
        const newPercentage =
          skill.percentage + percentageToDistribute * proportion;
        return { ...skill, percentage: newPercentage };
      });

      setSoftSkills(updatedSkills);
    } else {
      setSoftSkills([]);
    }
  };

  const handleDeleteSubcategory = (skillId, subcategoryId) => {
    setSoftSkills(
      softSkills.map((skill) => {
        if (skill.id === skillId) {
          const remainingSubcategories = skill.subcategories.filter(
            (sub) => sub.id !== subcategoryId
          );

          // Redistribute percentages if there are remaining subcategories
          if (remainingSubcategories.length > 0) {
            // Calculate how to distribute the freed-up percentage
            const deletedSubcategory = skill.subcategories.find(
              (sub) => sub.id === subcategoryId
            );
            const percentageToDistribute = deletedSubcategory
              ? deletedSubcategory.percentage
              : 0;
            const totalRemainingPercentage = remainingSubcategories.reduce(
              (sum, sub) => sum + sub.percentage,
              0
            );

            // Distribute proportionally
            const updatedSubcategories = remainingSubcategories.map((sub) => {
              const proportion = sub.percentage / totalRemainingPercentage;
              const newPercentage = Math.round(
                sub.percentage + percentageToDistribute * proportion
              );
              return { ...sub, percentage: newPercentage };
            });

            // Ensure total is exactly 100%
            const total = updatedSubcategories.reduce(
              (sum, sub) => sum + sub.percentage,
              0
            );
            if (total !== 100 && updatedSubcategories.length > 0) {
              updatedSubcategories[0] = {
                ...updatedSubcategories[0],
                percentage: updatedSubcategories[0].percentage + (100 - total),
              };
            }

            return {
              ...skill,
              subcategories: updatedSubcategories,
            };
          }

          return {
            ...skill,
            subcategories: remainingSubcategories,
          };
        }
        return skill;
      })
    );
  };

  const handleEditSoftSkill = (id, name, description) => {
    setSoftSkills(
      softSkills.map((s) => (s.id === id ? { ...s, name, description } : s))
    );
    setEditingSoftSkill(null);
  };

  const handleAcceptSuggestions = () => {
    // Update percentages
    setTechnicalPercentage(
      aiSuggestions.summary.recommended_weighting.technical_expertise
    );
    setSoftSkillsPercentage(
      aiSuggestions.summary.recommended_weighting.soft_skills
    );

    // // Add suggested questions
    // const newQuestions = [
    //   ...questions.filter((q) => !aiSuggestions.removedQuestionIds.includes(q.id)),
    //   ...aiSuggestions.addedQuestions.map((q) => ({
    //     id: `q${Date.now() + Math.random()}`,
    //     text: q.text,
    //     marks: q.marks,
    //   })),
    // ]
    // setQuestions(newQuestions)

    // Calculate how much percentage to allocate to new skills
    // const remainingSkills = softSkills.filter(
    //   (s) => !aiSuggestions.removedSoftSkillIds.includes(s.id)
    // );
    const newSkillsCount = aiSuggestions.suggested_soft_skills.length;
    // const totalNewSkills = remainingSkills.length + newSkillsCount;

    // If we're adding new skills, adjust percentages
    if (newSkillsCount > 0) {
      // Adjust existing skills
      // const percentagePerSkill = 100 / totalNewSkills;
      // const adjustedSkills = remainingSkills.map((skill) => ({
      //   ...skill,
      //   percentage: percentagePerSkill,
      // }));

      // Add new skills with calculated percentage
      const newSoftSkills = [
        // ...adjustedSkills,
        ...aiSuggestions.suggested_soft_skills.map((s) => ({
          id: `s${Date.now() + Math.random()}`,
          name: s.name,
          description: s.description,
          expanded: false,
          percentage: s.percentage,
          subcategories: s.subcategories.map((sub) => ({
            name: sub.name,
            percentage: parseInt(sub.percentage, 10),
          })),
        })),
      ];

      setSoftSkills(newSoftSkills);
    } else {
      // Just remove skills that need to be removed
      setSoftSkills(remainingSkills);
    }

    setShowAnalysis(false);
  };


  const handleAutomatedQuestionsChange = (value) => {
    setTotalAutomatedQuestions(value[0]); // Slider returns an array even with single value
  };

  return (
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 bg-black items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage
                    href="/interviews"
                    className=" hidden md:block cursor-pointer"
                  >
                    Interviews
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div>
          <main className="container mx-auto py-8 px-4 max-w-[1500px]">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">
                Create Interview
              </h1>
              <p className="text-muted-foreground">
                Set up a new interview session for a candidate
              </p>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-primary/20"
                >
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    <span>Interview Details</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="data-[state=active]:bg-primary/20"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Expertise</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="schedules"
                  className="data-[state=active]:bg-primary/20"
                >
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4" />
                    <span>Schedules</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <Form {...form} className="!p-0">
                <form className="space-y-6">
                  <TabsContent value="details" className="space-y-6">
                    <Card className=" !bg-transparent border-0">
                      {/* <CardHeader>
                        <CardTitle>Interview Details</CardTitle>
                        <CardDescription>
                          Enter the basic details for this interview
                        </CardDescription>
                      </CardHeader> */}
                      <CardContent className="space-y-6 !p-0">
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">
                            Interview Medium
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card
                              className={`cursor-pointer transition-all ${
                                interviewMedium === "VIRTUAL"
                                  ? "border !border-[#3b82f6] !shadow-[0_0_2px_#3b82f6,0_0_4px_#3b82f6] bg-transparent"
                                  : "hover:!border-[#3b82f6]/50"
                              }`}
                              onClick={() => setInterviewMedium("VIRTUAL")}
                            >
                              <CardContent className="p-6 flex items-center gap-4">
                                <div className="rounded-full bg-blue-500/20 p-3">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-500"
                                  >
                                    <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4z" />
                                    <rect
                                      x="3"
                                      y="6"
                                      width="12"
                                      height="12"
                                      rx="2"
                                      ry="2"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="font-medium">
                                    Virtual Interview
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Conduct the interview online via video call
                                  </p>
                                </div>
                              </CardContent>
                            </Card>

                            <Card
                              className={`cursor-pointer transition-all ${
                                interviewMedium === "PHYSICAL"
                                  ? "!border !border-[#3b82f6] !shadow-[0_0_2px_#3b82f6,0_0_4px_#3b82f6] bg-transparent"
                                  : "hover:!border-[#3b82f6]/50"
                              }`}
                              onClick={() => setInterviewMedium("PHYSICAL")}
                            >
                              <CardContent className="p-6 flex items-center gap-4">
                                <div className="rounded-full bg-blue-500/20 p-3">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-500"
                                  >
                                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                    <line x1="6" y1="1" x2="6" y2="4" />
                                    <line x1="10" y1="1" x2="10" y2="4" />
                                    <line x1="14" y1="1" x2="14" y2="4" />
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="font-medium">
                                    Physical Interview
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    Conduct the interview in person
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        {interviewMedium === "PHYSICAL" && (
                          <div className="space-y-3 ml-4 pl-4 border-l border-muted">
                            <h3 className="text-lg font-medium">
                              Device Availability
                            </h3>
                            <RadioGroup
                              value={hasDevice}
                              onValueChange={(value) => setHasDevice(value)}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <div>
                                <RadioGroupItem
                                  value={true}
                                  id="with-device"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="with-device"
                                  className="flex items-center justify-between rounded-md border border-muted bg-black p-3 hover:bg-blue-500/10 hover:text-accent-foreground peer-data-[state=checked]:border-[#3b82f6] peer-data-[state=checked]:!bg-blue-500/10 [&:has([data-state=checked])]:border-[#3b82f6] cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-blue-500/10 p-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-blue-500"
                                      >
                                        <rect
                                          x="4"
                                          y="4"
                                          width="16"
                                          height="16"
                                          rx="2"
                                          ry="2"
                                        />
                                        <rect
                                          x="9"
                                          y="9"
                                          width="6"
                                          height="6"
                                        />
                                        <line x1="9" y1="2" x2="9" y2="4" />
                                        <line x1="15" y1="2" x2="15" y2="4" />
                                        <line x1="9" y1="20" x2="9" y2="22" />
                                        <line x1="15" y1="20" x2="15" y2="22" />
                                        <line x1="20" y1="9" x2="22" y2="9" />
                                        <line x1="20" y1="14" x2="22" y2="14" />
                                        <line x1="2" y1="9" x2="4" y2="9" />
                                        <line x1="2" y1="14" x2="4" y2="14" />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        With Device
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Candidate has a device to join the
                                        interview
                                      </div>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem
                                  value={false}
                                  id="without-device"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="without-device"
                                  className="flex items-center justify-between rounded-md border border-muted bg-black p-3 hover:!bg-blue-500/10 hover:text-accent-foreground peer-data-[state=checked]:border-[#3b82f6] peer-data-[state=checked]:!bg-blue-500/10 [&:has([data-state=checked])]:border-[#3b82f6] cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-blue-500/10 p-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-blue-500"
                                      >
                                        <line x1="2" y1="2" x2="22" y2="22" />
                                        <rect
                                          x="4"
                                          y="4"
                                          width="16"
                                          height="16"
                                          rx="2"
                                          ry="2"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        Without Device
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Candidate does not have a device
                                      </div>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        )}

                        {interviewMedium === "VIRTUAL" && (
                          <div className="space-y-3 ml-4 pl-4 border-l border-muted">
                            <h3 className="text-lg font-medium">
                             Human Interactions
                            </h3>
                            <RadioGroup
                              value={hasAutomated}
                              onValueChange={(value) => setHasAutomated(value)}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              <div>
                                <RadioGroupItem
                                  value={false}
                                  id="with-HumanInteractions"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="with-HumanInteractions"
                                  className="flex items-center justify-between rounded-md border border-muted bg-black p-3 hover:bg-blue-500/10 hover:text-accent-foreground peer-data-[state=checked]:border-[#3b82f6] peer-data-[state=checked]:!bg-blue-500/10 [&:has([data-state=checked])]:border-[#3b82f6] cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-blue-500/10 p-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-blue-500"
                                      >
                                        <rect x="3" y="11" width="18" height="10" rx="2" />
                                        <circle cx="12" cy="5" r="2" />
                                        <path d="M12 7v4" />
                                        <line x1="8" y1="16" x2="8" y2="16" />
                                        <line x1="16" y1="16" x2="16" y2="16" />
                                        <circle cx="8" cy="16" r="1" />
                                        <circle cx="16" cy="16" r="1" />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        With Human interactions
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Interview has a human Interaction
                                      </div>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem
                                  value={true}
                                  id="without-HumanInteractions"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="without-HumanInteractions"
                                  className="flex items-center justify-between rounded-md border border-muted bg-black p-3 hover:!bg-blue-500/10 hover:text-accent-foreground peer-data-[state=checked]:border-[#3b82f6] peer-data-[state=checked]:!bg-blue-500/10 [&:has([data-state=checked])]:border-[#3b82f6] cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="rounded-full bg-blue-500/10 p-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-blue-500"
                                      >
                                        <rect x="4" y="2" width="16" height="20" rx="2" />
                                        <circle cx="12" cy="6" r="1" />
                                        <circle cx="12" cy="18" r="1" />
                                        <line x1="4" y1="9" x2="20" y2="9" />
                                        <line x1="4" y1="14" x2="20" y2="14" />
                                        <circle cx="8" cy="12" r="1" />
                                        <circle cx="16" cy="12" r="1" />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        Without Human interactions
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                       Interview is fully Automatic
                                      </div>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        )}

                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">
                            Interviewee Type
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card
                              className={`cursor-pointer transition-all ${
                                intervieweeType === "EMPLOYEE"
                                  ? "!border !border-[#3b82f6] !shadow-[0_0_2px_#3b82f6,0_0_4px_#3b82f6] bg-transparent"
                                  : "hover:!border-[#3b82f6]/50"
                              }`}
                              onClick={() => setIntervieweeType("EMPLOYEE")}
                            >
                              <CardContent className="p-6 flex items-center gap-4">
                                <div className="rounded-full bg-blue-500/20 p-3">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-500"
                                  >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="font-medium">Employee</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Interviewing for an employee position
                                  </p>
                                </div>
                              </CardContent>
                            </Card>

                            <Card
                              className={`cursor-pointer transition-all ${
                                intervieweeType === "INVESTOR"
                                  ? "!border !border-[#3b82f6] !shadow-[0_0_2px_#3b82f6,0_0_4px_#3b82f6] bg-transparent"
                                  : "hover:!border-[#3b82f6]/50"
                              }`}
                              onClick={() => setIntervieweeType("INVESTOR")}
                            >
                              <CardContent className="p-6 flex items-center gap-4">
                                <div className="rounded-full bg-blue-500/20 p-3">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-500"
                                  >
                                    <line x1="12" y1="1" x2="12" y2="23" />
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                  </svg>
                                </div>
                                <div>
                                  <h3 className="font-medium">Investor</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Interviewing a potential investor
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        <Card className="space-y-6 !bg-transparent p-6 rounded-lg">
                          <h2 className="text-xl font-semibold">
                            {intervieweeType === "EMPLOYEE"
                              ? "Employee Details"
                              : "Investor Details"}
                          </h2>

                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="job-title">
                                  {intervieweeType === "EMPLOYEE"
                                    ? "Job Title"
                                    : "Title"}
                                </Label>
                                <Input
                                  id="job-title"
                                  placeholder={
                                    intervieweeType === "EMPLOYEE"
                                      ? "e.g. Senior Developer"
                                      : "e.g. Angel Investor"
                                  }
                                  value={jobTitle}
                                  onChange={(e) => setJobTitle(e.target.value)}
                                />
                                {/* <FormField
                                  control={form.control}
                                  name="title"
                                  render={({ field }) => (
                                     <FormItem>
                                      <FormLabel>Job Title</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="e.g. Senior Frontend Developer"
                                          {...field}
                                          type="text"
                                          name="title"
                                          value={jobTitle}
                                          onChange={(e) =>
                                            setJobTitle(e.target.value)
                                          }
                                          required
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                /> */}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="related-field">
                                  Related Field
                                </Label>
                                <Select onValueChange={setRelatedField}>
                                  <SelectTrigger id="related-field">
                                    <SelectValue placeholder="Select field" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="technology">
                                      Technology
                                    </SelectItem>
                                    <SelectItem value="finance">
                                      Finance
                                    </SelectItem>
                                    <SelectItem value="healthcare">
                                      Healthcare
                                    </SelectItem>
                                    <SelectItem value="education">
                                      Education
                                    </SelectItem>
                                    <SelectItem value="marketing">
                                      Marketing
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="description">Description</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    setIsPromptModalOpen(true);
                                  }}
                                  className="flex items-center gap-1 !text-blue-500 !border-blue-500/50 hover:!bg-blue-500/20 hover:!text-blue-400"
                                >
                                  <Sparkles className="h-4 w-4" />
                                  <span>Generate with AI</span>
                                </Button>
                              </div>
                              <FormControl>
                                <QuillEditor
                                  editorId={"jobDescription"}
                                  placeholder="Job Description here..."
                                  onChange={handleOnChange}
                                  value={jobDescription}
                                />
                              </FormControl>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="proficiency">
                                Proficiency Level
                              </Label>
                              <Select onValueChange={setProficiencyLevel}>
                                <SelectTrigger id="proficiency">
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="BEGINNER">
                                    Beginner
                                  </SelectItem>
                                  <SelectItem value="INTERMEDIATE">
                                    Intermediate
                                  </SelectItem>
                                  <SelectItem value="ADVANCED">
                                    Advanced
                                  </SelectItem>
                                  {/* <SelectItem value="expert">Expert</SelectItem> */}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <FormItem>
                                <Label htmlFor="skills">Skills</Label>
                                <SkillsInput
                                  skills={skills}
                                  onChange={setSkills}
                                  intervieweeType={intervieweeType}
                                />
                              </FormItem>
                            </div>
                          </div>
                        </Card>

                        {/* <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Senior Frontend Developer"
                                  {...field}
                                  type="text"
                                  name="title"
                                  value={jobTitle}
                                  onChange={(e) => setJobTitle(e.target.value)}
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        /> */}

                        {/* <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="space-y-4">
                              <FormLabel>Job Description</FormLabel>

                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                  Generate description with AI or write your own
                                </p>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="What are the primary objectives for this position?"
                                    name="prompt"
                                    onChange={(e) => {
                                      setDescriptionPrompt(e.target.value);
                                    }}
                                    className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#000000] placeholder-[#737883] px-6 py-2 mb-5 "
                                  />
                                  <button
                                    onClick={generateDescription}
                                    type="button"
                                    className="bg-white text-black h-[45px] rounded-lg text-sm w-32 flex align-middle items-center justify-center text-center"
                                  >
                                    <Sparkles />
                                    <span className="font-bold ml-2">
                                      Generate
                                    </span>
                                  </button>
                                </div>
                              </div>

                              <FormControl>
                                <QuillEditor
                                  editorId={"jobDescription"}
                                  placeholder="Job Description here..."
                                  onChange={handleOnChange}
                                  value={jobDescription} //change this line to store the jobdescription when user go step forward and come back
                                />
                              </FormControl> 
                              <FormMessage />
                            </FormItem>
                          )}
                        /> */}

                        {/* <FormItem>
                          <FormLabel>Required Skills</FormLabel>
                          <SkillsInput skills={skills} onChange={setSkills} />
                        </FormItem> */}
                      </CardContent>

                      <CardFooter className="flex justify-end mt-6 !p-0">
                        <Button
                          type="submit"
                          onClick={() => setActiveTab("categories")}
                          disabled={
                            !jobTitle || !jobDescription || skills.length === 0
                          }
                          className={
                            !jobTitle || !jobDescription || skills.length === 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        >
                          Continue to Categories
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="categories" className="space-y-6">
                    <div className="space-y-8">
                      {/* Percentage Allocation */}
                      <div className="space-y-4">
                        <h2 className="text-xl font-semibold">
                          Assessment Weighting
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          Adjust the percentage allocation between technical
                          expertise and soft skills assessment. The total must
                          equal 100%.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card
                          className={`overflow-hidden border-2 transition-all ${
                            technicalPercentage >= 50
                              ? "!border-blue-500 !shadow-[0_0_2px_#3b82f6,0_0_4px_#3b82f6]"
                              : "border-muted"
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="rounded-full bg-blue-500/20 p-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-blue-500"
                                >
                                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
                                  <path d="M17.92 12.62A5 5 0 0 0 15 8.5" />
                                  <path d="M5.5 12.55a5 5 0 0 1 8.34 5.24" />
                                  <path d="M14.5 9.5 20 8l-1.5 5.5" />
                                  <path d="m4 15 1.5-5.5L11 11" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium">
                                  Technical Expertise
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Field-related knowledge and skills
                                </p>
                              </div>
                            </div>

                            <div className="space-y-6">
                              {/* Prominent percentage indicator */}
                              <div className="flex justify-center">
                                <div className="relative w-32 h-32">
                                  <svg
                                    className="w-full h-full"
                                    viewBox="0 0 100 100"
                                  >
                                    {/* Background circle */}
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="45"
                                      fill="none"
                                      stroke="hsl(var(--muted))"
                                      strokeWidth="10"
                                    />
                                    {/* Progress circle */}
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="45"
                                      fill="none"
                                      stroke="hsl(var(--blue-500, 217 91.2% 59.8%))"
                                      strokeWidth="10"
                                      strokeDasharray={`${
                                        (2 *
                                          Math.PI *
                                          45 *
                                          technicalPercentage) /
                                        100
                                      } ${
                                        2 *
                                        Math.PI *
                                        45 *
                                        (1 - technicalPercentage / 100)
                                      }`}
                                      strokeDashoffset={2 * Math.PI * 45 * 0.25}
                                      transform="rotate(-90 50 50)"
                                      strokeLinecap="round"
                                      className="text-blue-500"
                                      style={{ stroke: "#3b82f6" }}
                                    />
                                    {/* Percentage text */}
                                    <text
                                      x="50"
                                      y="50"
                                      dominantBaseline="middle"
                                      textAnchor="middle"
                                      fontSize="24"
                                      fontWeight="bold"
                                      fill="currentColor"
                                      className="text-blue-500"
                                      style={{ fill: "#3b82f6" }}
                                    >
                                      {technicalPercentage}%
                                    </text>
                                  </svg>
                                </div>
                              </div>

                              {/* Less prominent slider */}
                              <div className="space-y-2">
                                <p className="text-sm text-center text-muted-foreground mb-2">
                                  Adjust percentage
                                </p>
                                <Slider
                                  id="technical-percentage"
                                  min={0}
                                  max={100}
                                  step={5}
                                  enableColor={false}
                                  value={[technicalPercentage]}
                                  onValueChange={
                                    handleTechnicalPercentageChange
                                  }
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card
                          className={`overflow-hidden border-2 transition-all ${
                            softSkillsPercentage >= 50
                              ? "!border-blue-500 !shadow-[0_0_2px_#3b82f6,0_0_4px_#3b82f6]"
                              : "border-muted"
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="rounded-full bg-blue-500/20 p-3">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-blue-500"
                                >
                                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                  <circle cx="9" cy="7" r="4" />
                                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium">
                                  Soft Skills
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Human qualities and attributes
                                </p>
                              </div>
                            </div>

                            <div className="space-y-6">
                              {/* Prominent percentage indicator */}
                              <div className="flex justify-center">
                                <div className="relative w-32 h-32">
                                  <svg
                                    className="w-full h-full"
                                    viewBox="0 0 100 100"
                                  >
                                    {/* Background circle */}
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="45"
                                      fill="none"
                                      stroke="hsl(var(--muted))"
                                      strokeWidth="10"
                                    />
                                    {/* Progress circle */}
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="45"
                                      fill="none"
                                      stroke="hsl(var(--blue-500, 217 91.2% 59.8%))"
                                      strokeWidth="10"
                                      strokeDasharray={`${
                                        (2 *
                                          Math.PI *
                                          45 *
                                          softSkillsPercentage) /
                                        100
                                      } ${
                                        2 *
                                        Math.PI *
                                        45 *
                                        (1 - softSkillsPercentage / 100)
                                      }`}
                                      strokeDashoffset={2 * Math.PI * 45 * 0.25}
                                      transform="rotate(-90 50 50)"
                                      strokeLinecap="round"
                                      className="text-blue-500"
                                      style={{ stroke: "#3b82f6" }}
                                    />
                                    {/* Percentage text */}
                                    <text
                                      x="50"
                                      y="50"
                                      dominantBaseline="middle"
                                      textAnchor="middle"
                                      fontSize="24"
                                      fontWeight="bold"
                                      fill="currentColor"
                                      className="text-blue-500"
                                      style={{ fill: "#3b82f6" }}
                                    >
                                      {softSkillsPercentage}%
                                    </text>
                                  </svg>
                                </div>
                              </div>

                              {/* Less prominent slider */}
                              <div className="space-y-2">
                                <p className="text-sm text-center text-muted-foreground mb-2">
                                  Adjust percentage
                                </p>
                                <Slider
                                  id="soft-skills-percentage"
                                  min={0}
                                  max={100}
                                  step={5}
                                  value={[softSkillsPercentage]}
                                  onValueChange={
                                    handleSoftSkillsPercentageChange
                                  }
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>




                    {hasAutomated && (
                      <div className="space-y-6">
                        <div>
                          <span className="text-xl font-semibold">
                            Select how many questions you want to ask from the candidate: {totalAutomatedQuestions}
                          </span>
                          <Slider
                            id="automated-questions"
                            min={0}
                            max={10}
                            step={1}
                            value={[totalAutomatedQuestions]}
                            onValueChange={handleAutomatedQuestionsChange}
                            className="w-1/2 my-[20px] mx-auto"
                          />
                        </div>

                        <div className="flex gap-6 justify-center">
                          {/* Technical Questions Card */}
                          <div className="border rounded-lg p-6 w-1/2">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold">Technical Questions</h3>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">5</span>
                                <Button
                                  type="button"  // Add this
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();  // Also add this for extra safety

                                  }}

                                >
                                  +
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              Questions assessing technical knowledge and skills
                            </p>
                          </div>

                          {/* Soft Skills Card */}
                          <div className="border rounded-lg p-6 w-1/2">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold">Soft Skills Questions</h3>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"  // Add this
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();  // Also add this for extra safety
                                  }}

                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">4</span>
                                <Button
                                  type="button"  // Add this
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();  // Also add this for extra safety
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              Questions assessing communication and interpersonal skills
                            </p>
                          </div>
                        </div>
                      </div>
                    )}




                    {!hasAutomated && (                    
                    <div>
                    {/* Technical Expertise (Cat 1) */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                          Technical Expertise
                        </h2>
                        <Badge className="!bg-blue-500/20 !text-blue-600 px-4 py-1 border !border-blue-600">
                          {technicalPercentage}%
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="use-questionnaire"
                          checked={useQuestionnaire}
                          onCheckedChange={setUseQuestionnaire}
                        />
                        <Label htmlFor="use-questionnaire">
                          Do you need to use an AI-based or a manual
                          questionnaire to assess candidates&apos; technical
                          expertise?
                        </Label>
                      </div>

                      {useQuestionnaire ? (
                        // <div className="space-y-4">
                        //   <div className="flex items-center justify-between">
                        //     <h3 className="text-lg font-medium">Questions</h3>
                        //     <div className="flex space-x-2">
                        //       <Button
                        //         variant="outline"
                        //         size="sm"
                        //         onClick={() => setIsQuestionPromptOpen(true)}
                        //         className="flex items-center gap-1 text-blue-500 border-blue-500/50 hover:bg-blue-500/10"
                        //       >
                        //         <Sparkles className="h-4 w-4" />
                        //         <span>Generate with AI</span>
                        //       </Button>
                        //       <Button
                        //         variant="outline"
                        //         size="sm"
                        //         onClick={() => setNewQuestion("What is your experience with...")}
                        //         className="flex items-center gap-1"
                        //       >
                        //         <Plus className="h-4 w-4" />
                        //         <span>Add Question</span>
                        //       </Button>
                        //     </div>
                        //   </div>

                        // {newQuestion && (
                        //   <div className="space-y-2 p-4 border rounded-md bg-card">
                        //     <Label htmlFor="new-question">New Question</Label>
                        //     <Textarea
                        //       id="new-question"
                        //       value={newQuestion}
                        //       onChange={(e) => setNewQuestion(e.target.value)}
                        //       placeholder="Enter your question here"
                        //       className="min-h-[80px]"
                        //     />
                        //     <div className="flex justify-end space-x-2 mt-2">
                        //       <Button variant="outline" onClick={() => setNewQuestion("")}>
                        //         Cancel
                        //       </Button>
                        //       <Button onClick={handleAddQuestion} className="bg-blue-600 hover:bg-blue-700">
                        //         Add Question
                        //       </Button>
                        //     </div>
                        //   </div>
                        // )}

                        // <div className="space-y-3">
                        //   {questions.map((question) => (
                        //     <Card key={question.id} className="overflow-hidden">
                        //       <CardContent className="p-4">
                        //         {editingQuestion === question.id ? (
                        //           <div className="space-y-3">
                        //             <Textarea
                        //               value={question.text}
                        //               onChange={(e) => handleEditQuestion(question.id, e.target.value, question.marks)}
                        //               className="min-h-[80px]"
                        //             />
                        //             <div className="flex items-center space-x-2">
                        //               <Label htmlFor={`marks-${question.id}`}>Marks:</Label>
                        //               <Input
                        //                 id={`marks-${question.id}`}
                        //                 type="number"
                        //                 value={question.marks}
                        //                 onChange={(e) =>
                        //                   handleEditQuestion(question.id, question.text, Number.parseInt(e.target.value) || 0)
                        //                 }
                        //                 className="w-20"
                        //               />
                        //             </div>
                        //             <div className="flex justify-end space-x-2">
                        //               <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                        //                 Cancel
                        //               </Button>
                        //               <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setEditingQuestion(null)}>
                        //                 Save
                        //               </Button>
                        //             </div>
                        //           </div>
                        //         ) : (
                        //           <div className="flex justify-between items-start">
                        //             <div>
                        //               <p>{question.text}</p>
                        //               <Badge variant="outline" className="mt-2">
                        //                 {question.marks} marks
                        //               </Badge>
                        //             </div>
                        //             <div className="flex space-x-1">
                        //               <Button
                        //                 variant="ghost"
                        //                 size="icon"
                        //                 onClick={() => setEditingQuestion(question.id)}
                        //                 className="h-8 w-8"
                        //               >
                        //                 <Edit className="h-4 w-4" />
                        //                 <span className="sr-only">Edit</span>
                        //               </Button>
                        //               <Button
                        //                 variant="ghost"
                        //                 size="icon"
                        //                 onClick={() => handleDeleteQuestion(question.id)}
                        //                 className="h-8 w-8 text-destructive hover:text-destructive/90"
                        //               >
                        //                 <Trash2 className="h-4 w-4" />
                        //                 <span className="sr-only">Delete</span>
                        //               </Button>
                        //             </div>
                        //           </div>
                        //         )}
                        //       </CardContent>
                        //     </Card>
                        //   ))}

                        // {questions.length === 0 && (
                        //   <div className="text-center p-4 border border-dashed rounded-md">
                        //     <p className="text-muted-foreground">No questions added yet. Add questions or generate with AI.</p>
                        //   </div>
                        // )}
                        // </div>
                        // </div>
                        <Alert>
                          <AlertCircleIcon className="h-4 w-4" />
                          <AlertTitle>Flexible Assessment</AlertTitle>
                          <AlertDescription>
                            You can generate technical test questions once the
                            interview session has been created.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert>
                          <AlertCircleIcon className="h-4 w-4" />
                          <AlertTitle>Manual Assessment</AlertTitle>
                          <AlertDescription>
                            You&apos;ve chosen to assess technical expertise
                            manually during the interview. Prepare your own
                            questions and evaluation criteria based on the
                            candidate&apos;s field.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Soft Skills</h2>
                        <Badge className="!bg-blue-500/20 !text-blue-600 px-4 py-1 border !border-blue-600">
                          {softSkillsPercentage}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">
                          Qualities to Assess
                        </h3>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGenerateSoftSkills}
                            className="flex items-center gap-1  text-blue-500 !border-blue-500/50 hover:!text-blue-400 hover:!bg-blue-500/20"
                          >
                            {softSkillsLoading ? (
                              <LoaderCircle className="animate-spin" />
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4 text-blue-500" />
                                <span>Generate with AI</span>
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddingSoftSkill(true)}
                            className="flex items-center gap-1"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Quality</span>
                          </Button>
                        </div>
                      </div>
                      {isAddingSoftSkill && (
                        <Card className="overflow-hidden border border-blue-500/20">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">Add New Quality</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setIsAddingSoftSkill(false);
                                  setNewSoftSkill({
                                    name: "",
                                    description: "",
                                    percentage: 20,
                                    subcategories: [],
                                  });
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor="new-skill-name">
                                  Quality Name
                                </Label>
                                <Input
                                  id="new-skill-name"
                                  value={newSoftSkill.name}
                                  onChange={(e) =>
                                    setNewSoftSkill({
                                      ...newSoftSkill,
                                      name: e.target.value,
                                    })
                                  }
                                  placeholder="e.g. Critical Thinking"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="new-skill-description">
                                  Description
                                </Label>
                                <Textarea
                                  id="new-skill-description"
                                  value={newSoftSkill.description}
                                  onChange={(e) =>
                                    setNewSoftSkill({
                                      ...newSoftSkill,
                                      description: e.target.value,
                                    })
                                  }
                                  placeholder="Describe what you're looking for in this quality"
                                  className="min-h-[80px]"
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="new-skill-percentage">
                                    Weight
                                  </Label>
                                  <Badge className="!bg-blue-500/20 !text-blue-600 px-4 py-1 border !border-blue-600">
                                    {newSoftSkill.percentage}%
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setNewSoftSkill({
                                        ...newSoftSkill,
                                        percentage: Math.max(
                                          5,
                                          newSoftSkill.percentage - 5
                                        ),
                                      })
                                    }
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                    disabled={newSoftSkill.percentage <= 5}
                                  >
                                    <span className="sr-only">Decrease</span>-
                                  </Button>
                                  <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-blue-500 h-full rounded-full"
                                      style={{
                                        width: `${newSoftSkill.percentage}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setNewSoftSkill({
                                        ...newSoftSkill,
                                        percentage: Math.min(
                                          95,
                                          newSoftSkill.percentage + 5
                                        ),
                                      })
                                    }
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                    disabled={newSoftSkill.percentage >= 95}
                                  >
                                    <span className="sr-only">Increase</span>+
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Other qualities will be adjusted automatically
                                  to maintain 100% total
                                </p>
                              </div>

                              <div className="flex justify-end space-x-2 mt-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setIsAddingSoftSkill(false);
                                    setNewSoftSkill({
                                      name: "",
                                      description: "",
                                      percentage: 20,
                                      subcategories: [],
                                    });
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  onClick={handleAddSoftSkill}
                                  className="bg-blue-600 hover:bg-blue-700"
                                  disabled={
                                    !newSoftSkill.name.trim() ||
                                    !newSoftSkill.description.trim()
                                  }
                                >
                                  Add Quality
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Soft skills list */}
                      <div className="space-y-3">
                        {softSkills.map((skill) => (
                          <Card key={skill.id} className="overflow-hidden">
                            <CardContent className="p-4">
                              {editingSoftSkill === skill.id ? (
                                <div className="space-y-3">
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-name-${skill.id}`}>
                                      Quality Name
                                    </Label>
                                    <Input
                                      id={`edit-name-${skill.id}`}
                                      value={skill.name}
                                      onChange={(e) =>
                                        handleEditSoftSkill(
                                          skill.id,
                                          e.target.value,
                                          skill.description
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`edit-desc-${skill.id}`}>
                                      Description
                                    </Label>
                                    <Textarea
                                      id={`edit-desc-${skill.id}`}
                                      value={skill.description}
                                      onChange={(e) =>
                                        handleEditSoftSkill(
                                          skill.id,
                                          skill.name,
                                          e.target.value
                                        )
                                      }
                                      className="min-h-[80px]"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label
                                        htmlFor={`edit-percentage-${skill.id}`}
                                      >
                                        Percentage of Soft Skills
                                      </Label>
                                      <Badge
                                        variant="outline"
                                        className="!bg-blue-500/20 !text-blue-600 px-4 py-1 border !border-blue-600"
                                      >
                                        {Math.round(skill.percentage)}%
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleSoftSkillPercentageChange(
                                            skill.id,
                                            Math.max(5, skill.percentage - 5)
                                          )
                                        }
                                        className="h-8 w-8 p-0"
                                        disabled={skill.percentage <= 5}
                                      >
                                        -
                                      </Button>
                                      <Input
                                        id={`edit-percentage-${skill.id}`}
                                        type="number"
                                        min="5"
                                        max="95"
                                        value={Math.round(skill.percentage)}
                                        onChange={() =>
                                          handleSoftSkillPercentageChange(
                                            skill.id,
                                            Math.min(
                                              95,
                                              Math.max(
                                                5,
                                                Number.parseInt(
                                                  e.target.value
                                                ) || 5
                                              )
                                            )
                                          )
                                        }
                                        className="w-16 text-center"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) =>
                                          handleSoftSkillPercentageChange(
                                            skill.id,
                                            Math.min(95, skill.percentage + 5)
                                          )
                                        }
                                        className="h-8 w-8 p-0"
                                        disabled={skill.percentage >= 95}
                                      >
                                        +
                                      </Button>
                                    </div>
                                    <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                      <div
                                        className="bg-blue-500/40 h-full rounded-full"
                                        style={{
                                          width: `${skill.percentage}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => setEditingSoftSkill(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      className="bg-blue-600 hover:bg-blue-700"
                                      onClick={() => setEditingSoftSkill(null)}
                                    >
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center">
                                        <h4 className="font-medium">
                                          {skill.name}
                                        </h4>
                                        <Badge
                                          variant="outline"
                                          className="ml-2 !bg-blue-500/20 !text-blue-600 px-2 py-[1px] border !border-blue-600 !text-[12px]"
                                        >
                                          {Math.round(skill.percentage)}%
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {skill.description}
                                      </p>

                                      {/* Add percentage slider for each skill */}
                                      <div className="mt-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-muted-foreground">
                                            Weight:
                                          </span>
                                          <div className="flex items-center gap-1">
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                handleSoftSkillPercentageChange(
                                                  skill.id,
                                                  Math.max(
                                                    5,
                                                    skill.percentage - 5
                                                  )
                                                )
                                              }
                                              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                              disabled={skill.percentage <= 5}
                                            >
                                              <span className="sr-only">
                                                Decrease
                                              </span>
                                              -
                                            </Button>
                                            <span className="text-xs font-medium w-8 text-center">
                                              {Math.round(skill.percentage)}%
                                            </span>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                handleSoftSkillPercentageChange(
                                                  skill.id,
                                                  Math.min(
                                                    95,
                                                    skill.percentage + 5
                                                  )
                                                )
                                              }
                                              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                              disabled={skill.percentage >= 95}
                                            >
                                              <span className="sr-only">
                                                Increase
                                              </span>
                                              +
                                            </Button>
                                          </div>
                                        </div>
                                        <div className="w-full bg-muted/90 h-1 mt-1 rounded-full overflow-hidden">
                                          <div
                                            className="bg-white/50 h-full rounded-full"
                                            style={{
                                              width: `${skill.percentage}%`,
                                            }}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex space-x-1 ml-4">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleToggleExpand(skill.id)
                                        }
                                        className="h-8 w-8"
                                      >
                                        {skill.expanded ? (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-4 w-4"
                                          >
                                            <path d="m18 15-6-6-6 6" />
                                          </svg>
                                        ) : (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-4 w-4"
                                          >
                                            <path d="m6 9 6 6 6-6" />
                                          </svg>
                                        )}
                                        <span className="sr-only">
                                          {skill.expanded
                                            ? "Collapse"
                                            : "Expand"}
                                        </span>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          setEditingSoftSkill(skill.id)
                                        }
                                        className="h-8 w-8"
                                      >
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleDeleteSoftSkill(skill.id)
                                        }
                                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    </div>
                                  </div>

                                  {skill.expanded && (
                                    <div className="mt-4 space-y-4 border-gray-500/40 border-t pt-4">
                                      <div className="flex items-center justify-between">
                                        <h5 className="text-sm font-medium">
                                          Subcategories
                                        </h5>
                                        {/* <div className="flex space-x-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              setCurrentSkillForSubcategories(
                                                skill.id
                                              );
                                              setIsSubcategoryPromptOpen(true);
                                            }}
                                            className="flex items-center gap-1  text-blue-500 !border-blue-500/50 hover:!text-blue-400 hover:!bg-blue-500/20 text-xs h-7"
                                          >
                                            <Sparkles className="h-3 w-3" />
                                            <span>Generate with AI</span>
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              setNewSubcategory({
                                                skillId: skill.id,
                                                name: "",
                                                description: "",
                                                percentage: 25,
                                              });
                                              setIsAddingSubcategory(true);
                                            }}
                                            className="flex items-center gap-1 text-xs h-7"
                                          >
                                            <Plus className="h-3 w-3" />
                                            <span>Add Subcategory</span>
                                          </Button>
                                        </div> */}
                                      </div>

                                      {/* New subcategory input */}
                                      {isAddingSubcategory &&
                                        newSubcategory.skillId === skill.id && (
                                          <div className="space-y-3 p-3 border border-gray-500/40 rounded-md bg-muted/20">
                                            <div className="space-y-2">
                                              <Label htmlFor="new-subcategory-name">
                                                Name
                                              </Label>
                                              <Input
                                                id="new-subcategory-name"
                                                value={newSubcategory.name}
                                                onChange={(e) =>
                                                  setNewSubcategory({
                                                    ...newSubcategory,
                                                    name: e.target.value,
                                                  })
                                                }
                                                placeholder="e.g. Active Listening"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label htmlFor="new-subcategory-description">
                                                Description
                                              </Label>
                                              <Textarea
                                                id="new-subcategory-description"
                                                value={
                                                  newSubcategory.description
                                                }
                                                onChange={(e) =>
                                                  setNewSubcategory({
                                                    ...newSubcategory,
                                                    description: e.target.value,
                                                  })
                                                }
                                                placeholder="Describe this subcategory"
                                                className="min-h-[60px]"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <div className="flex items-center justify-between">
                                                <Label htmlFor="new-subcategory-percentage">
                                                  Percentage
                                                </Label>
                                                <Badge
                                                  variant="outline"
                                                  className="!bg-blue-500/20 !text-blue-600 px-2 py-[1px] border !border-blue-600 !text-[12px]"
                                                >
                                                  {newSubcategory.percentage}%
                                                </Badge>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                    setNewSubcategory({
                                                      ...newSubcategory,
                                                      percentage: Math.max(
                                                        1,
                                                        newSubcategory.percentage -
                                                          5
                                                      ),
                                                    })
                                                  }
                                                  className="h-8 w-8 p-0"
                                                >
                                                  -
                                                </Button>
                                                <Input
                                                  id="new-subcategory-percentage"
                                                  type="number"
                                                  min="1"
                                                  max="100"
                                                  value={
                                                    newSubcategory.percentage
                                                  }
                                                  onChange={(e) =>
                                                    setNewSubcategory({
                                                      ...newSubcategory,
                                                      percentage: Math.min(
                                                        100,
                                                        Math.max(
                                                          1,
                                                          Number.parseInt(
                                                            e.target.value
                                                          ) || 1
                                                        )
                                                      ),
                                                    })
                                                  }
                                                  className="text-center"
                                                />
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                    setNewSubcategory({
                                                      ...newSubcategory,
                                                      percentage: Math.min(
                                                        100,
                                                        newSubcategory.percentage +
                                                          5
                                                      ),
                                                    })
                                                  }
                                                  className="h-8 w-8 p-0"
                                                >
                                                  +
                                                </Button>
                                              </div>
                                              <p className="text-xs text-muted-foreground">
                                                Other subcategories will be
                                                adjusted automatically to
                                                maintain 100% total
                                              </p>
                                            </div>
                                            <div className="flex justify-end space-x-2 mt-2">
                                              <Button
                                                variant="outline"
                                                onClick={() => {
                                                  setNewSubcategory({
                                                    skillId: null,
                                                    name: "",
                                                    description: "",
                                                    percentage: 25,
                                                  });
                                                  setIsAddingSubcategory(false);
                                                }}
                                              >
                                                Cancel
                                              </Button>
                                              <Button
                                                onClick={handleAddSubcategory}
                                                className="bg-blue-600 hover:bg-blue-700"
                                                disabled={
                                                  !newSubcategory.name.trim() ||
                                                  !newSubcategory.description.trim()
                                                }
                                              >
                                                Add Subcategory
                                              </Button>
                                            </div>
                                          </div>
                                        )}

                                      {/* Subcategories list */}
                                      <div className="space-y-2">
                                        {skill.subcategories.map(
                                          (subcategory, index) => (
                                            <div
                                              key={index}
                                              className="border border-gray-500/40 rounded-md p-3 bg-muted/10"
                                            >
                                              {editingSubcategory &&
                                              editingSubcategory.skillId ===
                                                skill.id &&
                                              editingSubcategory.subcategoryId ===
                                                subcategory.id ? (
                                                <div className="space-y-3">
                                                  <div className="space-y-2">
                                                    <Label
                                                      htmlFor={`edit-sub-name-${subcategory.id}`}
                                                    >
                                                      Name
                                                    </Label>
                                                    <Input
                                                      id={`edit-sub-name-${subcategory.id}`}
                                                      value={subcategory.name}
                                                      onChange={(e) =>
                                                        handleEditSubcategory(
                                                          skill.id,
                                                          subcategory.id,
                                                          e.target.value,
                                                          subcategory.description,
                                                          subcategory.percentage
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                  <div className="space-y-2">
                                                    <Label
                                                      htmlFor={`edit-sub-desc-${subcategory.id}`}
                                                    >
                                                      Description
                                                    </Label>
                                                    <Textarea
                                                      id={`edit-sub-desc-${subcategory.id}`}
                                                      value={
                                                        subcategory.description
                                                      }
                                                      onChange={(e) =>
                                                        handleEditSubcategory(
                                                          skill.id,
                                                          subcategory.id,
                                                          subcategory.name,
                                                          e.target.value,
                                                          subcategory.percentage
                                                        )
                                                      }
                                                      className="min-h-[60px]"
                                                    />
                                                  </div>
                                                  <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                      <Label
                                                        htmlFor={`edit-sub-percentage-${subcategory.id}`}
                                                      >
                                                        Percentage
                                                      </Label>
                                                      <Badge
                                                        variant="outline"
                                                        className="!bg-blue-500/20 !text-blue-600 px-2 py-[1px] border !border-blue-600 !text-[12px]"
                                                      >
                                                        {subcategory.percentage}
                                                        %
                                                      </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                      <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          handleEditSubcategory(
                                                            skill.id,
                                                            subcategory.id,
                                                            subcategory.name,
                                                            subcategory.description,
                                                            Math.max(
                                                              1,
                                                              subcategory.percentage -
                                                                5
                                                            )
                                                          );
                                                        }}
                                                        className="h-8 w-8 p-0"
                                                      >
                                                        -
                                                      </Button>
                                                      <Input
                                                        id={`edit-sub-percentage-${subcategory.id}`}
                                                        type="number"
                                                        min="1"
                                                        max="100"
                                                        value={
                                                          subcategory.percentage
                                                        }
                                                        onChange={(e) => {
                                                          e.preventDefault();
                                                          handleEditSubcategory(
                                                            skill.id,
                                                            subcategory.id,
                                                            subcategory.name,
                                                            subcategory.description,
                                                            Math.min(
                                                              100,
                                                              Math.max(
                                                                1,
                                                                Number.parseInt(
                                                                  e.target.value
                                                                ) || 1
                                                              )
                                                            )
                                                          );
                                                        }}
                                                        className="text-center"
                                                      />
                                                      <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) =>
                                                          handleEditSubcategory(
                                                            skill.id,
                                                            subcategory.id,
                                                            subcategory.name,
                                                            subcategory.description,
                                                            Math.min(
                                                              100,
                                                              subcategory.percentage +
                                                                5
                                                            )
                                                          )
                                                        }
                                                        className="h-8 w-8 p-0"
                                                      >
                                                        +
                                                      </Button>
                                                    </div>
                                                  </div>
                                                  <div className="flex justify-end space-x-2">
                                                    <Button
                                                      variant="outline"
                                                      onClick={() =>
                                                        setEditingSubcategory(
                                                          null
                                                        )
                                                      }
                                                    >
                                                      Cancel
                                                    </Button>
                                                    <Button
                                                      className="bg-blue-600 hover:bg-blue-700"
                                                      onClick={() =>
                                                        setEditingSubcategory(
                                                          null
                                                        )
                                                      }
                                                    >
                                                      Save
                                                    </Button>
                                                  </div>
                                                </div>
                                              ) : (
                                                <div>
                                                  <div className="flex justify-between items-start">
                                                    <div>
                                                      <div className="flex items-center">
                                                        <h6 className="font-medium text-sm">
                                                          {subcategory.name}
                                                        </h6>
                                                        <Badge
                                                          variant="outline"
                                                          className="ml-2 !bg-blue-500/20 !text-blue-600 px-2 py-[1px] border !border-blue-600 !text-[12px]"
                                                        >
                                                          {
                                                            subcategory.percentage
                                                          }
                                                          %
                                                        </Badge>
                                                      </div>
                                                      <p className="text-xs text-muted-foreground mt-1">
                                                        {
                                                          subcategory.description
                                                        }
                                                      </p>
                                                    </div>
                                                    {/* <div className="flex space-x-1">
                                                      <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          setEditingSubcategory(
                                                            {
                                                              skillId: skill.id,
                                                              subcategoryId:
                                                                subcategory.id,
                                                            }
                                                          );
                                                        }}
                                                        className="h-7 w-7"
                                                      >
                                                        <Edit className="h-3.5 w-3.5" />
                                                        <span className="sr-only">
                                                          Edit
                                                        </span>
                                                      </Button>
                                                      <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                          handleDeleteSubcategory(
                                                            skill.id,
                                                            subcategory.id
                                                          )
                                                        }
                                                        className="h-7 w-7 text-destructive hover:text-destructive/90"
                                                      >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        <span className="sr-only">
                                                          Delete
                                                        </span>
                                                      </Button>
                                                    </div> */}
                                                  </div>

                                                  {/* Display percentage as a progress bar */}
                                                  <div className="mt-2">
                                                    <div className="w-full bg-muted/90 h-1 rounded-full overflow-hidden">
                                                      <div
                                                        className="bg-gray-500/80 h-full rounded-full"
                                                        style={{
                                                          width: `${subcategory.percentage}%`,
                                                        }}
                                                      ></div>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          )
                                        )}

                                        {skill.subcategories.length === 0 && (
                                          <div className="text-center p-3 border border-dashed rounded-md">
                                            <p className="text-sm text-muted-foreground">
                                              No subcategories added yet
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}

                        {softSkills.length === 0 && (
                          <div className="text-center p-4 border border-dashed rounded-md">
                            <p className="text-muted-foreground">
                              No soft skills added yet. Add qualities or
                              generate with AI.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">AI Analysis</h2>
                        <Button
                          type="button"
                          onClick={handleGenerateAISuggestioins}
                          className="flex items-center gap-1 !bg-transparent !text-blue-500 border !border-blue-500/50 hover:!bg-blue-500/20 hover:!text-blue-400"
                          disabled={showAnalysis}
                        >
                          {suggestionsLoading ? (
                            <LoaderCircle className="animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 text-blue-500" />
                              <span>Analyze & Suggest Improvements</span>
                            </>
                          )}
                        </Button>
                      </div>

                      {showAnalysis && (
                        <Card className="border !border-blue-500/50 !bg-transparent">
                          <CardContent className="p-6 space-y-4">
                            <div className="flex items-center space-x-2">
                              <Sparkles className="h-5 w-5 text-blue-500" />
                              <h3 className="text-lg font-medium">
                                AI Suggestions
                              </h3>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium">
                                  Recommended Weighting
                                </h4>
                                <div className="flex items-center mt-2 space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant="outline"
                                      className="!text-blue-500 !font-bold"
                                    >
                                      Technical:{" "}
                                      {
                                        aiSuggestions.summary
                                          .recommended_weighting
                                          .technical_expertise
                                      }
                                      %
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {aiSuggestions.summary
                                        .recommended_weighting
                                        .technical_expertise >
                                      technicalPercentage
                                        ? "+"
                                        : ""}
                                      {aiSuggestions.summary
                                        .recommended_weighting
                                        .technical_expertise -
                                        technicalPercentage}
                                      %
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant="outline"
                                      className="!text-blue-500 !font-bold"
                                    >
                                      Soft Skills:{" "}
                                      {
                                        aiSuggestions.summary
                                          .recommended_weighting.soft_skills
                                      }
                                      %
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      {aiSuggestions.summary
                                        .recommended_weighting.soft_skills >
                                      softSkillsPercentage
                                        ? "+"
                                        : ""}
                                      {aiSuggestions.summary
                                        .recommended_weighting.soft_skills -
                                        softSkillsPercentage}
                                      %
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* {aiSuggestions.addedQuestions.length > 0 && (
                                <div>
                                  <h4 className="font-medium">
                                    Suggested Questions to Add
                                  </h4>
                                  <ul className="mt-2 space-y-2">
                                    {aiSuggestions.addedQuestions.map(
                                      (q, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start space-x-2"
                                        >
                                          <Plus className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                          <div>
                                            <p>{q.text}</p>
                                            <Badge
                                              variant="outline"
                                              className="mt-1"
                                            >
                                              {q.marks} marks
                                            </Badge>
                                          </div>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )} */}

                              {aiSuggestions.suggested_soft_skills.length >
                                0 && (
                                <div>
                                  <h4 className="font-medium">
                                    Suggested Soft Skills to Add
                                  </h4>
                                  <ul className="mt-2 space-y-2">
                                    {aiSuggestions.suggested_soft_skills.map(
                                      (s, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start space-x-2"
                                        >
                                          <Plus className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                          <div>
                                            <p className="font-medium">
                                              {s.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              {s.description}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              {s.percentage}%
                                            </p>
                                          </div>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}

                              <div className="flex justify-end space-x-3 pt-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setShowAnalysis(false)}
                                >
                                  Ignore Suggestions
                                </Button>
                                <Button
                                  type="button"
                                  onClick={handleAcceptSuggestions}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Apply Suggestions
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    </div>
                    )}
                    <Card className="!bg-transparent border-0 px-0">
                      {/* <CardHeader>
                        <CardTitle>Interview Categories</CardTitle>
                        <CardDescription>
                          Technical Skills category is mandatory. Add more
                          categories to evaluate candidates on. Total percentage
                          must equal 100%.
                        </CardDescription>
                      </CardHeader> */}
                      {/* <CardContent className="space-y-6">
                        <div className="bg-[#26282d] border-l-4 border-primary p-4 rounded-md mb-6 shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-base font-medium flex items-center gap-2">
                              <Badge
                                variant="default"
                                className="bg-primary text-primary-foreground"
                              >
                                Mandatory
                              </Badge>
                              <span>Technical Skills</span>
                            </h3>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-full">
                              <div className="flex items-center gap-2">
                                <Input
                                  required
                                  type="number"
                                  min={0}
                                  max={100}
                                  placeholder="e.g. 30"
                                  value={technicalPercentage}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const numValue =
                                      value === "" ? 0 : parseInt(value, 10);
                                    handleTechnicalPercentageValueChange(
                                      numValue
                                    );
                                  }}
                                  className="w-full"
                                />
                                <Percent className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium">
                              Add Predefined Category
                            </h3>
                            <div className="space-y-4">
                              <div className="flex w-full justify-center md:flex-col flex-col  md:space-y-4 space-y-4 items-center">
                                <div className="w-full">
                                  <label className="text-sm font-medium text-white">
                                    Category
                                  </label>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        className={`!bg-[black] h-10 m-0 px-2 focus:outline-none outline-none w-full`}
                                        variant="outline"
                                      >
                                        {interviewCategories.find(
                                          (cat) =>
                                            cat.categoryId === inputCatagory
                                        )?.categoryName || "Select Category"}
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                      <DropdownMenuLabel>
                                        Interview Catagory
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuRadioGroup
                                        value={inputCatagory}
                                        onValueChange={setInputCatagory}
                                      >
                                        {filteredCategories.map((category) => (
                                          <DropdownMenuRadioItem
                                            key={category.categoryId}
                                            value={category.categoryId}
                                          >
                                            {category.categoryName}
                                          </DropdownMenuRadioItem>
                                        ))}
                                      </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                                <div className="w-full">
                                  <label className="text-sm font-medium text-white">
                                    Percentage
                                  </label>
                                  <input
                                    value={inputPercentage}
                                    onChange={(e) =>
                                      setInputPercentage(e.target.value)
                                    }
                                    placeholder="Percentage"
                                    type="number"
                                    className="h-10 w-full rounded-lg text-sm border-0 bg-black placeholder-[#737883]  text-center"
                                  />
                                </div>
                              </div>
                              {/* 
                              {selectedPredefinedCategory && (
                                <>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min={0}
                                        value={predefinedCategoryPercentage}
                                        onChange={(e) => setPredefinedCategoryPercentage(parseInt(e.target.value) || 0)}
                                        className="w-full"
                                      />
                                      <Percent className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  </div>

                                  <div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {COLORS.map((color, i) => (
                                        <div
                                          key={i}
                                          className={`w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform ${color === selectedColor ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                                          style={{ backgroundColor: color }}
                                          onClick={() => setSelectedColor(color)}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}

                              <Button
                                type="button"
                                onClick={handleAddCatagoty}
                                className="w-full !mt-14"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Category
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-sm font-medium">
                              Add Custom Category
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-white">
                                  Category Name
                                </label>
                                <Input
                                  type="text"
                                  onChange={(e) =>
                                    setInterviewCatName(e.target.value)
                                  }
                                  value={interviewCatName}
                                  placeholder="e.g. Team Collaboration"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-white">
                                  Category Description
                                </label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="text"
                                    placeholder="Category Description..."
                                    onChange={(e) =>
                                      setInterviewCateDesc(e.target.value)
                                    } // Storing input value
                                    value={interviewCatDesc} // Binding input to state
                                  />
                                </div>
                              </div>

                              <div>
                                {/* <FormLabel className="flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                Color
                              </FormLabel>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {COLORS.map((color, i) => (
                                    <div
                                      key={i}
                                      className={`w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform ${
                                        color === newCategoryColor
                                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                          : ""
                                      }`}
                                      style={{ backgroundColor: color }}
                                      onClick={() => setNewCategoryColor(color)} // Update the selected color
                                    />
                                  ))}
                                </div>
                              </div>

                              <Button
                                type="button"
                                onClick={handleCategorySubmit}
                                className="w-full"
                                disabled={
                                  !interviewCatName || !interviewCatDesc
                                } // Disable button if input is empty
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Custom Category
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium">
                              Your Categories
                            </h3>
                            {categoryList.length === 0 ? (
                              <p className="text-sm text-muted-foreground">
                                No categories added yet
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {categoryList.map((catagory) => (
                                  <div
                                    key={catagory.key}
                                    className="flex items-center justify-between p-3 rounded-md bg-[#313338]"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                          backgroundColor: catagory.color,
                                        }}
                                      ></div>
                                      <span>{catagory.catagory}</span>
                                      {catagory.id === "technical" && (
                                        <Badge
                                          variant="outline"
                                          className="bg-primary/10 text-primary ml-1"
                                        >
                                          Mandatory
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Badge variant="outline">
                                        {catagory.percentage}%
                                      </Badge>
                               
                                      <button
                                        onClick={() =>
                                          removeCategory(catagory.key)
                                        }
                                        className="text-red-800 hover:text-red-500 transition"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                <div className="text-sm mt-2">
                                  Total:{" "}
                                  {categoryList.reduce(
                                    (sum, cat) =>
                                      sum + parseFloat(cat.percentage),
                                    0
                                  )}
                                  %
                                  {categoryList.reduce(
                                    (sum, cat) =>
                                      sum + parseFloat(cat.percentage),
                                    0
                                  ) !== 100 && (
                                    <span className="text-destructive">
                                      {" "}
                                      (should be 100%)
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {categoryList.length > 0 && (
                            <div className="flex items-center justify-center">
                              <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                  <Pie
                                    data={categoryList}
                                    dataKey="percentage"
                                    nameKey="catagory"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    innerRadius={40}
                                    label={({ name, percent }) =>
                                      `${name}: ${(percent * 100).toFixed(0)}%`
                                    }
                                  >
                                    {categoryList.map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={
                                          entry.color ||
                                          COLORS[index % COLORS.length]
                                        }
                                      />
                                    ))}
                                  </Pie>
                                  <Legend />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          )}
                        </div>
                      </CardContent> */}
                      <CardFooter className="flex justify-between px-0">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setActiveTab("details")}
                        >
                          Previous
                        </Button>
                        <Button
                          type="submit"
                          onClick={() => setActiveTab("schedules")}
                          disabled={
                            technicalPercentage <= 0
                            // categoryList.reduce(
                            //   (sum, cat) => sum + parseFloat(cat.percentage),
                            //   0
                            // ) !== 100
                          }
                          // className={
                          //   technicalPercentage <= 0
                          //   categoryList.reduce(
                          //     (sum, cat) => sum + parseFloat(cat.percentage),
                          //     0
                          //   ) !== 100
                          //     ? "opacity-50 cursor-not-allowed"
                          //     : ""
                          // }
                        >
                          Continue to Schedules
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="schedules" className="space-y-6">
                    <Card className=" !bg-transparent !border-0">
                      <CardHeader className="p-0">
                        <CardTitle>Interview Schedules</CardTitle>
                        <CardDescription>
                          Set up available time slots for this interview
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8 px-0 mt-5">
                        <div className="border border-gray-500/40 rounded-lg p-4 bg-muted/5">
                          <div className="mb-4">
                            <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                              <Sparkles className="h-5 w-5 text-primary" />
                              Generate Interview Schedules
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              *If you&apos;re unsure about the appropriate time
                              duration, we can assist you in selecting the most
                              suitable one based on your needs.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                {/* <FormLabel>Select Date</FormLabel> */}
                                <div className="mt-1">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full justify-start h-[45px] text-left font-normal",
                                          !date && "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon />
                                        {date?.from ? (
                                          date.to ? (
                                            <>
                                              {date.from.toLocaleDateString(
                                                "en-GB",
                                                {
                                                  day: "numeric",
                                                  month: "long",
                                                  year: "numeric",
                                                }
                                              )}{" "}
                                              -{" "}
                                              {date.to.toLocaleDateString(
                                                "en-GB",
                                                {
                                                  day: "numeric",
                                                  month: "long",
                                                  year: "numeric",
                                                }
                                              )}
                                            </>
                                          ) : (
                                            date.from.toLocaleDateString(
                                              "en-GB",
                                              {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                              }
                                            )
                                          )
                                        ) : (
                                          <span>Pick Date Range</span>
                                        )}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="range"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        numberOfMonths={2}
                                        disabled={(date) =>
                                          date < new Date().setHours(0, 0, 0, 0)
                                        }
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  {/* <FormLabel>Start Time</FormLabel> */}
                                  <div className="relative mt-1">
                                    <Input
                                      type="time"
                                      value={slotStartTime}
                                      onChange={(e) =>
                                        setSlotStartTime(e.target.value)
                                      }
                                      className="pl-9"
                                    />
                                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  </div>
                                </div>
                                <div>
                                  {/* <FormLabel>End Time</FormLabel> */}
                                  <div className="relative mt-1">
                                    <Input
                                      type="time"
                                      value={slotEndTime}
                                      onChange={(e) =>
                                        setSlotEndTime(e.target.value)
                                      }
                                      className="pl-9"
                                    />
                                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  </div>
                                </div>
                              </div>

                              <div>
                                {/* <FormLabel>Interview Duration</FormLabel> */}
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                  {DURATION_PRESETS.map((preset) => (
                                    <Button
                                      key={preset.id}
                                      type="button"
                                      variant={"outline"}
                                      className={`cursor-pointer transition-all hover:!bg-blue-500/10 h-16 ${
                                        selectedDuration === preset.id
                                          ? "!border !border-[#3b82f6] !shadow-[0_0_2px_#3b82f6,0_0_4px_#3b82f6] bg-transparent"
                                          : "hover:!border-[#3b82f6]/50"
                                      }`}
                                      onClick={() =>
                                        setSelectedDuration(preset.id)
                                      }
                                    >
                                      <div className="flex flex-col items-start">
                                        <span className="font-medium">
                                          {preset.label}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {preset.description}
                                        </span>
                                      </div>
                                      {selectedDuration === preset.id && (
                                        <div className="flex items-center ml-auto bg-blue-500/20 p-3 text-blue-400 rounded-full">
                                          <Check className="h-4 w-4 ml-auto" />
                                        </div>
                                      )}
                                    </Button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h6>Time Interval Between Slots</h6>
                                <Select
                                  value={intervalMinutes.toString()}
                                  onValueChange={(value) =>
                                    setIntervalMinutes(parseInt(value))
                                  }
                                >
                                  <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Select interval" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {INTERVAL_PRESETS.map((interval) => (
                                      <SelectItem
                                        key={interval.value}
                                        value={interval.value.toString()}
                                      >
                                        {interval.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleScheduleGenerate}
                                className="flex items-center gap-1 w-full !text-blue-500 !border-blue-500/50 hover:!bg-blue-500/20 hover:!text-blue-400"
                              >
                                {isGeneratingSchedule ? (
                                  <LoaderCircle className="animate-spin" />
                                ) : (
                                  <>
                                    <Sparkles className="h-4 w-4" />
                                    Generate Time Slots
                                  </>
                                )}
                              </Button>
                            </div>

                            <div className="border-l border-gray-500/40 pl-6 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium flex items-center gap-2">
                                  <GanttChartSquare className="h-4 w-4" />
                                  Generated Time Slots
                                </h4>

                                {generatedSlots.length > 0 && (
                                  <div className="flex justify-center mr-5">
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={addAllGeneratedSlots}
                                      className="h-8 "
                                    >
                                      <SaveAll className="h-4 w-4 mr-1" />
                                      Add All
                                    </Button>
                                  </div>
                                )}
                              </div>

                              <div className="max-h-[380px] h-full overflow-y-auto space-y-2 pr-2">
                                {generatedSlots.length === 0 ? (
                                  <div className="text-center flex flex-col justify-center items-center h-full text-muted-foreground text-sm">
                                    <p>
                                      No time slots generated yet
                                      <br />
                                      Use the controls to generate slots
                                    </p>
                                  </div>
                                ) : (
                                  generatedSlots.map((slot, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-3 bg-muted/20 hover:bg-muted/30 rounded-md transition-colors"
                                    >
                                      <div className="flex items-center">
                                        <div className="flex flex-col">
                                          <span className="font-medium">
                                            {format(slot.date, "MMM dd, yyyy")}
                                          </span>
                                          <span className="text-sm text-muted-foreground">
                                            {slot.startTime} - {slot.endTime}
                                          </span>
                                        </div>
                                      </div>
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => addGeneratedSlot(slot)}
                                        className="h-8"
                                      >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add
                                      </Button>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-sm font-medium flex items-center gap-2">
                            <CalendarCheck className="h-4 w-4" />
                            Quick Setup
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              {/* <FormLabel>Date</FormLabel> */}
                              <div className="relative">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start !bg-[#0a0a0a] h-[40px] text-left font-normal pl-9",
                                        !dateRange && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="h-4 w-4 mr-2" />
                                      {dateRange ? (
                                        format(new Date(dateRange), "PPP") // e.g., "Mar 26, 2025"
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={
                                        dateRange
                                          ? new Date(dateRange)
                                          : undefined
                                      }
                                      onSelect={(selectedDate) => {
                                        if (selectedDate) {
                                          setDateRange(
                                            format(selectedDate, "yyyy-MM-dd")
                                          );
                                        } else {
                                          setDateRange(""); // Clear the date if the user deselects
                                        }
                                      }}
                                      initialFocus
                                      disabled={(date) =>
                                        date < new Date().setHours(0, 0, 0, 0)
                                      } // Disable past dates
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                            <div>
                              {/* <FormLabel>Interview Duration (mins)</FormLabel> */}
                              <Input
                                type="number"
                                placeholder="Duration in minutes"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                min="15"
                                step="15"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                {/* <FormLabel>Start Time</FormLabel> */}
                                <Input
                                  type="time"
                                  value={startTime}
                                  onChange={(e) => setStartTime(e.target.value)}
                                />
                              </div>
                              <div>
                                {/* <FormLabel>End Time</FormLabel> */}
                                <Input
                                  type="time"
                                  value={endTime}
                                  onChange={(e) => setEndTime(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="md:col-span-3 flex justify-end">
                              <Button
                                type="button"
                                onClick={addSchedule}
                                className="flex items-center"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add to Schedule
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-sm font-medium flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <span> Your Schedules</span>
                          </h3>
                          {schedules.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No schedules added yet
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {schedules.map((sch, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-secondary/20 rounded-md"
                                >
                                  <div className="grid grid-cols-3 gap-4 flex-1">
                                    <div className="flex items-center gap-2">
                                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                      <span>{sch.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span>{sch.startTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span>{sch.endTime}</span>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSchedule(sch.id)}
                                    className="ml-2 h-6 w-6 p-0 text-destructive"
                                    type="button"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Remove</span>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between px-0">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setActiveTab("categories")}
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          type="submit"
                          disabled={schedules.length === 0}
                          className={
                            schedules.length === 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        >
                          Create Interview
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </form>
              </Form>
            </Tabs>
          </main>
        </div>
      </SidebarInset>
      <Dialog open={isPromptModalOpen} onOpenChange={setIsPromptModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Description with AI</DialogTitle>
            <DialogDescription>
              Enter a prompt to guide the AI in generating a description.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ai-prompt">Prompt</Label>
              <Textarea
                id="ai-prompt"
                placeholder="e.g. Write a detailed description for a senior developer role with 5+ years of experience in React and Node.js"
                value={descriptionPrompt}
                onChange={(e) => {
                  setDescriptionPrompt(e.target.value);
                }}
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPromptModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={generateDescription}
              disabled={!descriptionPrompt.trim()}
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Generate"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Soft Skills Generation Modal */}
      <Dialog
        open={isSoftSkillPromptOpen}
        onOpenChange={setIsSoftSkillPromptOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Soft Skills with AI</DialogTitle>
            <DialogDescription>
              Enter details about the role and industry to generate relevant
              soft skills to assess.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="soft-skill-prompt">Prompt</Label>
              <Textarea
                id="soft-skill-prompt"
                placeholder="e.g. Generate 4 key soft skills to assess for a product manager in a fast-paced tech startup"
                value={softSkillPrompt}
                onChange={(e) => setSoftSkillPrompt(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSoftSkillPromptOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              // onClick={handleGenerateSoftSkills}
              disabled={!softSkillPrompt.trim()}
            >
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subcategory Generation Modal */}
      <Dialog
        open={isSubcategoryPromptOpen}
        onOpenChange={setIsSubcategoryPromptOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Subcategories with AI</DialogTitle>
            <DialogDescription>
              Enter details to generate relevant subcategories for this soft
              skill.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subcategory-prompt">Prompt</Label>
              <Textarea
                id="subcategory-prompt"
                placeholder="e.g. Generate 3 subcategories for assessing communication skills in a technical interview"
                value={subcategoryPrompt}
                onChange={(e) => setSubcategoryPrompt(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsSubcategoryPromptOpen(false);
                setCurrentSkillForSubcategories(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              // onClick={handleGenerateSubcategories}
              disabled={!subcategoryPrompt.trim()}
            >
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateInterview;
