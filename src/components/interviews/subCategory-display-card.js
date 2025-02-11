import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  deleteInterviewSubCategory,
  fetchInterviewSubCategory,
} from "@/lib/api/interview";
import CreateSubcategoryModal from "./create-subcategory-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MdDelete, MdEdit } from "react-icons/md";
import { Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function SubCategoryDisplayCard({ selectedSubAssignment }) {
  const [subcategories, setSubcategories] = useState([]);
  const [assignment, setAssignment] = useState({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [categoryChartData, setCategoryChartData] = useState({});
  const [deleteTrger, setDeleteTrger] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setAssignment(selectedSubAssignment);
  }, [selectedSubAssignment]);

  useEffect(() => {
    const fetchSubInterviewCategory = async () => {
      try {
        const response = await fetchInterviewSubCategory(
          assignment.assignmentId
        );
        if (response.data) {
          setSubcategories(response.data.subCategoryAssignments);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `Interview category fetching failed: ${data.message}`,
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

    if (assignment.assignmentId) fetchSubInterviewCategory();
  }, [assignment, createModalOpen, updateModalOpen, deleteTrger]);

  // Function to convert Hex to RGBA with opacity
  const hexToRgba = (hex, opacity = 0.2) => {
    // Remove the hash symbol if it exists
    hex = hex.replace("#", "");

    // Convert the hex string into RGB values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Return the RGBA format
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  useEffect(() => {
    // Calculate total percentage from subcategories
    const totalPercentage = subcategories.reduce(
      (acc, cat) => acc + parseFloat(cat.percentage),
      0
    );
    const remaining = 100 - totalPercentage;

    // Use actual colors from subcategories
    const backgroundColors = subcategories.map((cat) =>
      hexToRgba(cat.color, 0.2)
    );
    const borderColors = subcategories.map((cat) => hexToRgba(cat.color, 1));

    // Create dataset with remaining value
    const dataset = {
      labels: [...subcategories.map((cat) => cat.name)],
      datasets: [
        {
          label: "Percentage",
          data: [
            ...subcategories.map((cat) => parseFloat(cat.percentage)),
            remaining,
          ],
          backgroundColor: [
            ...backgroundColors,
            "rgba(192, 192, 192,0.05)", // Remaining background color
          ],
          borderColor: [
            ...borderColors,
            "rgba(192, 192, 192,0.2)", // Remaining border color
          ],
          borderWidth: 1,
        },
      ],
    };
    setCategoryChartData(dataset);
  }, [subcategories]);

  const handleDeleteSubCategory = async (subAssignmentId) => {
    try {
      const response = await deleteInterviewSubCategory(subAssignmentId);
      if (response) {
        toast({
          variant: "success",
          title: "Success!",
          description: "Subcategory deleted successfully",
        });
        setDeleteTrger(!deleteTrger);
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Interview category deleting failed: ${data.message}`,
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

  const handleUpdateSubCategory = (subAssignment) => {
    setSelectedAssignment(subAssignment);
    setUpdateModalOpen(true);
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  return (
    <div className=" mt-9">
      <div className="flex justify-between">
        {/* <div className=" bg-blue-700/10 w-[65%] text-blue-400 border-2 border-blue-700 px-8 py-5 rounded-lg"> */}
        <div
          className={`w-[65%] border-2  px-8 py-5 rounded-lg bg-opacity-10`}
          style={{
            backgroundColor: `${assignment.color}1A`,
            border: `2px solid ${assignment.color}`,
            color: assignment.color,
          }}
        >
          <span className=" text-2xl">{assignment.catagory}</span>
          <span className=" text-2xl float-right">
            {assignment.percentage}%
          </span>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className={` ${
            subcategories.length > 0 ? "block" : " hidden"
          } aspect-square h-11 flex justify-center items-center text-2xl text-black bg-white rounded-lg font-semibold`}
        >
          +
        </button>
      </div>
      <div className=" flex justify-between">
        <div className=" w-[65%] pl-10">
          {subcategories.length > 0 ? (
            subcategories.map((subAssignment) => (
              <div
                key={subAssignment.id}
                className=" bg-gray-700/10 flex justify-between gap-10 items-center text-gray-400 border-2 border-gray-700 px-5 py-3 rounded-lg mt-4"
              >
                <div className="">
                  <p className=" text-base text-gray-300">
                    {subAssignment.name}
                  </p>
                  <p className=" text-sm">{subAssignment.percentage}%</p>
                </div>
                <div className="flex gap-x-2 items-center">
                  {/* Color Circle */}
                  <div
                    className=" h-7 rounded-sm aspect-square"
                    style={{
                      backgroundColor: subAssignment.color,
                    }}
                  />
                  <button
                    onClick={() => handleUpdateSubCategory(subAssignment)}
                    className="text-gray-400 hover:text-gray-200 border-gray-400 hover:bg-gray-400/20 border-2  text-lg aspect-square h-7 rounded-sm flex items-center justify-center"
                  >
                    <MdEdit />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <div className="text-red-500 hover:text-red-400 border-red-500 border-2 hover:bg-red-500/20 text-lg aspect-square h-7 rounded-sm flex items-center justify-center">
                        <MdDelete />
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this Subcategory?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="h-10"
                          onClick={() =>
                            handleDeleteSubCategory(subAssignment.id)
                          }
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          ) : (
            <div className=" min-h-[400px] flex flex-col justify-center items-center">
              <p className="text-gray-500">No Subcategories Found</p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className=" h-10 mt-2 flex justify-center items-center px-5 text-sm text-black bg-white rounded-lg font-semibold"
              >
                Add Subcategory
              </button>
            </div>
          )}
        </div>
        <div className=" w-[30%] aspect-square flex justify-center items-center mt-10 border-l-2 border-gray-700/30 p-3">
          {subcategories.length > 0 ? (
            <Doughnut data={categoryChartData} options={options} />
          ) : (
            <p className="text-gray-500">No Subcategories Found...</p>
          )}
        </div>
      </div>
      {createModalOpen && (
        <CreateSubcategoryModal
          isUpdate={false}
          assignment={assignment}
          subcategory={{}}
          setModalOpen={setCreateModalOpen}
        />
      )}
      {updateModalOpen && (
        <CreateSubcategoryModal
          isUpdate={true}
          assignment={assignment}
          subcategory={selectedAssignment}
          setModalOpen={setUpdateModalOpen}
        />
      )}
    </div>
  );
}

export default SubCategoryDisplayCard;
