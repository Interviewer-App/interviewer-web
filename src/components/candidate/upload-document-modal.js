import React, { useEffect } from "react";
import { useState } from "react";
import { MdClose } from "react-icons/md";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { createTeam } from "@/lib/api/user-team";
import { getSession } from "next-auth/react";

import Loading from "@/app/loading";
import { uploadDocumet } from "@/lib/api/users";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AlertCircle } from "lucide-react"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const UploadDocumentModal = ({ setModalOpen }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const session = await getSession();
    const candidateId = session?.user?.candidateID;

    try {
      const response = await uploadDocumet(formData, candidateId);

      if (response) {
        toast({
          variant: "success",
          title: "Success!",
          description: "Document Uploaded successfully",
        });
        setModalOpen(false);

        // const data = await response.json();
        // setUploadUrl(data.url);
      }
      // const response = await fetch('http://localhost:3000/files/upload', {
      //     method: 'POST',
      //     body: formData,
      // });
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Document Uploaded failed: ${data.message}`,
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
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 h-full w-full bg-black/50">
      <div className=" flex items-center justify-center h-full w-full ">
        <div className="relative max-w-[700px] h-fit max-h-[670px] w-[90%] md:w-[40%] p-9 bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg">
          <h1 className="text-2xl font-semibold text-[#f3f3f3] pb-5">
            Upload Document or CV
          </h1>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle >Heads up!</AlertTitle>
            <AlertDescription>
            Please upload your CV in PDF format only.
            </AlertDescription>
          </Alert>
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-5 right-5 text-[#f3f3f3]"
          >
            <MdClose className="text-2xl" />
          </button>
          <form onSubmit={handleSubmit} className="flex flex-row gap-5 mt-6">
            {/* <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            /> */}
            <div className="grid w-full items-center">
              <Input
                id="file"
                accept="application/pdf"
                type="file"
                required
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full !bg-[#32353b] !placeholder-[#737883]"
              />
            </div>
            <button
              className=" text-sm font-semibold text-black bg-white rounded-lg px-5 py-0"
              type="submit"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
          {/* {uploadUrl && (
            <div>
              <p>
                Uploaded PDF:{" "}
                <a href={uploadUrl} target="_blank">
                  {uploadUrl}
                </a>
              </p>
            </div>
          )} */}
        </div>
      </div>
      {loading && (
        <div className=" fixed  top-0 left-0 h-full w-full flex items-center justify-center bg-black/50">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default UploadDocumentModal;
