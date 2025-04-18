import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { User, BarChart3, Clock, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const CandidateProfileCard = ({ candidate, colorTheme,candidateNumber  }) => {
  const getColorClasses = () => {
    switch (colorTheme) {
      case 'indigo':
        return {
          border: 'border-indigo-600/30',
          bg: 'bg-indigo-900/20',
          circle: 'bg-indigo-900/40',
          icon: 'text-indigo-400',
          title: 'text-indigo-400'
        };
      case 'purple':
        return {
          border: 'border-purple-600/30',
          bg: 'bg-purple-900/20',
          circle: 'bg-purple-900/40',
          icon: 'text-purple-400',
          title: 'text-purple-400'
        };
      case 'blue':
        return {
          border: 'border-blue-600/30',
          bg: 'bg-blue-900/20',
          circle: 'bg-blue-900/40',
          icon: 'text-blue-400',
          title: 'text-blue-400'
        };
      case 'emerald':
        return {
          border: 'border-emerald-600/30',
          bg: 'bg-emerald-900/20',
          circle: 'bg-emerald-900/40',
          icon: 'text-emerald-400',
          title: 'text-emerald-400'
        };
      default:
        return {
          border: 'border-indigo-600/30',
          bg: 'bg-indigo-900/20',
          circle: 'bg-indigo-900/40',
          icon: 'text-indigo-400',
          title: 'text-indigo-400'
        };
    }
  };

  const colors = getColorClasses();
  const candidateName = candidate[candidateNumber] || `Candidate ${candidateNumber === 'c1' ? '1' : '2'}`;
  const score = candidate.overall?.score?.[candidateNumber] ?? 'N/A';
  const timeSpent = candidate.overall?.time?.[candidateNumber] ?? 'N/A';
  const strengths = candidate.strengths?.[candidateNumber]?.strengths || [];
  const weaknesses = candidate.strengths?.[candidateNumber]?.weaknesses || [];


  return (
    <Card className={`bg-gray-900/80 ${colors.border} backdrop-blur-sm`}>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${colors.circle}`}>
            <User className={`h-6 w-6 ${colors.icon}`} />
          </div>
          <CardTitle className={`text-lg font-medium ${colors.title}`}>
          {candidateName}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className={`h-5 w-5 ${colors.icon}`} />
              <span className="text-sm font-medium text-gray-300">Overall Score:</span>
            </div>
            <span className="text-xl font-bold text-gray-100">
              {typeof score === 'number' ? score.toFixed(1) : score}/100
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className={`h-5 w-5 ${colors.icon}`} />
              <span className="text-sm font-medium text-gray-300">Time Spent:</span>
            </div>
            <span className="text-xl font-bold text-gray-100">{timeSpent} mins</span>
          </div>
          
          <div className="mt-2 p-3 rounded-lg bg-gray-800/50">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
              <h4 className="font-medium text-gray-200">Key Strengths</h4>
            </div>
            <ul className="space-y-1 list-disc list-inside text-sm pl-1 text-gray-300">
              {strengths.map((strength, index) => (
                <li key={index} className="text-sm">{strength}</li>
              ))}
              {strengths.length === 0 && <li className="text-sm text-gray-500">No strengths listed</li>}
            </ul>
          </div>
          
          <div className="mt-2 p-3 rounded-lg bg-gray-800/50">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowDownCircle className="h-5 w-5 text-red-500" />
              <h4 className="font-medium text-gray-200">Areas for Improvement</h4>
            </div>
            <ul className="space-y-1 list-disc list-inside text-sm pl-1 text-gray-300">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="text-sm">{weakness}</li>
              ))}
              {weaknesses.length === 0 && <li className="text-sm text-gray-500">No weaknesses listed</li>}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateProfileCard;
