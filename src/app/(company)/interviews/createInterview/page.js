'use client'
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
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { format, addMinutes, parse, isBefore, isAfter, addDays } from "date-fns";
// import { Sidebar } from '@/components/layout/Sidebar';
// import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
// import RichTextEditor from '@/components/editors/RichTextEditor';
// import AIDescriptionGenerator from '@/components/generators/AIDescriptionGenerator';
// import SkillsInput from '@/components/inputs/SkillsInput';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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


import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast";
import { generateInterviewJobDescription } from "@/lib/api/ai";
import { getSession } from "next-auth/react";
import { createCategory, getInterviewCategoryCompanyById } from "@/lib/api/interview-category";
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
const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6', '#0EA5E9', '#8B5CF6'];


const DURATION_PRESETS = [
  { id: 'short', label: 'Short', value: 30, description: '30 min interview' },
  { id: 'standard', label: 'Standard', value: 60, description: '1 hour interview' },
  { id: 'extended', label: 'Extended', value: 90, description: '1.5 hour interview' },
  { id: 'comprehensive', label: 'Comprehensive', value: 120, description: '2 hour interview' },
];

const INTERVAL_PRESETS = [
  { value: 30, label: '30 min' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 240, label: '4 hours' },
];


const CreateInterview = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', percentage: 0 });
  const [schedules, setSchedules] = useState([]);
  const [dateRange, setDateRange] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [duration, setDuration] = useState('60');
  const [skills, setSkills] = useState([]);
  const [selectedPredefinedCategory, setSelectedPredefinedCategory] = useState('');
  const [predefinedCategoryPercentage, setPredefinedCategoryPercentage] = useState(20);
  const [technicalPercentage, setTechnicalPercentage] = useState(30);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [newCategoryColor, setNewCategoryColor] = useState(COLORS[1]);
  const [interviewCategory, setInterviewCategory] = React.useState("Technical");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotStartTime, setSlotStartTime] = useState('09:00');
  const [slotEndTime, setSlotEndTime] = useState('17:00');
  const [selectedDuration, setSelectedDuration] = useState(DURATION_PRESETS[1].id);
  const [intervalMinutes, setIntervalMinutes] = useState(60);
  const [generatedSlots, setGeneratedSlots] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast()
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
  const router = useRouter()

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

  const handleTechnicalPercentageChange = (value) => {
    setTechnicalPercentage(value);
    setCategories(categoryList.map(cat =>
      cat.id === 'technical'
        ? { ...cat, percentage: value }
        : cat
    ));
    setCategoryList((prev) =>
      prev.map((cat) =>
        cat.key === "technical" ? { ...cat, percentage: value } : cat
      )
    );
  };


  // const findPredefinedCategory = (name) => {
  //   return PREDEFINED_CATEGORIES.find(cat => cat.name === name);
  // };

  const resetPredefinedCategorySelection = () => {
    setSelectedPredefinedCategory('');
    setPredefinedCategoryPercentage(20);
    setSelectedColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  };

  const handleAddPredefinedCategory = () => {
    if (!selectedPredefinedCategory) return;

    const categoryToAdd = findPredefinedCategory(selectedPredefinedCategory);
    if (!categoryToAdd) return;

    if (categories.some(cat => cat.name === categoryToAdd.name)) {
      toast.error(`${categoryToAdd.name} already added`);
      return;
    }

    const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0);
    if (totalPercentage + predefinedCategoryPercentage > 100) {
      toast.error("Total percentage cannot exceed 100%");
      return;
    }

    const newCategoryObj = {
      id: Date.now().toString(),
      name: categoryToAdd.name,
      percentage: predefinedCategoryPercentage,
      color: selectedColor
    };

    setCategories([...categories, newCategoryObj]);
    resetPredefinedCategorySelection();
  };

  const addCategory = () => {
    if (!newCategory.name) {
      toast.error("Please enter a category name");
      return;
    }

    const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0);
    if (totalPercentage + newCategory.percentage > 100) {
      toast.error("Total percentage cannot exceed 100%");
      return;
    }

    const newCategoryObj = {
      id: Date.now().toString(),
      name: newCategory.name,
      percentage: newCategory.percentage,
      color: newCategoryColor
    };

    setCategories([...categories, newCategoryObj]);
    setNewCategory({ name: '', percentage: 0 });
    setNewCategoryColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  };

  const removeCategory = (key) => {
    if (key === technicalCategoryId) {
      toast.error("Technical Skills category is mandatory and cannot be removed");
      return;
    }
    setCategoryList(categoryList.filter(cat => cat.key !== key));
  };

  const generateTimeSlots = () => {
    if (!selectedDate || !slotStartTime || !slotEndTime) {
      toast.error("Please select date and time range");
      return;
    }

    const durationValue = DURATION_PRESETS.find(d => d.id === selectedDuration)?.value || 60;
    setDuration(durationValue.toString());

    const startDate = new Date(selectedDate);
    startDate.setHours(parseInt(slotStartTime.split(':')[0]), parseInt(slotStartTime.split(':')[1]), 0);

    const endDate = new Date(selectedDate);
    endDate.setHours(parseInt(slotEndTime.split(':')[0]), parseInt(slotEndTime.split(':')[1]), 0);

    if (isAfter(startDate, endDate)) {
      toast.error("Start time must be before end time");
      return;
    }

    const slots = [];
    let currentSlotStart = new Date(startDate);

    while (isBefore(currentSlotStart, endDate)) {
      const currentSlotEnd = addMinutes(new Date(currentSlotStart), durationValue);

      if (isAfter(currentSlotEnd, endDate)) {
        break;
      }

      slots.push({
        date: new Date(currentSlotStart),
        startTime: format(currentSlotStart, 'HH:mm'),
        endTime: format(currentSlotEnd, 'HH:mm')
      });

      currentSlotStart = addMinutes(currentSlotStart, intervalMinutes);
    }

    setGeneratedSlots(slots);

    if (slots.length > 0) {
      setDateRange(format(selectedDate, 'yyyy-MM-dd'));
    }
  };

  const addGeneratedSlot = (slot) => {
    const newSchedule = {
      id: Date.now().toString(),
      date: format(slot.date, 'yyyy-MM-dd'),
      startTime: slot.startTime,
      endTime: slot.endTime
    };

    setSchedules([...schedules, newSchedule]);
    toast({
      description: "Time slot added to schedule",
    })
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
    setSchedules(schedules.filter(sch => sch.id !== id));
  };

  const calculateEndTime = (start, durationMinutes) => {
    const [hours, minutes] = start.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes + durationMinutes;

    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;

    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  const addAllGeneratedSlots = () => {
    if (generatedSlots.length === 0) {
      toast.error("No time slots generated yet");
      return;
    }

    const newSchedules = generatedSlots.map(slot => ({
      id: Date.now() + Math.random().toString(),
      date: format(slot.date, 'yyyy-MM-dd'),
      startTime: slot.startTime,
      endTime: slot.endTime
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
        color: newCategoryColor
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
        description: "Please provide both the category name and percentage to add to the list.",
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
          catagory: interviewCategories.find(
            (cat) => cat.categoryId === inputCatagory.trim()
          )?.categoryName || "Unknown Category",
          percentage: newPercentage, // Store as a number, not a string
          color: interviewCategories.find(
            (cat) => cat.categoryId === inputCatagory.trim()
          )?.color || COLORS[prev.length % COLORS.length], // Default color if not found
        },
      ]);
      setInputPercentage("");
      setInputCatagory("");
    }
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
      const allStartTimes = schedules.map((sch) => new Date(`${sch.date}T${sch.startTime}:00`));
      const allEndTimes = schedules.map((sch) => new Date(`${sch.date}T${sch.endTime}:00`));
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
        categoryAssignments: categoryList.map((cat) => ({
          categoryId: cat.key,
          percentage: parseFloat(cat.percentage),
        })),
        schedules: schedules
          .filter((schedule) => !schedule.isBooked) // Exclude booked schedules, if applicable
          .map((schedule) => {
            const startDateObj = new Date(schedule.date);
            const [startHours, startMinutes] = schedule.startTime.split(":").map(Number);
            const localStart = new Date(startDateObj.setHours(startHours, startMinutes, 0, 0));

            const endDateObj = new Date(schedule.date);
            const [endHours, endMinutes] = schedule.endTime.split(":").map(Number);
            const localEnd = new Date(endDateObj.setHours(endHours, endMinutes, 0, 0));

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
      console.log('interview sucessfully create response:',response)

      if (response) {
        toast({
          title: "Interview Created Successfully!",
          description: "The interview has been successfully created.",
        })

        router.push("/interviews");
      }
    } catch (err) {

      if (err.response) {
        const { data } = err.response;
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Interview creation failed: ${data?.message || "An unexpected error occurred."}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "An unexpected error occurred. Please check your network and try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
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
          console.log('fectbhinbg categories::::;',response.data.categories)
          // Find the "Technical Skills" category and store its ID
          const technicalCategory = response.data.categories.find(
            (cat) => cat.categoryName== "Technical"
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
          <main className="container mx-auto py-8 px-4 max-w-5xl">
            <div className="flex items-center mb-6 ">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { router.back() }}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">Create New Interview</h1>
            </div>


            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="details" className="data-[state=active]:bg-primary/20">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    <span>Interview Details</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="categories" className="data-[state=active]:bg-primary/20">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Categories</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="schedules" disabled={categories.length === 0} className="data-[state=active]:bg-primary/20">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4" />
                    <span>Schedules</span>
                  </div>
                </TabsTrigger>
              </TabsList>


              <Form {...form}>
                <form className="space-y-6">
                  <TabsContent value="details" className="space-y-6">
                    <Card className='!bg-[#1b1d23]'>
                      <CardHeader>
                        <CardTitle>Interview Details</CardTitle>
                        <CardDescription>
                          Enter the basic details for this interview
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Senior Frontend Developer" {...field} type="text"
                                  name="title"
                                  value={jobTitle}
                                  onChange={(e) => setJobTitle(e.target.value)}
                                  required />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />


                        <FormField
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
                        />

                        <FormItem>
                          <FormLabel>Required Skills</FormLabel>
                          <SkillsInput skills={skills} onChange={setSkills} />
                        </FormItem>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button
                          type="submit"
                          onClick={() => setActiveTab("categories")}
                          disabled={!jobTitle || !jobDescription || skills.length === 0}
                          className={!jobTitle || !jobDescription || skills.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          Continue to Categories
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="categories" className="space-y-6">
                    <Card className='!bg-[#1b1d23]'>
                      <CardHeader>
                        <CardTitle>Interview Categories</CardTitle>
                        <CardDescription>
                          Technical Skills category is mandatory. Add more categories to evaluate candidates on. Total percentage must equal 100%.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="bg-[#26282d] border-l-4 border-primary p-4 rounded-md mb-6 shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-base font-medium flex items-center gap-2">
                              <Badge variant="default" className="bg-primary text-primary-foreground">Mandatory</Badge>
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
                                  onChange={(e) => handleTechnicalPercentageChange(parseInt(e.target.value))}
                                  className="w-full"
                                />
                                <Percent className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium">Add Predefined Category</h3>
                            <div className="space-y-4">
                              <div className="flex w-full justify-center md:flex-col flex-col  md:space-y-4 space-y-4 items-center">
                                <div className="w-full">
                                  <label className="text-sm font-medium text-white">Category</label>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        className={`!bg-[black] h-10 m-0 px-2 focus:outline-none outline-none w-full`}
                                        variant="outline"
                                      >
                                        {interviewCategories.find(
                                          (cat) => cat.categoryId === inputCatagory
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
                                  <label className="text-sm font-medium text-white">Percentage</label>
                                  <input
                                    value={inputPercentage}
                                    onChange={(e) => setInputPercentage(e.target.value)}
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
                              )} */}

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
                            <h3 className="text-sm font-medium">Add Custom Category</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-white">Category Name</label>
                                <Input
                                  type="text"
                                  onChange={(e) => setInterviewCatName(e.target.value)}
                                  value={interviewCatName}

                                  placeholder="e.g. Team Collaboration"

                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-white">Category Description</label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="text"
                                    placeholder="Category Description..."
                                    onChange={(e) => setInterviewCateDesc(e.target.value)} // Storing input value
                                    value={interviewCatDesc} // Binding input to state

                                  />

                                </div>
                              </div>

                              <div>
                                {/* <FormLabel className="flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                Color
                              </FormLabel> */}
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {COLORS.map((color, i) => (
                                    <div
                                      key={i}
                                      className={`w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform ${color === newCategoryColor ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
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
                                disabled={!interviewCatName || !interviewCatDesc} // Disable button if input is empty
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Custom Category
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <div className="space-y-3">
                            <h3 className="text-sm font-medium">Your Categories</h3>
                            {categoryList.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No categories added yet</p>
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
                                        style={{ backgroundColor: catagory.color }}
                                      ></div>
                                      <span>{catagory.catagory}</span>
                                      {catagory.id === 'technical' && (
                                        <Badge variant="outline" className="bg-primary/10 text-primary ml-1">
                                          Mandatory
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Badge variant="outline">{catagory.percentage}%</Badge>
                                      {/* Delete Button */}
                                      <button
                                        onClick={() => removeCategory(catagory.key)}
                                        className="text-red-800 hover:text-red-500 transition"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                <div className="text-sm mt-2">
                                  Total: {categoryList.reduce((sum, cat) => sum + parseFloat(cat.percentage), 0)}%
                                  {categoryList.reduce((sum, cat) => sum + parseFloat(cat.percentage), 0) !== 100 && (
                                    <span className="text-destructive"> (should be 100%)</span>
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
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {categoryList.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Legend />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
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
                            technicalPercentage <= 0 ||
                            categoryList.reduce((sum, cat) => sum + parseFloat(cat.percentage), 0) !== 100
                          }
                          className={
                            technicalPercentage <= 0 ||
                              categoryList.reduce((sum, cat) => sum + parseFloat(cat.percentage), 0) !== 100
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                        >
                          Continue to Schedules
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>


                  <TabsContent value="schedules" className="space-y-6">
                    <Card className='!bg-[#1b1d23]'>
                      <CardHeader>
                        <CardTitle>Interview Schedules</CardTitle>
                        <CardDescription>
                          Set up available time slots for this interview
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        <div className="border rounded-lg p-4 bg-muted/5">
                          <div className="mb-4">
                            <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                              <WandSparkles className="h-5 w-5 text-primary" />
                              Generate Interview Schedules
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              *If you&apos;re unsure about the appropriate time duration, we can assist you in selecting the most suitable one based on your needs.
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
                                          "w-full justify-start !bg-[#32353b] h-[45px] text-left font-normal",
                                          !date && "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon />
                                        {date?.from ? (
                                          date.to ? (
                                            <>
                                              {date.from.toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                              })}{" "}
                                              -{" "}
                                              {date.to.toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                              })}
                                            </>
                                          ) : (
                                            date.from.toLocaleDateString("en-GB", {
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                            })
                                          )
                                        ) : (
                                          <span>Pick Date Range</span>
                                        )}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
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
                                      onChange={(e) => setSlotStartTime(e.target.value)}
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
                                      onChange={(e) => setSlotEndTime(e.target.value)}
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
                                      variant={selectedDuration === preset.id ? "default" : "outline"}
                                      className={cn(
                                        "justify-start text-left h-auto py-2",
                                        selectedDuration === preset.id ? "border-primary" : ""
                                      )}
                                      onClick={() => setSelectedDuration(preset.id)}
                                    >
                                      <div className="flex flex-col items-start">
                                        <span className="font-medium">{preset.label}</span>
                                        <span className="text-xs text-muted-foreground">{preset.description}</span>
                                      </div>
                                      {selectedDuration === preset.id && (
                                        <Check className="h-4 w-4 ml-auto" />
                                      )}
                                    </Button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h6>Time Interval Between Slots</h6>
                                <Select
                                  value={intervalMinutes.toString()}
                                  onValueChange={(value) => setIntervalMinutes(parseInt(value))}
                                >
                                  <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Select interval" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {INTERVAL_PRESETS.map((interval) => (
                                      <SelectItem key={interval.value} value={interval.value.toString()}>
                                        {interval.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <Button
                                type="button"
                                onClick={generateTimeSlots}
                                className="w-full mt-2"
                              >
                                <WandSparkles className="h-4 w-4 mr-2" />
                                Generate Time Slots
                              </Button>
                            </div>

                            <div className="border-l pl-6 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium flex items-center gap-2">
                                  <GanttChartSquare className="h-4 w-4" />
                                  Generated Time Slots
                                </h4>

                                {generatedSlots.length > 0 && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={addAllGeneratedSlots}
                                    className="h-8"
                                  >
                                    <SaveAll className="h-4 w-4 mr-1" />
                                    Add All
                                  </Button>
                                )}
                              </div>

                              <div className="max-h-[280px] overflow-y-auto space-y-2 pr-2">
                                {generatedSlots.length === 0 ? (
                                  <div className="text-center py-8 text-muted-foreground text-sm">
                                    <p>No time slots generated yet</p>
                                    <p className="mt-2">Use the controls to generate slots</p>
                                  </div>
                                ) : (
                                  generatedSlots.map((slot, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-3 bg-muted/20 hover:bg-muted/30 rounded-md transition-colors"
                                    >
                                      <div className="flex items-center">
                                        <div className="flex flex-col">
                                          <span className="font-medium">{format(slot.date, 'MMM dd, yyyy')}</span>
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
                                <Input
                                  placeholder="Select date"
                                  value={dateRange}
                                  onChange={(e) => setDateRange(e.target.value)}
                                  className="pl-9"
                                />
                                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                          <h3 className="text-sm font-medium">Your Schedules</h3>
                          {schedules.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No schedules added yet</p>
                          ) : (
                            <div className="space-y-2">
                              {schedules.map((sch) => (
                                <div
                                  key={sch.id}
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
                      <CardFooter className="flex justify-between">
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
                          className={schedules.length === 0 ? "opacity-50 cursor-not-allowed" : ""}

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

    </>
  )
}

export default CreateInterview