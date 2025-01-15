import * as React from "react";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { createInterview } from "@/lib/api/interview";
import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { createCategory } from "@/lib/api/interview-category";
import { useToast } from "@/hooks/use-toast"
import { updateCategory } from "@/lib/api/interview-category";
import { ToastAction } from "@/components/ui/toast"


const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const InterviewCategoryModal = ({ setModalOpen, isUpdated, interviewCategoryDetails }) => {
  // Define state for form fields
  const { toast } = useToast()
  const [categoryName, setCategoryName] = useState("");
  // const [InterviewDescription, setInterviewDescription] = useState("");
  const [description,setDescription]=useState("");
  // Handle form submission
  const [companyId, setCompanyId] = useState(null); 
  

  // const [isUpdated,isSetUpdated]=useState(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      debugger
      const session = await getSession(); 
      if (session?.user?.companyID) {
        setCompanyId(session.user.companyID); 
      }
    };
  
    fetchSessionData(); 
  
    if (isUpdated && interviewCategoryDetails) {
      setCategoryName(interviewCategoryDetails.categoryName);
      setDescription(interviewCategoryDetails.description);
    }
  }, [isUpdated, interviewCategoryDetails]);
  

  // const handleSubmit = async (e) => {

  //   e.preventDefault();
    
  //   //validations
  //   // if (!InterviewName || !InterviewDescription ) {
  //   //   alert("Please fill in all required fields");
  //   //   return;
  //   // }

  //   // Make an API call 
  //   try {
      // await createCategory({
      //   companyId: companyId,
      //   categoryName: categoryName,
      //   description: description,
      // });

      
  //     toast({
  //       title: "Interview Category Created Successfully!",
  //       description: "The interview category has been successfully created.",
  //     });

  //     setModalOpen(false); 
  //   } catch (error) {
  //     console.error("Error creating interview:", error);
  //     // alert("Failed to create interview. Please try again.");
  //   }
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const session = await getSession();

      const companyId = session?.user?.companyID
      const response =       await createCategory({
        companyId: companyId,
        categoryName: categoryName,
        description: description,
      });

      if (response) {
        setModalOpen(false);
        toast({
          title: "Interview Category Created Successfully!",
          description: "The interview category has been successfully created.",
        });
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

  const updateInterviewCategory = async () => {
    try {
      if (!interviewCategoryDetails?.categoryId) {
        alert("Category ID is missing");
        return;
      }

      
      const response = await updateCategory(interviewCategoryDetails.categoryId, {
        categoryName,
        description,
      });

      if(response){
        setModalOpen()
        toast({
          title: "Interview Category updated Successfully!",
          description: "The interview category has been successfully updated.",
        });
      }

      toast({
        title: "Interview Category Updated Successfully!",
        description: "The interview category has been successfully updated.",
      });

      setModalOpen(false); 
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Interview category update failed: ${data.message}`,
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
    <div className="fixed top-0 left-0 z-50 h-full w-full flex items-center justify-center bg-black/50">
      <div className="relative max-w-[700px] h-fit max-h-[670px] w-[90%] md:w-[50%] p-9 bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg">
        <h1 className="text-2xl font-semibold text-[#f3f3f3] pb-5">Interview Categories</h1>
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-5 right-5 text-[#f3f3f3]"
        >
          <MdClose className="text-2xl" />
        </button>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Category Name"
            name="Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-5"
          />
          <textarea
            placeholder="Category Description"
            name="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-3 mb-5"
          />



          <div className="w-full flex justify-center items-center">
            {isUpdated ? (<>
            <button
              type="button"
              onClick={updateInterviewCategory}
              className="h-12 min-w-[150px] w-full md:w-[40%] mt-8 cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
            >
              Update Category
            </button>
            </>) : (<>
              <button
              type="submit"
              className="h-12 min-w-[150px] w-full md:w-[40%] mt-8 cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
            >
              Submit Category
            </button>
            </>)}
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default InterviewCategoryModal;