import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';



const ComparisonCharts = ({ comparisonData }) => {
  if (!comparisonData.first || !comparisonData.second) return null;

  const prepareScoreComparisonData = () => {
    return [
      {
        name: comparisonData.first.email,
        score: comparisonData.first.overallScore
      },
      {
        name: comparisonData.second.email,
        score: comparisonData.second.overallScore
      }
    ];
  };

  const prepareStrengthWeaknessData = (candidate) => {
    return [
      { name: 'Strengths', value: candidate.strengths.length, fill: '#22c55e' },
      { name: 'Weaknesses', value: candidate.weaknesses.length, fill: '#ef4444' }
    ];
  };

  const prepareRadarData = () => {
    return [
      { 
        subject: 'Technical Skills', 
        A: comparisonData.first.strengths.length * 10, 
        B: comparisonData.second.strengths.length * 10,
        fullMark: 50 
      },
      { 
        subject: 'Problem Solving', 
        A: 50 - comparisonData.first.weaknesses.length * 10, 
        B: 50 - comparisonData.second.weaknesses.length * 10,
        fullMark: 50 
      },
      { 
        subject: 'Communication', 
        A: comparisonData.first.timeSpent > 45 ? 40 : 30, 
        B: comparisonData.second.timeSpent > 45 ? 40 : 30,
        fullMark: 50 
      },
      { 
        subject: 'Experience', 
        A: comparisonData.first.overallScore * 0.8, 
        B: comparisonData.second.overallScore * 0.8,
        fullMark: 50 
      },
      { 
        subject: 'Team Fit', 
        A: comparisonData.first.strengths.length > comparisonData.first.weaknesses.length ? 40 : 30, 
        B: comparisonData.second.strengths.length > comparisonData.second.weaknesses.length ? 40 : 30,
        fullMark: 50 
      }
    ];
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-gray-100">Performance Analytics</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-gray-400" />
              <CardTitle className="text-lg text-gray-200">Overall Score Comparison</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer 
                config={{
                  score: { theme: { light: "#4f46e5", dark: "#818cf8" } }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareScoreComparisonData()}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#666" />
                    <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888' }} />
                    <YAxis domain={[0, 50]} stroke="#888" tick={{ fill: '#888' }} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="score" name="Overall Score" fill="var(--color-score)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-gray-400" />
              <CardTitle className="text-lg text-gray-200">Strengths vs Weaknesses</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 h-64">
              <div>
                <h4 className="text-center text-sm font-medium mb-2 text-gray-300">{comparisonData.first.name}</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareStrengthWeaknessData(comparisonData.first)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareStrengthWeaknessData(comparisonData.first).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h4 className="text-center text-sm font-medium mb-2 text-gray-300">{comparisonData.second.name}</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareStrengthWeaknessData(comparisonData.second)}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareStrengthWeaknessData(comparisonData.second).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8 border-gray-700 bg-gray-900/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            <CardTitle className="text-lg text-gray-200">Skills Assessment Comparison</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={prepareRadarData()}>
                <PolarGrid stroke="#444" />
                <PolarAngleAxis dataKey="subject" stroke="#888" tick={{ fill: '#ccc' }} />
                <Radar 
                  name={comparisonData.first.name} 
                  dataKey="A" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6} 
                />
                <Radar 
                  name={comparisonData.second.name} 
                  dataKey="B" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.6} 
                />
                <Legend wrapperStyle={{ color: '#ccc' }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ComparisonCharts;
