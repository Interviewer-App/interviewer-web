import React, { useState } from "react";
import { MdClose } from "react-icons/md";

function InviteCandidateModal({ setInviteModalOpen }) {
  const [email, setEmail] = useState("");

  return (
    <div className=" fixed  top-0 left-0 z-50 h-full w-full flex items-center justify-center bg-black/50">
      <div className=" relative max-w-[700px] h-fit max-h-[670px] w-[90%] md:w-[50%] p-9 bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg">
        <h1 className=" text-2xl font-semibold text-[#f3f3f3] pb-5">
          Invite Candidate
        </h1>
        <button
          onClick={() => setInviteModalOpen(false)}
          className=" absolute top-5 right-5 text-[#f3f3f3]"
        >
          <MdClose className=" text-2xl" />
        </button>
        <p className=" text-sm text-gray-500 py-2">
          Enter the candidate's email address and click the "Send Invitation" button. Once
          submitted, an interview session link will be sent directly to the
          candidate's email.
        </p>
        <form className=" flex flex-col space-y-4 mt-5">
          <input
            type="email"
            placeholder="Canadidate's Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className=" h-[45px] w-full md:w-[60%] rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-5"
          />
          <div className=" flex w-full justify-end">
            <button className=" py-2.5 bg-white text-black text-sm font-semibold rounded-lg px-5">
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteCandidateModal;
