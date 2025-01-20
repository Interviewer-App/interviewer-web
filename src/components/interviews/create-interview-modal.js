import * as React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import TagFacesIcon from "@mui/icons-material/TagFaces";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { MdClose } from "react-icons/md";
import { createInterview } from "@/lib/api/interview";
import { getSession } from "next-auth/react";

// import { format } from "date-fns";
import { CalendarIcon, Percent } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoCloseCircle } from "react-icons/io5";

// MUI Stepper
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import CategorySharpIcon from "@mui/icons-material/CategorySharp";
import AvTimerSharpIcon from "@mui/icons-material/AvTimerSharp";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { getInterviewCategoryCompanyById } from "@/lib/api/interview-category";
import Editor from "../rich-text/editor";

const QontoStepIconRoot = styled("div")(({ theme }) => ({
  color: "#eaeaf0",
  display: "flex",
  height: 12,
  alignItems: "center",
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  ...theme.applyStyles("dark", {
    color: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        color: "#784af4",
      },
    },
  ],
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(120,93,251) 0%, rgb(120,93,251) 50%, rgb(101,170,166) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(120,93,251) 0%, rgb(120,93,251) 50%, rgb(101,170,166) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#3d3d3e",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme }) => ({
  backgroundColor: "#3d3d3e",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(120,93,251) 0%, rgb(120,93,251) 50%, rgb(101,170,166) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(120,93,251) 0%, rgb(120,93,251) 50%, rgb(101,170,166) 100%)",
      },
    },
  ],
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <AvTimerSharpIcon />,
    3: <CategorySharpIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = ["Interview Details", "Schedules", "Categories"];

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function CreateInterviewModal({ setModalOpen }) {
  const [chipData, setChipData] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [jobDescription, setJobDescription] = React.useState("Description..");
  const [interviewCategory, setInterviewCategory] = React.useState("Technical");
  const [interviewCategories, setInterviewCategories] = React.useState([]);
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [stepperCount, setStepperCount] = React.useState(0);
  const [inputCatagory, setInputCatagory] = React.useState("");
  const [inputPercentage, setInputPercentage] = React.useState("");
  const [categoryList, setCatagoryList] = React.useState([]);
  const [inputScheduleDate, setInputScheduleDate] = React.useState(new Date());
  const [inputScheduleStartTime, setInputScheduleStartTime] = React.useState(
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const [inputScheduleEndTime, setInputScheduleEndTime] = React.useState(
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  const [scheduleList, setScheduleList] = React.useState([]);
  const [totalPercentage, setTotalPercentage] = React.useState(100);
  const [addButtonDisable, setAddButtonDisable] = React.useState(false);
  const [filteredCategories, setFilteredCategories] = React.useState([]);

  const { toast } = useToast();

  React.useEffect(() => {
    console.log("date", inputScheduleStartTime);
  }, [inputScheduleStartTime]);

  React.useEffect(() => {
    const fetchInterviewCategories = async () => {
      try {
        const session = await getSession();
        const companyId = session?.user?.companyID;
        const response = await getInterviewCategoryCompanyById(companyId);
        if (response) {
          setInterviewCategories(response.data.categories);
          setFilteredCategories(response.data.categories);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      setChipData((prevChips) => [
        ...prevChips,
        { key: chipData.length, label: inputValue.trim() },
      ]);
      setInputValue("");
    }
  };

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  const handleAddCatagoty = (e) => {
    e.preventDefault();
    setTotalPercentage(totalPercentage - parseFloat(inputPercentage));

    if (
      inputCatagory.trim() !== "" &&
      inputPercentage.trim() !== "" &&
      totalPercentage > 0
    ) {
      setCatagoryList((prev) => [
        ...prev,
        {
          key: inputCatagory.trim(),
          catagory: interviewCategories.find(
            (cat) => cat.categoryId === inputCatagory.trim()
          )?.categoryName,
          percentage: inputPercentage.trim(),
        },
      ]);
      setInputPercentage("");
      setInputCatagory("");
    }
  };

  const handleDeleteCategory = (catagoryToDelete) => () => {
    setTotalPercentage(
      totalPercentage + parseFloat(catagoryToDelete.percentage)
    );
    setCatagoryList((catagory) =>
      catagory.filter((catagory) => catagory.key !== catagoryToDelete.key)
    );
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();

    if (
      !inputScheduleDate ||
      !inputScheduleStartTime ||
      !inputScheduleEndTime
    ) {
      alert("All fields are required.");
      return;
    }

    const newStart = convertToMinutes(inputScheduleStartTime);
    const newEnd = convertToMinutes(inputScheduleEndTime);
    if (newStart >= newEnd) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Start time must be earlier than end time.`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    const hasConflict = scheduleList.some((schedule) => {
      const existingStart = convertToMinutes(schedule.startTime);
      const existingEnd = convertToMinutes(schedule.endTime);

      return (
        schedule.date === inputScheduleDate &&
        newStart < existingEnd &&
        newEnd > existingStart
      );
    });

    if (hasConflict) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `The schedule conflicts with an existing time slot.`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }
    setScheduleList((prev) => [
      ...prev,
      {
        key: scheduleList.length,
        date: inputScheduleDate,
        startTime: inputScheduleStartTime,
        endTime: inputScheduleEndTime,
      },
    ]);
    setInputScheduleDate("");
    setInputScheduleStartTime("");
    setInputScheduleEndTime("");
  };

  const convertToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleDeleteSchedule = (scheduleToDelete) => () => {
    setScheduleList((schedule) =>
      schedule.filter((schedule) => schedule.key !== scheduleToDelete.key)
    );
  };

  React.useEffect(() => {
    const filter = interviewCategories.filter((category) =>
      categoryList.every((item) => item.key !== category.categoryId)
    );
    setFilteredCategories(filter);
  }, [categoryList, inputCatagory, inputPercentage]);

  const handleAddCatagoryDesable = (e) => {
    let newInputPercentage = e.target.value;
    let remender = totalPercentage - newInputPercentage;
    setInputPercentage(newInputPercentage);
    if (remender < 0) {
      setAddButtonDisable(true);
    } else {
      setAddButtonDisable(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const session = await getSession();
      const companyId = session?.user?.companyID;
      const interviewData = {
        companyID: companyId,
        jobTitle,
        jobDescription,
        interviewCategory,
        requiredSkills: chipData.map((chip) => chip.label).join(", "),
        startDate: new Date(date.from).toISOString(),
        endDate: new Date(date.to).toISOString(),
        status: "DRAFT",
        categoryAssignments: categoryList.map((catagory) => {
          return {
            categoryId: catagory.key,
            percentage: parseFloat(catagory.percentage),
          };
        }),
        schedules: scheduleList.map((schedule) => {
          const date = new Date(schedule.date);

          const [startHours, startMinutes] = schedule.startTime
            .split(":")
            .map(Number);
          date.setUTCHours(startHours, startMinutes, 0, 0); 
          const startIsoString = date.toISOString(); 


          const [endHours, endMinutes] = schedule.endTime
            .split(":")
            .map(Number);
          date.setUTCHours(endHours, endMinutes, 0, 0); 
          const endIsoString = date.toISOString(); 

          return {
            startTime: startIsoString,
            endTime: endIsoString,
          };
        }),
      };
      console.log(interviewData);
      const response = await createInterview(interviewData);

      if (response) {
        setModalOpen(false);
      }
    } catch (err) {
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

  return (
    <div className=" fixed  top-0 left-0 z-50 h-full w-full flex items-center justify-center bg-black/50">
      <div className=" relative max-w-[700px] h-fit w-[90%] md:w-[50%] p-9 bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg">
        <h1 className=" text-2xl font-semibold text-[#f3f3f3] pb-5">
          Create interview
        </h1>
        <Stack sx={{ width: "100%" }} spacing={4}>
          <Stepper
            alternativeLabel
            activeStep={stepperCount}
            connector={<ColorlibConnector />}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  <span className=" text-gray-600">{label}</span>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
        <button
          onClick={() => setModalOpen(false)}
          className=" absolute top-5 right-5 text-[#f3f3f3]"
        >
          <MdClose className=" text-2xl" />
        </button>
        <form>
          {stepperCount === 0 && (
            <div className=" w-full mt-5">
              <input
                type="text"
                placeholder="Job Title"
                name="title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-5"
              />
              <div className="mb-8 rich-text text-white">
              <Editor
                content={jobDescription}
                onChange={setJobDescription}
                placeholder="Write your post"
                readOnly={false}
                required
                className=" w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-3 rich-text" />

              </div>
             
              <Paper
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  flexWrap: "wrap",
                  listStyle: "none",
                  p: 0.5,
                  m: 0,
                  backgroundColor: "#32353b",
                  color: "white",
                }}
                component="ul"
              >
                {chipData.map((data) => {
                  let icon;

                  if (data.label === "React") {
                    icon = <TagFacesIcon />;
                  }

                  return (
                    <ListItem key={data.key}>
                      <Chip
                        icon={icon}
                        label={data.label}
                        onDelete={handleDelete(data)}
                        sx={{ backgroundColor: "#2d2f36", color: "white" }}
                      />
                    </ListItem>
                  );
                })}
                <input
                  type="text"
                  placeholder="Add Skills"
                  name="skills"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className=" h-[45px] rounded-lg text-sm border-0 bg-transparent placeholder-[#737883] px-6 py-2 mb-5 focus:outline-none"
                />
              </Paper>

              <div className=" w-full mt-5">
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
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
          {stepperCount === 1 && (
            <div className=" w-full mt-5 min-h-[350px]">
              <div className="  overflow-y-auto h-[300px]">
                <table className=" w-full">
                  <thead className=" bg-gray-700/20 text-center rounded-lg text-sm">
                    <tr>
                      <td className=" p-3 w-[30%]">Date</td>
                      <td className=" p-3 w-[30%]">Start Time</td>
                      <td className=" p-3 w-[30%]">End Time</td>
                      <td className=" p-3 w-[10%]"></td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className=" w-[30%]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start !bg-[#32353b] h-[45px] text-left font-normal",
                                !inputScheduleDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              {inputScheduleDate
                                ? inputScheduleDate.toLocaleDateString()
                                : "Scheduled Date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={inputScheduleDate}
                              onSelect={setInputScheduleDate}
                              initialFocus
                              disabled={(date) =>
                                date < new Date().setHours(0, 0, 0, 0)
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      </td>
                      <td className=" w-[30%] p-1">
                        <input
                          type="time"
                          placeholder="Start Time"
                          name="start_time"
                          value={inputScheduleStartTime}
                          onChange={(e) =>
                            setInputScheduleStartTime(e.target.value)
                          }
                          required
                          className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mt-3 md:mt-0"
                        />
                      </td>
                      <td className=" w-[30%]">
                        <input
                          type="time"
                          placeholder="End Time"
                          name="end_time"
                          value={inputScheduleEndTime}
                          onChange={(e) =>
                            setInputScheduleEndTime(e.target.value)
                          }
                          required
                          className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mt-3 md:mt-0"
                        />
                      </td>
                      <td className=" w-[10%]">
                        <button
                          onClick={handleAddSchedule}
                          className=" h-[45px] aspect-square text-black bg-white hover:border-gray-500 rounded-lg text-3xl flex items-center justify-center ml-2"
                        >
                          +
                        </button>
                      </td>
                    </tr>
                    {scheduleList.map((schedule) => (
                      <tr key={schedule.key} className=" bg-gray-800/10">
                        <td className=" py-3 px-4 w-[30%] text-center">
                          {new Date(schedule.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </td>
                        <td className=" p-3 w-[30%] text-center">
                          {schedule.startTime}
                        </td>
                        <td className=" p-3 w-[30%] text-center">
                          {schedule.endTime}
                        </td>
                        <td className=" p-3 w-[10%] text-center">
                          <IoCloseCircle
                            onClick={handleDeleteSchedule(schedule)}
                            className=" text-gray-500 text-2xl cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {stepperCount === 2 && (
            <div className=" w-full mt-5 min-h-[350px]">
              <p className={` text-red-500 text-xs py-2 ${totalPercentage !== 0 ? "block" : "hidden"}`}>
                *Please ensure the total percentage equals 100%. The sum of all
                category percentages should not exceed or fall below 100%.
                Adjust your inputs accordingly.
              </p>

              <div className=" flex w-full justify-between space-x-2 ">
                <div className="w-[40%]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className={`!bg-[#32353b] w-full h-[45px] m-0 px-2 focus:outline-none outline-none`}
                        variant="outline"
                      >
                        {interviewCategories.find(
                          (cat) => cat.categoryId === inputCatagory
                        )?.categoryName || "Select Category"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Interview Catagory</DropdownMenuLabel>
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
                <div className="w-[40%]">
                  <input
                    value={inputPercentage}
                    onChange={handleAddCatagoryDesable}
                    placeholder="Percentage"
                    type="number"
                    className="h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-5"
                  />
                </div>
                <div className="w-[20%]">
                  {!addButtonDisable && (
                    <button
                      onClick={handleAddCatagoty}
                      className=" border-2 h-[45px] border-gray-500 text-gray-500 hover:text-gray-500 hover:border-gray-500 py-2 px-4 rounded-lg "
                    >
                      + add
                    </button>
                  )}
                </div>
              </div>
              <div className="  overflow-y-auto h-[300px]">
                <table className=" w-full">
                  <thead className=" bg-gray-700/20 text-center rounded-lg text-sm">
                    <tr>
                      <td className=" p-3 w-[40%]">Catagory</td>
                      <td className=" p-3 w-[40%]">Percentage</td>
                      <td className=" p-3 w-[20%]"></td>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryList.map((catagory) => (
                      <tr key={catagory.key} className=" bg-gray-800/10">
                        <td className=" py-3 px-4 w-[40%]">
                          {catagory.catagory}
                        </td>
                        <td className=" p-3 w-[40%] text-center">
                          {catagory.percentage}
                        </td>
                        <td className=" p-3 w-[20%] text-center">
                          <IoCloseCircle
                            onClick={handleDeleteCategory(catagory)}
                            className=" text-gray-500 text-2xl cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </form>
        <div className=" w-full flex md:flex-row justify-between items-center mt-1">
          {stepperCount > 0 ? (
            <button
              onClick={() => setStepperCount(stepperCount - 1)}
              className=" mt-2 md:mt-6 px-5 py-2 cursor-pointer border-2 border-gray-700 rounded-lg text-center text-sm text-gray-700 hover:text-gray-400 hover:border-gray-400 font-semibold"
            >
              Prev
            </button>
          ) : (
            <button></button>
          )}

          {stepperCount < 2 ? (
            <button
              onClick={() => setStepperCount(stepperCount + 1)}
              className={`  mt-6 px-5 py-2 cursor-pointer border-2 border-gray-700 rounded-lg text-center text-sm text-gray-700 hover:text-gray-400 hover:border-gray-400 font-semibold`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className={` ${
                totalPercentage === 0 ? "block" : "hidden"
              } mt-6 px-5 py-2 cursor-pointer bg-white rounded-lg text-center text-base text-black font-semibold`}
            >
              Create Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
