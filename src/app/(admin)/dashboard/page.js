'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { LayoutDashboard, Users, ArrowUpRight, ArrowDownRight, Filter, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Mock data for the dashboard
const totalUsers = 560;
const newUsers = 48;
const percentChange = 12.5;
const isPositiveChange = true;

export default function AdminDashboard() {
  const [assessmentProgress, setAssessmentProgress] = useState(0);
  const [interviewProgress, setInterviewProgress] = useState(0);

  // Simulate loading progress
  useEffect(() => {
    // Gradually increment the progress bars for visual effect
    const timer = setTimeout(() => {
      setAssessmentProgress(78);
      setInterviewProgress(62);
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex-1 p-8">
          <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Users Card */}
            <Card className="bg-gray-900/50 border-gray-800 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{totalUsers}</span>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositiveChange ? '+' : '-'}{percentChange}%
                      </span>
                      <span className="text-xs text-gray-400 ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* New Users Card */}
            <Card className="bg-gray-900/50 border-gray-800 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">New Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{newUsers}</span>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-green-500 flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        8.2%
                      </span>
                      <span className="text-xs text-gray-400 ml-1">from yesterday</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Projects Card */}
            <Card className="bg-gray-900/50 border-gray-800 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">12</span>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-red-500 flex items-center">
                        <ArrowDownRight className="h-3 w-3 mr-0.5" />
                        2.1%
                      </span>
                      <span className="text-xs text-gray-400 ml-1">from last week</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Assessment Progress */}
            <Card className="bg-gray-900/50 border-gray-800 text-white">
              <CardHeader>
                <CardTitle className="text-base">Assessment Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm font-medium">{assessmentProgress}%</span>
                  </div>
                  <Progress value={assessmentProgress} className="h-2 bg-gray-700" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Completed</div>
                    <div className="text-lg font-semibold mt-1">325</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">In Progress</div>
                    <div className="text-lg font-semibold mt-1">92</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interview Progress */}
            <Card className="bg-gray-900/50 border-gray-800 text-white">
              <CardHeader>
                <CardTitle className="text-base">Interview Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm font-medium">{interviewProgress}%</span>
                  </div>
                  <Progress value={interviewProgress} className="h-2 bg-gray-700" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Completed</div>
                    <div className="text-lg font-semibold mt-1">145</div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400">Scheduled</div>
                    <div className="text-lg font-semibold mt-1">89</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-gray-900/50 border-gray-800 text-white">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start pb-4 last:pb-0 border-b border-gray-800 last:border-0">
                    <div className="h-9 w-9 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">New user registered</span>
                      <span className="text-xs text-gray-400">user{i}@example.com</span>
                    </div>
                    <div className="ml-auto text-xs text-gray-400">
                      {i} hour{i !== 1 ? 's' : ''} ago
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </SidebarInset>

    </>
  )

}