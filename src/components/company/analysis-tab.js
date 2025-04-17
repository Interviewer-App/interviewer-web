"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  Award,
  BarChart3,
  ChevronDown,
  Download,
  Eye,
  Filter,
  Info,
  Medal,
  Search,
  Star,
  Trophy,
  User,
  Check,
} from "lucide-react"
import { fetchAnalyzeDashboard, sortCandidates } from "@/lib/api/interview"
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";



// Sample data for demonstration
const sampleCandidates = [
  {
    id: "c1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    interviewDate: "May 3, 2025",
    technicalSkills: [
      { name: "React", score: 85, maxScore: 100 },
      { name: "TypeScript", score: 90, maxScore: 100 },
      { name: "Node.js", score: 75, maxScore: 100 },
    ],
    softSkills: [
      { name: "Communication", score: 90, maxScore: 100 },
      { name: "Teamwork", score: 85, maxScore: 100 },
      { name: "Problem Solving", score: 95, maxScore: 100 },
    ],
    overallScore: 87,
    status: "Shortlisted",
  },
  {
    id: "c2",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    interviewDate: "May 4, 2025",
    technicalSkills: [
      { name: "React", score: 95, maxScore: 100 },
      { name: "TypeScript", score: 85, maxScore: 100 },
      { name: "Node.js", score: 80, maxScore: 100 },
    ],
    softSkills: [
      { name: "Communication", score: 80, maxScore: 100 },
      { name: "Teamwork", score: 90, maxScore: 100 },
      { name: "Problem Solving", score: 85, maxScore: 100 },
    ],
    overallScore: 86,
    status: "Shortlisted",
  },
  {
    id: "c3",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    interviewDate: "May 5, 2025",
    technicalSkills: [
      { name: "React", score: 90, maxScore: 100 },
      { name: "TypeScript", score: 95, maxScore: 100 },
      { name: "Node.js", score: 90, maxScore: 100 },
    ],
    softSkills: [
      { name: "Communication", score: 85, maxScore: 100 },
      { name: "Teamwork", score: 80, maxScore: 100 },
      { name: "Problem Solving", score: 90, maxScore: 100 },
    ],
    overallScore: 89,
    status: "Hired",
  },
  {
    id: "c4",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    interviewDate: "May 6, 2025",
    technicalSkills: [
      { name: "React", score: 70, maxScore: 100 },
      { name: "TypeScript", score: 65, maxScore: 100 },
      { name: "Node.js", score: 75, maxScore: 100 },
    ],
    softSkills: [
      { name: "Communication", score: 95, maxScore: 100 },
      { name: "Teamwork", score: 90, maxScore: 100 },
      { name: "Problem Solving", score: 80, maxScore: 100 },
    ],
    overallScore: 78,
    status: "Rejected",
  },
  {
    id: "c5",
    name: "David Kim",
    email: "david.kim@example.com",
    interviewDate: "May 7, 2025",
    technicalSkills: [
      { name: "React", score: 80, maxScore: 100 },
      { name: "TypeScript", score: 75, maxScore: 100 },
      { name: "Node.js", score: 85, maxScore: 100 },
    ],
    softSkills: [
      { name: "Communication", score: 75, maxScore: 100 },
      { name: "Teamwork", score: 85, maxScore: 100 },
      { name: "Problem Solving", score: 80, maxScore: 100 },
    ],
    overallScore: 80,
    status: "Pending",
  },
  {
    id: "c6",
    name: "Jessica Taylor",
    email: "jessica.taylor@example.com",
    interviewDate: "May 8, 2025",
    technicalSkills: [
      { name: "React", score: 85, maxScore: 100 },
      { name: "TypeScript", score: 80, maxScore: 100 },
      { name: "Node.js", score: 90, maxScore: 100 },
    ],
    softSkills: [
      { name: "Communication", score: 90, maxScore: 100 },
      { name: "Teamwork", score: 95, maxScore: 100 },
      { name: "Problem Solving", score: 85, maxScore: 100 },
    ],
    overallScore: 88,
    status: "Hired",
  },
  {
    id: "c7",
    name: "Robert Martinez",
    email: "robert.martinez@example.com",
    interviewDate: "May 9, 2025",
    technicalSkills: [
      { name: "React", score: 75, maxScore: 100 },
      { name: "TypeScript", score: 70, maxScore: 100 },
      { name: "Node.js", score: 65, maxScore: 100 },
    ],
    softSkills: [
      { name: "Communication", score: 70, maxScore: 100 },
      { name: "Teamwork", score: 75, maxScore: 100 },
      { name: "Problem Solving", score: 65, maxScore: 100 },
    ],
    overallScore: 70,
    status: "Rejected",
  },
  {
    id: "c8",
    name: "Lisa Wang",
    email: "lisa.wang@example.com",
    interviewDate: "May 10, 2025",
    technicalSkills: [
      { name: "React", score: 95, maxScore: 100 },
      { name: "TypeScript", score: 90, maxScore: 100 },
      { name: "Node.js", score: 95, maxScore: 100 },
    ],
    softSkills: [
      { name: "Communication", score: 85, maxScore: 100 },
      { name: "Teamwork", score: 90, maxScore: 100 },
      { name: "Problem Solving", score: 95, maxScore: 100 },
    ],
    overallScore: 92,
    status: "Hired",
  },
]

// Helper function to calculate average score for a specific skill type
const calculateAverageScore = (candidates, skillType) => {
  if (candidates.length === 0) return 0
  // const totalScore = ''
  const totalScore = candidates.reduce((sum, candidate) => {
    const skills = candidate[skillType]
    const candidateAvg = skills.reduce((skillSum, skill) => skillSum + skill.score, 0) / skills.length
    return sum + candidateAvg
  }, 0)

  return Math.round((totalScore / candidates.length) * 10) / 10
}

export default function CandidateAnalysisTab({ categoryList, interviewId }) {
  // State for sorting and filtering
  const [sortCriteria, setSortCriteria] = useState("overall")
  const [sortDirection, setSortDirection] = useState("desc")
  const [topCandidatesCount, setTopCandidatesCount] = useState(3)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState([])
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [isCompareMode, setIsCompareMode] = useState(false)
  const [candidatesToCompare, setCandidatesToCompare] = useState([])
  const [showDetailedView, setShowDetailedView] = useState(false)
  const [candidates, setCandidates] = useState([]);
  const [avgOverallScore, setAvgOverallScore] = useState(0);
  const [avgTechnicalScore, setAvgTechnicalScore] = useState(0);
  const [avgSoftScore, setAvgSoftScore] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (interviewId) sortTopCandidates();
  }, [interviewId]);


  useEffect(() => {
    const analyzeDashboard = async () => {
      try {
        const response = await fetchAnalyzeDashboard(interviewId);
        if (response.data) {
          setAvgOverallScore(response.data.averageOverallScore);
          setAvgSoftScore(response.data.averageSoftScore);
          setAvgTechnicalScore(response.data.averageTechnicalScore);
          // setInterviewStatusDetails(response.data);
        }
      } catch (error) {
        console.log("Error fetching interview status:", error);
      }
    };

    if (interviewId) {
      analyzeDashboard();
    }
  }, [interviewId]);

  // Calculate average scores
  // const avgTechnicalScore = calculateAverageScore(sampleCandidates, "technicalSkills")
  // const avgSoftScore = calculateAverageScore(sampleCandidates, "softSkills")
  //   const avgOverallScore =
  //   candidates.reduce((sum, candidate) => sum + candidate.overallScore, 0) / candidates.length
  // const avgOverallScore = 0

  // Sort and filter candidates
  const sortedAndFilteredCandidates = useMemo(() => {
    // First apply search filter
    let filtered = candidates.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Then apply status filter if any
    if (statusFilter.length > 0) {
      filtered = filtered.filter((candidate) => statusFilter.includes(candidate.status))
    }

    // Then sort
    return [...filtered].sort((a, b) => {
      let aValue, bValue

      //   if (sortCriteria === "technical") {
      //     aValue = a.technicalSkills.reduce((sum, skill) => sum + skill.score, 0) / a.technicalSkills.length
      //     bValue = b.technicalSkills.reduce((sum, skill) => sum + skill.score, 0) / b.technicalSkills.length
      //   } else if (sortCriteria === "soft") {
      //     aValue = a.softSkills.reduce((sum, skill) => sum + skill.score, 0) / a.softSkills.length
      //     bValue = b.softSkills.reduce((sum, skill) => sum + skill.score, 0) / b.softSkills.length
      //   } else {
      //     aValue = a.overallScore
      //     bValue = b.overallScore
      //   }

      return sortDirection === "desc" ? bValue - aValue : aValue - bValue
    })
  }, [candidates, sortCriteria, sortDirection, searchQuery, statusFilter])

  // Get top candidates
  const topCandidates = useMemo(() => {
    return sortedAndFilteredCandidates.slice(0, topCandidatesCount)
  }, [sortedAndFilteredCandidates, topCandidatesCount])

  // Toggle candidate selection for comparison
  const toggleCandidateSelection = (candidateId) => {
    setCandidatesToCompare((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((candidateId) => candidateId !== candidateId)
      } else {
        // Limit to 3 candidates for comparison
        if (prev.length >= 3) {
          return [...prev.slice(1), candidateId]
        }
        return [...prev, candidateId]
      }
    })
  }

  // Get candidates for comparison
  const candidatesForComparison = useMemo(() => {
    const value = candidates.filter((candidate) => candidatesToCompare.includes(candidate.candidateId))
    return candidates.filter((candidate) => candidatesToCompare.includes(candidate.candidateId))
  }, [candidatesToCompare])

  // Prepare data for the comparison chart
  const comparisonChartData = useMemo(() => {
    if (candidatesForComparison.length === 0) return []


    const allCategoryNames = [
      ...new Set(
        candidatesForComparison.flatMap((candidate) =>
          candidate.categoryScores.map(
            (score) => score.categoryAssignment.category.categoryName
          )
        )
      ),
    ];

    const chartData = allCategoryNames.map((categoryName) => {
      const dataPoint = { name: categoryName };

      candidatesForComparison.forEach((candidate) => {
        const categoryScore = candidate.categoryScores.find(
          (score) => score.categoryAssignment.category.categoryName === categoryName
        );

        dataPoint[candidate.name] = categoryScore?.score ?? 0;
      });

      return dataPoint;
    });

    return chartData;

    // const skills = [
    //   ...new Set(
    //     candidatesForComparison.flatMap((candidate) => [
    //       ...candidate.technicalSkills.map((skill) => skill.name),
    //       ...candidate.softSkills.map((skill) => skill.name),
    //     ]),
    //   ),
    // ]

    // return skills.map((skillName) => {
    //   const dataPoint = { name: skillName }

    //   candidatesForComparison.forEach((candidate) => {
    //     const techSkill = candidate.technicalScore
    //     const softSkill = candidate.softScore

    //     if (techSkill) {
    //       dataPoint[candidate.name] = techSkill
    //       dataPoint[`${candidate.name} Type`] = "Technical"
    //     } else if (softSkill) {
    //       dataPoint[candidate.name] = softSkill
    //       dataPoint[`${candidate.name} Type`] = "Soft"
    //     }
    //   })

    //   return dataPoint
    // })
  }, [candidatesForComparison])

  // Toggle status filter
  const toggleStatusFilter = (status) => {
    setStatusFilter((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status)
      } else {
        return [...prev, status]
      }
    })
  }

  // Calculate rank for a candidate
  const getCandidateRank = (candidate) => {
    return sortedAndFilteredCandidates.findIndex((c) => c.candidateId === candidate.candidateId) + 1
  }

  // Get color based on score
  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-500"
    if (score >= 80) return "text-blue-500"
    if (score >= 70) return "text-amber-500"
    return "text-red-500"
  }

  // Get background color based on score
  const getScoreBgColor = (score) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-blue-500"
    if (score >= 70) return "bg-amber-500"
    return "bg-red-500"
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Hired":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
      case "Shortlisted":
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
      case "Pending":
        return "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30"
      case "Rejected":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30"
    }
  }

  const sortTopCandidates = async (e) => {
    let data;
    try {
      if (sortCriteria === "overall") {
        data = {
          interviewId: interviewId,
        };
      } else {
        data = {
          interviewId: interviewId,
          categoryId: sortCriteria,
          limit: parseInt(topCandidatesCount),
          type: "category",
        };
      }
      const response = await sortCandidates(data);
      if (response) {
        setCandidates(response.data);
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `sorting Faild: ${data.message}`,
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

  // Get medal icon for top 3 candidates
  const getMedalIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header with summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Technical Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(avgTechnicalScore)}`}>{avgTechnicalScore}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Soft Skills Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(avgSoftScore)}`}>{avgSoftScore}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <User className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Overall Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(avgOverallScore)}`}>{avgOverallScore.toFixed(1)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Star className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls and filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Analysis Settings</CardTitle>
          <CardDescription>Configure how candidate data is sorted and displayed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sort-criteria">Sort By</Label>
              <Select value={sortCriteria} onValueChange={(value) => setSortCriteria(value)}>
                <SelectTrigger id="sort-criteria">
                  <SelectValue placeholder="Select criteria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='overall'>
                    Overall
                  </SelectItem>
                  {categoryList.map((category) => (

                    <SelectItem key={category.key} value={category.key}>
                      {category.catagory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="sort-direction">Sort Direction</Label>
              <Select value={sortDirection} onValueChange={(value) => setSortDirection(value)}>
                <SelectTrigger id="sort-direction">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Highest First</SelectItem>
                  <SelectItem value="asc">Lowest First</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="top-count">Top Candidates to Display</Label>
              <Select
                value={topCandidatesCount.toString()}
                onValueChange={(value) => setTopCandidatesCount(Number.parseInt(value))}
              >
                <SelectTrigger id="top-count">
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Top 3</SelectItem>
                  <SelectItem value="5">Top 5</SelectItem>
                  <SelectItem value="10">Top 10</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex justify-center items-center">
              <button
                onClick={sortTopCandidates}
                className=" h-11 min-w-[160px] mt-5 md:mt-0 px-5 mr-5 cursor-pointer bg-white rounded-lg text-center text-sm text-black font-semibold"
              >
                Sort Candidates
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="view-mode">View Mode</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm">Compare Mode</span>
                <Switch id="view-mode" checked={isCompareMode} onCheckedChange={setIsCompareMode} />
              </div>
              <p className="text-xs text-muted-foreground">
                {isCompareMode ? "Select up to 3 candidates to compare" : "Enable to compare candidates side by side"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top candidates section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Top Candidates</h2>
          <div className="flex items-center gap-2">
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Filter</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleStatusFilter("Hired")}
                >
                  <div className="flex items-center h-4 w-4">
                    {statusFilter.includes("Hired") && <Check className="h-4 w-4" />}
                  </div>
                  <Badge className={getStatusColor("Hired")}>Hired</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleStatusFilter("Shortlisted")}
                >
                  <div className="flex items-center h-4 w-4">
                    {statusFilter.includes("Shortlisted") && <Check className="h-4 w-4" />}
                  </div>
                  <Badge className={getStatusColor("Shortlisted")}>Shortlisted</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleStatusFilter("Pending")}
                >
                  <div className="flex items-center h-4 w-4">
                    {statusFilter.includes("Pending") && <Check className="h-4 w-4" />}
                  </div>
                  <Badge className={getStatusColor("Pending")}>Pending</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleStatusFilter("Rejected")}
                >
                  <div className="flex items-center h-4 w-4">
                    {statusFilter.includes("Rejected") && <Check className="h-4 w-4" />}
                  </div>
                  <Badge className={getStatusColor("Rejected")}>Rejected</Badge>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => setStatusFilter([])}>
                  Clear Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                className="pl-9 h-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isCompareMode && candidatesForComparison.length > 0 ? (
          // Comparison view
          <Card>
            <CardHeader>
              <CardTitle>Candidate Comparison</CardTitle>
              <CardDescription>
                Comparing {candidatesForComparison.length} candidate{candidatesForComparison.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Comparison table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Metric</TableHead>
                        {candidatesForComparison.map((candidate) => (
                          <TableHead key={candidate.candidateId}>
                            <div className="flex flex-col items-center gap-2">
                              <Avatar>
                                {/* <AvatarImage src={candidate.avatar} alt={candidate.name} /> */}
                                <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{candidate.name}</span>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Overall Score</TableCell>
                        {candidatesForComparison.map((candidate) => (
                          <TableCell key={`${candidate.candidateId}-overall`} className="text-center">
                            <span className={`text-lg font-bold ${getScoreColor(candidate.overallScore)}`}>
                              {candidate.overallScore}
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Rank</TableCell>
                        {candidatesForComparison.map((candidate) => (
                          <TableCell key={`${candidate.candidateId}-rank`} className="text-center">
                            <Badge variant="outline">#{getCandidateRank(candidate)}</Badge>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Status</TableCell>
                        {candidatesForComparison.map((candidate) => (
                          <TableCell key={`${candidate.candidateId}-status`} className="text-center">
                            <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Technical Skills (Avg)</TableCell>
                        {candidatesForComparison.map((candidate) => {
                          const avgTech =
                            candidate.technicalScore
                          return (
                            <TableCell key={`${candidate.candidateId}-tech`} className="text-center">
                              <span className={`font-bold ${getScoreColor(avgTech)}`}>{avgTech.toFixed(1)}</span>
                            </TableCell>
                          )
                        })}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Soft Skills (Avg)</TableCell>
                        {candidatesForComparison.map((candidate) => {
                          const avgSoft =
                            candidate.softScore
                          return (
                            <TableCell key={`${candidate.candidateId}-soft`} className="text-center">
                              <span className={`font-bold ${getScoreColor(avgSoft)}`}>{avgSoft.toFixed(1)}</span>
                            </TableCell>
                          )
                        })}
                      </TableRow>

                      {/* Technical skills breakdown */}
                      {/* {candidatesForComparison[0]?.technicalSkills.map((skill) => (
                        <TableRow key={`tech-${skill.name}`}>
                          <TableCell className="font-medium pl-8">
                            {skill.name} <span className="text-xs text-muted-foreground">(Technical)</span>
                          </TableCell>
                          {candidatesForComparison.map((candidate) => {
                            const candidateSkill = candidate.technicalSkills.find((s) => s.name === skill.name)
                            return (
                              <TableCell key={`${candidate.candidateId}-${skill.name}`} className="text-center">
                                {candidateSkill ? (
                                  <div className="flex flex-col items-center">
                                    <span className={`font-bold ${getScoreColor(candidateSkill.score)}`}>
                                      {candidateSkill.score}
                                    </span>
                                    <div className="w-full bg-muted h-1.5 rounded-full mt-1">
                                      <div
                                        className={`h-full rounded-full ${getScoreBgColor(candidateSkill.score)}`}
                                        style={{ width: `${candidateSkill.score}%` }}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))} */}

                      {/* Soft skills breakdown */}
                      {/* {candidatesForComparison[0]?.softSkills.map((skill) => (
                        <TableRow key={`soft-${skill.name}`}>
                          <TableCell className="font-medium pl-8">
                            {skill.name} <span className="text-xs text-muted-foreground">(Soft)</span>
                          </TableCell>
                          {candidatesForComparison.map((candidate) => {
                            const candidateSkill = candidate.softSkills.find((s) => s.name === skill.name)
                            return (
                              <TableCell key={`${candidate.candidateId}-${skill.name}`} className="text-center">
                                {candidateSkill ? (
                                  <div className="flex flex-col items-center">
                                    <span className={`font-bold ${getScoreColor(candidateSkill.score)}`}>
                                      {candidateSkill.score}
                                    </span>
                                    <div className="w-full bg-muted h-1.5 rounded-full mt-1">
                                      <div
                                        className={`h-full rounded-full ${getScoreBgColor(candidateSkill.score)}`}
                                        style={{ width: `${candidateSkill.score}%` }}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">N/A</span>
                                )}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))} */}
                    </TableBody>
                  </Table>
                </div>

                {/* Comparison chart */}
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">Skills Comparison Chart</h3>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonChartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                        <YAxis domain={[0, 100]} />
                        <RechartsTooltip
                          formatter={(value, name, props) => [`${value}/100`, name]}
                          labelFormatter={(label) => `Skill: ${label}`}
                        />
                        <Legend />
                        {candidatesForComparison.map((candidate, index) => (
                          <Bar
                            key={candidate.candidateId}
                            dataKey={candidate.name}
                            fill={index === 0 ? "#3b82f6" : index === 1 ? "#10b981" : "#8b5cf6"}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button variant="outline" onClick={() => setCandidatesToCompare([])}>
                Clear Selection
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Comparison
              </Button>
            </CardFooter>
          </Card>
        ) : (
          // Top candidates grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCandidates.length > 0 ? (
              topCandidates.map((candidate, index) => (
                <Card
                  key={candidate.candidateId}
                  className={
                    isCompareMode && candidatesToCompare.includes(candidate.candidateId)
                      ? "border-blue-500 shadow-[0_0_2px_#3b82f6,0_0_4px_#3b82f6]"
                      : ""
                  }
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar>
                            {/* <AvatarImage src={candidate.avatar} alt={candidate.name} /> */}
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {index < 3 && <div className="absolute -top-1 -right-1">{getMedalIcon(index + 1)}</div>}
                        </div>
                        <div>
                          <CardTitle className="text-base">{candidate.name}</CardTitle>
                          <CardDescription className="text-xs">{candidate.email}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">Overall Score</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Combined score of technical and soft skills</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-2xl font-bold ${getScoreColor(candidate.overallScore)}`}>
                              {candidate.overallScore}
                            </span>
                            <span className="text-sm text-muted-foreground">/ 100</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Rank</div>
                          <div className="text-xl font-semibold">#{getCandidateRank(candidate)}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Technical Skills</span>
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                candidate.technicalScore
                              )}`}
                            >
                              {(
                                candidate.technicalScore
                              ).toFixed(1)
                              }
                            </span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full">
                            <div
                              className="bg-blue-500 h-full rounded-full"
                              style={{
                                width: `${candidate.technicalScore
                                  }%`,
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Soft Skills</span>
                            <span
                              className={`text-sm font-medium ${getScoreColor(
                                candidate.softScore
                              )}`}
                            >
                              {(
                                candidate.softScore
                              ).toFixed(1)}
                            </span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full">
                            <div
                              className="bg-purple-500 h-full rounded-full"
                              style={{
                                width: `${candidate.softScore
                                  }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    {isCompareMode ? (
                      <Button
                        variant={candidatesToCompare.includes(candidate.candidateId) ? "default" : "outline"}
                        className={candidatesToCompare.includes(candidate.candidateId) ? "bg-blue-600 hover:bg-blue-700" : ""}
                        onClick={() => toggleCandidateSelection(candidate.candidateId)}
                      >
                        {candidatesToCompare.includes(candidate.candidateId) ? "Selected" : "Select for Comparison"}
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={() => setSelectedCandidate(candidate)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center h-40 border rounded-md">
                <p className="text-muted-foreground">No candidates match your filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* All candidates table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Candidates</h2>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead className="text-center">Technical Skills</TableHead>
                  <TableHead className="text-center">Soft Skills</TableHead>
                  <TableHead className="text-center">Overall Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredCandidates.map((candidate, index) => (
                  <TableRow
                    key={candidate.candidateId}
                    className={isCompareMode && candidatesToCompare.includes(candidate.candidateId) ? "bg-blue-500/5" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {index < 3 ? getMedalIcon(index + 1) : <span className="font-medium">#{index + 1}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={candidate.avatar} alt={candidate.name} />
                          <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-xs text-muted-foreground">{candidate.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span
                          className={`font-medium ${getScoreColor(
                            candidate.technicalScore
                          )}`}
                        >
                          {(
                            candidate.technicalScore
                          ).toFixed(1)}
                        </span>
                        <div className="w-24 bg-muted h-1.5 rounded-full mt-1">
                          <div
                            className="bg-blue-500 h-full rounded-full"
                            style={{
                              width: `${candidate.technicalScore
                                }%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span
                          className={`font-medium ${getScoreColor(
                            candidate.softScore
                          )}`}
                        >
                          {(
                            candidate.softScore
                          ).toFixed(1)}
                        </span>
                        <div className="w-24 bg-muted h-1.5 rounded-full mt-1">
                          <div
                            className="bg-purple-500 h-full rounded-full"
                            style={{
                              width: `${candidate.softScore
                                }%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-lg font-bold ${getScoreColor(candidate.overallScore)}`}>
                        {candidate.overallScore}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {isCompareMode ? (
                        <Button
                          variant={candidatesToCompare.includes(candidate.candidateId) ? "default" : "outline"}
                          size="sm"
                          className={candidatesToCompare.includes(candidate.candidateId) ? "bg-blue-600 hover:bg-blue-700" : ""}
                          onClick={() => toggleCandidateSelection(candidate.candidateId)}
                        >
                          {candidatesToCompare.includes(candidate.candidateId) ? "Selected" : "Select"}
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(candidate)}>
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Candidate detail dialog */}
      {selectedCandidate && (
        <Dialog open={!!selectedCandidate} onOpenChange={(open) => !open && setSelectedCandidate(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Candidate Details</DialogTitle>
              <DialogDescription>Detailed performance analysis for {selectedCandidate.name}</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedCandidate.avatar} alt={selectedCandidate.name} />
                    <AvatarFallback className="text-2xl">{selectedCandidate.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="mt-2 font-medium text-lg">{selectedCandidate.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCandidate.email}</p>
                  <Badge className={`mt-2 ${getStatusColor(selectedCandidate.status)}`}>
                    {selectedCandidate.status}
                  </Badge>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                    <div className={`text-3xl font-bold ${getScoreColor(selectedCandidate.overallScore)}`}>
                      {selectedCandidate.overallScore}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Rank</div>
                    <div className="text-xl font-semibold">#{getCandidateRank(selectedCandidate)}</div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Interview Date</div>
                    <div className="text-base">{selectedCandidate.interviewDate}</div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <Tabs defaultValue="technical">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="technical">Technical Skills</TabsTrigger>
                    <TabsTrigger value="soft">Soft Skills</TabsTrigger>
                  </TabsList>

                  <TabsContent value="technical" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Technical Skills Assessment</h4>
                      <div className="text-sm">
                        Average:{" "}
                        <span
                          className={`font-bold ${getScoreColor(
                            selectedCandidate.technicalScore
                          )}`}
                        >
                          {(
                            selectedCandidate.technicalScore
                          ).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Overall Technical</span>
                          <span
                            className={`text-sm font-medium ${getScoreColor(
                              selectedCandidate.categoryScores.find(
                                (cat) =>
                                  cat.categoryAssignment.category.categoryName === "Technical"
                              )?.score || 0
                            )}`}
                          >
                            {
                              selectedCandidate.categoryScores.find(
                                (cat) =>
                                  cat.categoryAssignment.category.categoryName === "Technical"
                              )?.score
                            }
                            /100
                          </span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full">
                          <div
                            className={`h-full rounded-full ${getScoreBgColor(
                              selectedCandidate.categoryScores.find(
                                (cat) =>
                                  cat.categoryAssignment.category.categoryName === "Technical"
                              )?.score || 0
                            )}`}
                            style={{
                              width: `${selectedCandidate.categoryScores.find(
                                (cat) =>
                                  cat.categoryAssignment.category.categoryName === "Technical"
                              )?.score || 0
                                }%`,
                            }}
                          />
                        </div>
                      </div>

                    </div>
                  </TabsContent>

                  <TabsContent value="soft" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Soft Skills Assessment</h4>
                      <div className="text-sm">
                        Average:{" "}
                        <span
                          className={`font-bold ${getScoreColor(
                            selectedCandidate.softScore
                          )}`}
                        >
                          {(
                            selectedCandidate.softScore
                          ).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedCandidate.categoryScores
                        .find((cat) => cat.categoryAssignment.category.categoryName === "Soft")
                        ?.categoryAssignment?.SubCategoryAssignment?.map((sub) => {
                          const subScoreEntry = sub.SubCategoryScore.find(
                            (score) => score.categoryScoreId === selectedCandidate.categoryScores.find(
                              (cat) => cat.categoryAssignment.category.categoryName === "Soft"
                            )?.categoryScoreId
                          );

                          const score = subScoreEntry?.score ?? 0;
                          const maxScore = 100;

                          return (
                            <div key={sub.id} className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-sm">{sub.name}</span>
                                <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                                  {score}/{maxScore}
                                </span>
                              </div>
                              <div className="w-full bg-muted h-2 rounded-full">
                                <div
                                  className={`h-full rounded-full ${getScoreBgColor(score)}`}
                                  style={{ width: `${(score / maxScore) * 100}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="h-[300px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        ...selectedCandidate.categoryScores.map((cat) => ({
                          name: cat.categoryAssignment.category.categoryName,
                          score: cat.score,
                          fill: cat.categoryAssignment.category.color,
                        })),
                        ...selectedCandidate.categoryScores.flatMap((cat) =>
                          cat.categoryAssignment.SubCategoryAssignment.map((sub) => {
                            const subScore = sub.SubCategoryScore.find(
                              (sc) => sc.categoryScoreId === cat.categoryScoreId
                            );
                            return {
                              name: sub.name,
                              score: subScore?.score || 0,
                              fill: sub.color,
                            };
                          })
                        ),
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis domain={[0, 100]} />
                      <RechartsTooltip
                        formatter={(value, name) => [`${value}/100`, name]}
                        labelFormatter={(label) => `Skill: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="score" name="Score">
                        {
                          [
                            ...selectedCandidate.categoryScores.map((cat) => ({
                              name: cat.categoryAssignment.category.categoryName,
                              score: cat.score,
                              fill: cat.categoryAssignment.category.color,
                            })),
                            ...selectedCandidate.categoryScores.flatMap((cat) =>
                              cat.categoryAssignment.SubCategoryAssignment.map((sub) => {
                                const subScore = sub.SubCategoryScore.find(
                                  (sc) => sc.categoryScoreId === cat.categoryScoreId
                                );
                                return {
                                  name: sub.name,
                                  score: subScore?.score || 0,
                                  fill: sub.color,
                                };
                              })
                            ),
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between items-center">
              {/* <Badge variant="outline">Interview ID: {selectedCandidate.id}</Badge> */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedCandidate(null)}>
                  Close
                </Button>
                {isCompareMode ? (
                  <Button
                    variant={candidatesToCompare.includes(selectedCandidate.candidateId) ? "default" : "outline"}
                    className={
                      candidatesToCompare.includes(selectedCandidate.candidateId) ? "bg-blue-600 hover:bg-blue-700" : ""
                    }
                    onClick={() => {
                      toggleCandidateSelection(selectedCandidate.candidateId)
                      setSelectedCandidate(null)
                    }}
                  >
                    {candidatesToCompare.includes(selectedCandidate.candidateId)
                      ? "Remove from Comparison"
                      : "Add to Comparison"}
                  </Button>
                ) : (
                  <Button>View Full Profile</Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}