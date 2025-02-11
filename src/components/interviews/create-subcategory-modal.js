import {
  createInterviewSubCategory,
  updateInterviewSubCategory,
} from "@/lib/api/interview";
import React, { useEffect, useState, useRef } from "react";
import { MdClose } from "react-icons/md";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { HexColorPicker } from "react-colorful";
function CreateSubcategoryModal({
  isUpdate,
  assignment,
  setModalOpen,
  subcategory,
}) {
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const { toast } = useToast();
  const [color, setColor] = useState("#034f84");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const colorPickerRef = useRef(null);

  useEffect(() => {
    if (isUpdate) {
      setName(subcategory.name);
      setPercentage(subcategory.percentage);
      setColor(subcategory.color || "#034f84");
    }
  }, [subcategory]);

  const HandleCreateSubInterviewCategory = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name,
        percentage: parseInt(percentage),
        color: color,
      };
      const response = await createInterviewSubCategory(
        assignment.assignmentId,
        data
      );
      if (response.data) {
        toast({
          variant: "success",
          title: "Success!",
          description: "Subcategory added successfully",
        });
        setModalOpen(false);
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Interview category creating failed: ${data.message}`,
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setPickerVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleColorPicker = () => {
    setPickerVisible(!isPickerVisible);
  };

  const HandleUpdateSubInterviewCategory = async (e) => {
    e.preventDefault();

    try {
      const data = {
        name,
        percentage: parseInt(percentage),
        color: color,
      };
      const response = await updateInterviewSubCategory(subcategory.id, data);
      if (response.data) {
        toast({
          variant: "success",
          title: "Success!",
          description: "Subcategory updated successfully",
        });
        setModalOpen(false);
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Interview category updating failed: ${data.message}`,
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
      <div className=" relative max-w-[700px] h-fit max-h-[670px] w-[90%] md:w-[50%] p-9 bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg">
        <h1 className=" text-2xl font-semibold text-[#f3f3f3] pb-5">
          {isUpdate ? "Update " : "Create "}New Subcategory
        </h1>
        <button
          onClick={() => setModalOpen(false)}
          className=" absolute top-5 right-5 text-[#f3f3f3]"
        >
          <MdClose className=" text-2xl" />
        </button>
        <form>
          <div className=" flex justify-between items-center gap-x-4 py-5">
            <input
              type="text"
              placeholder="Sub Category Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className=" h-[45px] w-full md:w-[60%] rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2"
            />
            <input
              type="number"
              placeholder="Percentage"
              name="percentage"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              required
              className=" h-[45px] w-full md:w-[40%] rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2"
            />
            <div>
              {/* <p className=" pb-2 text-sm text-gray-500">Set a color to your sub category</p> */}
              <div
                onClick={toggleColorPicker}
                className=" h-[45px] rounded-lg aspect-square"
                style={{
                  backgroundColor: color,
                  cursor: "pointer",
                }}
              />

              {isPickerVisible && (
                <div
                  ref={colorPickerRef}
                  style={{ position: "absolute", marginTop: "10px" }}
                >
                  <HexColorPicker color={color} onChange={setColor} />
                </div>
              )}
            </div>
          </div>

          <div className=" w-full flex justify-end items-center">
            {isUpdate ? (
              <button
                type="submit"
                onClick={(e) => HandleUpdateSubInterviewCategory(e)}
                className=" h-11 px-5 mt-8 cursor-pointer rounded-lg text-center text-sm text-black bg-white font-semibold"
              >
                Update Subcategory
              </button>
            ) : (
              <button
                type="submit"
                onClick={(e) => HandleCreateSubInterviewCategory(e)}
                className=" h-11 px-5 mt-8 cursor-pointer rounded-lg text-center text-sm text-black bg-white font-semibold"
              >
                Create Subcategory
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSubcategoryModal;
