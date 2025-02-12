"use client";
import Image from "next/image";
import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import Editor from "@monaco-editor/react";

function CodeEditor({
  question,
  handleSubmit,
  setTranscript,
  isSubmitBtnAvailable,
  sessionID,
  socket,
  time,
}) {
  const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState(LANGUAGES[0].id);
  const [code, setCode] = useState(selectedQuestion.starterCode[language]);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleQuestionChange = (questionId) => {
    const question = CODING_QUESTIONS.find((q) => q.id === questionId);
    setSelectedQuestion(question);
    setCode(question.starterCode[language]);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(selectedQuestion.starterCode[newLanguage]);
  };
  const [editorCode, setEditorCode] = useState(code);

  useEffect(() => {
    setTranscript(code);
  }, [code]);

  const submitCode = () => {
    handleSubmit();
    setCode(selectedQuestion.starterCode[language]);
    setIsSubmit(true);
  };

  const handleCodeValue = (value) => {
    setCode(value || "");
    socket.emit("typingUpdate", {
      sessionId: sessionID,
      text: value,
    });
  };

  return (
    <div className="h-lvh w-[80%] max-w-[1500px] mx-auto py-9 bg-black">
      <ResizablePanelGroup
        direction="vertical"
        className=" relative min-h-[calc-200vh-4rem-1px] bg-black text-white mx-auto"
      >
        <div className=" absolute top-1 right-4 text-gray-400 text-2xl font-semibold">
          <span className=" text-sm font-normal">Time Remaining</span>{" "}
          <p className=" text-right">{time}</p>
        </div>
        {/* QUESTION SECTION */}
        <ResizablePanel
          defaultSize={30}
          className="flex flex-col justify-center items-center !rounded-lg"
        >
          <Card className="w-full py-8  px-6 !bg-neutral-900 !rounded-lg">
            {" "}
            {/* Add w-[80%] here */}
            <CardHeader className="flex flex-row items-center gap-2">
              {/* <BookIcon className="h-5 w-5 text-primary/80" /> */}
              <CardTitle>Coding Question</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-line text-lg">{question}</p>
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>

        {/* <ResizableHandle withHandle className='!bg-black' /> */}

        {/* CODE EDITOR */}
        <ResizablePanel defaultSize={70} className="!rounded-lg">
          {isSubmitBtnAvailable ? (
            <>
              <div className="w-full max-w-[1500px] flex justify-end mb-5 mt-10 mx-auto !rounded-lg">
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[150px]">
                    {/* SELECT VALUE */}
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <Image
                          width={25}
                          height={25}
                          src={LANGUAGES.find((l) => l.id === language)?.icon}
                          alt={language}
                          className="w-5 h-5 object-contain"
                        />
                        {LANGUAGES.find((l) => l.id === language)?.name}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        <div className="flex items-center gap-2">
                          <Image
                            width={25}
                            height={25}
                            src={`${lang.icon}`}
                            alt={lang.name}
                            className="w-5 h-5 object-contain"
                          />
                          {lang.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Editor
                  className="max-w-[1500px] min-h-[400px] mx-auto w-full !rounded-lg max-h-96"
                  defaultLanguage={language}
                  language={language}
                  theme="vs-dark"
                  value={code}
                  onChange={handleCodeValue}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 18,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    wordWrap: "on",
                    wrappingIndent: "indent",
                  }}
                />
              </div>
            </>
          ) : (
            <div className=" flex justify-center flex-col items-center h-full">
              <p className=" text-xl font-semibold">
                Your answer has been submitted.
              </p>
              <p className=" text-gray-500 text-xs">Analyzing your answer...</p>
            </div>
          )}
        </ResizablePanel>

        <div
          className={`max-w-[1500px] flex justify-center mx-auto md:px-12 sm:px-12 `}
        >
          {isSubmitBtnAvailable && (
            <button
              onClick={submitCode}
              className="mt-5 bg-blue-400 hover:bg-blue-500 text-white py-2 px-6 rounded-lg "
            >
              Submit Answer
            </button>
          )}
        </div>

        {/* <ResizableHandle withHandle /> */}
      </ResizablePanelGroup>
    </div>
  );
}
export default CodeEditor;
