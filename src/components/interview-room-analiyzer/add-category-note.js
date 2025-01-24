'use client'
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
// import Editor from "../rich-text/editor";
import dynamic from 'next/dynamic'

// Toast
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { addNoteForCategory } from "@/lib/api/interview-category";
// import QuillEditor from "@/components/quillEditor";

const QuillEditor = dynamic(
  () => import('@/components/quillEditor'),
  { ssr: false }
)

function AddCategoryNote({
  selectedCategoryScoreId,
  setNoteModalOpen,
  categoryName,
}) {
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const handleAddNote = async () => {
    if (!note.trim()) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Note cannot be empty",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    try {
      const response = await addNoteForCategory(selectedCategoryScoreId, {
        note: note,
      });

      if (response) {      
        toast({
          title: `Success!`,
          description: `The Note has been updated successfully.`,
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        });
        setNoteModalOpen(false)
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Note adding failed: ${data.message}`,
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
          Add note: {categoryName}
        </h1>
        <button
          onClick={() => setNoteModalOpen(false)}
          className=" absolute top-5 right-5 text-[#f3f3f3]"
        >
          <MdClose className=" text-2xl" />
        </button>
        <div>
          {/* <Editor
            content={note}
            onChange={setNote}
            placeholder="Write your note"
            readOnly={false}
            required
            className=" w-full text-sm border-2 border-gray-700 rounded-lg placeholder-[#737883] px-6 py-3 rich-text"
          /> */
          <QuillEditor value={note} onChange={setNote} placeholder='Enter you note...'/>
          }
          <button
            onClick={handleAddNote}
            className=" md:float-right mt-5 bg-white rounded-lg text-center text-sm text-black font-semibold h-11 w-[130px]"
          >
            Add note
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCategoryNote;
