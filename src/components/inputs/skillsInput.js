import React, { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const SkillsInput = ({ skills, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    if (!inputValue.trim()) return;
    
    const newSkill = inputValue.trim();
    if (!skills.includes(newSkill)) {
      onChange([...skills, newSkill]);
    }
    setInputValue('');
  };

  const removeSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    onChange(newSkills);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
      removeSkill(skills.length - 1);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="px-3 py-1 font-normal !text-[#3b82f6] !bg-blue-500/30 border !border-blue-500/20">
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="ml-1.5 text-muted-foreground hover:text-foreground transition-colors "
            >
              <X className="h-3 w-3 text-[#3b82f6]" />
              <span className="sr-only">Remove {skill}</span>
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add skill and press Enter"
          className="flex-1"
        />
        <Button
          type="button"
          size="icon"
          variant="outline"
          className=" !bg-white !text-black"
          onClick={addSkill}
          disabled={!inputValue.trim()}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add Skill</span>
        </Button>
      </div>
    </div>
  );
};

export default SkillsInput;
