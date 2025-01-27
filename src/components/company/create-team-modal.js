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

const CreateTeamModal = ({ setModalOpen, isUpdate }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  return (
    <div className="fixed top-0 left-0 z-50 h-full w-full flex items-center justify-center bg-black/50">
      <div className="relative max-w-[700px] h-fit max-h-[670px] w-[90%] md:w-[50%] p-9 bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg">
        <h1 className="text-2xl font-semibold text-[#f3f3f3] pb-5">
          {isUpdate ? 'Update' : 'Create'} Team
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
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[45px] w-full md:w-[48%] rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] mt-5 px-6 py-2 mb-5"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`!bg-[#32353b] w-full md:w-[48%] h-[45px] !m-0 px-2 focus:outline-none outline-none`}
                  variant="outline"
                >
                  {role || "Select Role"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Roles</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
                  <DropdownMenuRadioItem value="Role1">
                    Role1
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="w-full flex justify-center md:justify-end items-center">
            {isUpdate ? (<button
              type="submit"
              className="h-11 min-w-[150px] w-full md:w-[150px] mt-5 cursor-pointer bg-white rounded-lg text-center text-sm text-black font-semibold"
            >
              Update Team
            </button>): (
               <button
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
