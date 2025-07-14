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
import { AlertCircleIcon, BookIcon, LightbulbIcon, Radius } from "lucide-react";
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
    <div className=" h-dvh w-[80%] max-w-[1500px] mx-auto bg-black">
      <div className=" h-dvh py-[100px] relative bg-black text-white flex flex-col justify-between items-center">
        {/* QUESTION SECTION */}
        <div className="flex flex-col justify-center items-center !rounded-lg w-full">
          <Card className="w-full relative py-8 px-6 !bg-[#0a0a0a] !border !rounded-lg">
            {" "}
            <CardHeader className="flex flex-row items-center gap-2">
              <CardTitle className=" absolute top-4 left-4 text-[#b3b3b3]">
                Coding Question
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed !p-0 !mx-0">
              {isSubmitBtnAvailable && (
                <div className=" absolute top-1 right-4 text-gray-400 text-2xl font-semibold">
                  <span className=" text-sm font-normal">Time Remaining</span>{" "}
                  <p className=" text-right">{time}</p>
                </div>
              )}
              <div className=" pb-10">
                <p className="whitespace-pre-line text-base">
                  {question.questionText}
                </p>
              </div>
              <div className=" absolute bottom-4 left-4 text-gray-600">
                Estimated Time: {question.estimatedTimeMinutes} minutes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* <ResizableHandle withHandle className='!bg-black' /> */}

        {/* CODE EDITOR */}
        <div className="w-full max-w-[1500px] mx-auto mt-10">
          <div className="!rounded-lg">
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
                <div className=" rounded-lg overflow-hidden border border-gray-700">
                  <Editor
                    className="max-w-[1500px] min-h-[300px] mx-auto w-full !rounded-lg"
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
              <div className=" flex justify-center mt-24 flex-col items-center h-full">
                <p className=" text-xl font-semibold">
                  Your answer has been submitted.
                </p>
                <p className=" text-gray-500 text-xs">
                  Analyzing your answer...
                </p>
              </div>
            )}
          </div>

          <div
            className={`max-w-[1500px] flex justify-center mx-auto md:px-12 sm:px-12 `}
          >
            {isSubmitBtnAvailable && (
              <button
                onClick={submitCode}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg "
              >
                Submit Answer
              </button>
            )}
          </div>
        </div>

        {/* <ResizableHandle withHandle /> */}
      </div>
    </div>
  );
}
export default CodeEditor;
