"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { getCompletedSessions } from "@/lib/api/interview-session"
import { useEffect,useState } from "react"

export function ComboboxDemo({selectedInterview}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [candidates, setCandidates] = useState([]); // State to store candidates

  useEffect(() => {
    const fetchCompletedSessions = async () => {
      try {
        const response = await getCompletedSessions(selectedInterview)
       
        // debugger
        // const candidateEmails = response.map((session) => session.candidate.user.email)
        // const candidateEmails =response.map((session) => {
        //   const email = session.candidate.user.email
        //   console.log(email);
        setCandidates(response.data) 
        console.log("API Response:", candidates) 
      
      
        // console.log("Candidate emails:", candidateEmails)
        // setCandidates(candidateEmails) 
      } catch (error) {
        console.error("Error fetching completed sessions:", error)
      }
    }

    if (selectedInterview) {
      fetchCompletedSessions();
    }
  }, [selectedInterview]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? value : "Select Candidate..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Candidates.." />
          <CommandList>
            <CommandGroup>
              {candidates.length > 0 ? (
                candidates
                  .filter((session) => session.interviewId === selectedInterview) // Filter by interviewId
                  .map((session) => {
                    const email = session.candidate.user.email // Extract email
                    return (
                      <CommandItem
                        key={email}
                        value={email}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === email ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {email}
                      </CommandItem>
                    )
                  })
              ) : (
                <CommandEmpty>No candidates available</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
