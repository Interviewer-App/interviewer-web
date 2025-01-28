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

const CreateTeamModal = ({ setModalOpen, isUpdate, companyTeam }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (isUpdate) {
      setEmail(companyTeam.email);
      setFirstName(companyTeam.firstName);
      setLastName(companyTeam.lastName);
      setRole(companyTeam.role);
    }
  }, [isUpdate, companyTeam]);

  const handlCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const session = await getSession();
      const companyId = session?.user?.companyID;
      const team = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        companyId,
        teamRole: role,
      };

      const response = await createTeam(team);

      if (response) {
        toast({
          variant: "success",
          title: "Success!",
          description: "New Team Added successfully",
        });
        setModalOpen(false);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `New team adding failed: ${data.message}`,
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

  const handleUpdateTeam = async (e) => {
    setModalOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 z-50 h-full w-full flex items-center justify-center bg-black/50">
      <div className="relative max-w-[700px] h-fit max-h-[670px] w-[90%] md:w-[50%] p-9 bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg">
        <h1 className="text-2xl font-semibold text-[#f3f3f3] pb-5">
          {isUpdate ? "Update" : "Create"} Team
        </h1>
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-5 right-5 text-[#f3f3f3]"
        >
          <MdClose className="text-2xl" />
        </button>
        <form>
          <div className=" w-full flex justify-between items-center">
            <input
              type="text"
              placeholder="First Name"
              name="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="h-[45px] w-full md:w-[48%] rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] mt-5 px-6 py-2 mb-5"
            />
            <input
              type="text"
              placeholder="Last Name"
              name="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="h-[45px] w-full md:w-[48%] rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] mt-5 px-6 py-2 mb-5"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-5"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={`!bg-[#32353b] w-full h-[45px] !m-0 px-2 focus:outline-none outline-none`}
                variant="outline"
              >
                {role || "Select Role"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Roles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
                <DropdownMenuRadioItem value="ADMIN">
                  Admin
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="HIRING_MANAGER">
                  Hiring Manager
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="INTERVIEWER">
                  Interviewer
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-full flex justify-center md:justify-end items-center">
            {isUpdate ? (
              <button
                type="submit"
                onClick={handleUpdateTeam}
                className="h-11 min-w-[150px] w-full md:w-[150px] mt-5 cursor-pointer bg-white rounded-lg text-center text-sm text-black font-semibold"
              >
                Update Team
              </button>
            ) : (
              <button
                onClick={handlCreateTeam}
                type="submit"
                className="h-11 min-w-[150px] w-full md:w-[150px] mt-5 cursor-pointer bg-white rounded-lg text-center text-sm text-black font-semibold"
              >
                Create Team
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;
