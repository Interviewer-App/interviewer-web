import { Clock, Code2, Calendar, Users } from "lucide-react"

export const INTERVIEW_CATEGORY = [
  { id: "upcoming", title: "Upcoming Interviews", variant: "outline" },
  { id: "completed", title: "Completed", variant: "secondary" },
  { id: "succeeded", title: "Succeeded", variant: "default" },
  { id: "failed", title: "Failed", variant: "destructive" }
]

export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00"
]

export const QUICK_ACTIONS = [
  {
    icon: Code2,
    title: "New Call",
    description: "Start an instant call",
    color: "primary",
    gradient: "from-primary/10 via-primary/5 to-transparent"
  },
  {
    icon: Users,
    title: "Join Interview",
    description: "Enter via invitation link",
    color: "purple-500",
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent"
  },
  {
    icon: Calendar,
    title: "Schedule",
    description: "Plan upcoming interviews",
    color: "blue-500",
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent"
  },
  {
    icon: Clock,
    title: "Recordings",
    description: "Access past interviews",
    color: "orange-500",
    gradient: "from-orange-500/10 via-orange-500/5 to-transparent"
  }
]

export const CODING_QUESTIONS = [
  {
    id: "two-sum",
    title: "Two Sum",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers in the array such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]"
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
      python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
    }
}`
    },
    constraints: [
      "2 ≤ nums.length ≤ 104",
      "-109 ≤ nums[i] ≤ 109",
      "-109 ≤ target ≤ 109",
      "Only one valid answer exists."
    ]
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]'
      }
    ],
    starterCode: {
      javascript: `function reverseString(s) {
  // Write your solution here
  
}`,
      python: `def reverse_string(s):
    # Write your solution here
    pass`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // Write your solution here
        
    }
}`
    }
  },
  {
    id: "palindrome-number",
    title: "Palindrome Number",
    description:
      "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.",
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation:
          "121 reads as 121 from left to right and from right to left."
      },
      {
        input: "x = -121",
        output: "false",
        explanation:
          "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
      }
    ],
    starterCode: {
      javascript: `function isPalindrome(x) {
  // Write your solution here
  
}`,
      python: `def is_palindrome(x):
    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean isPalindrome(int x) {
        // Write your solution here
        
    }
}`
    }
  }
]

export const LANGUAGES = [
  { id: "javascript", name: "JavaScript", icon: "https://img.icons8.com/?size=100&id=108784&format=png&color=000000" },
  { id: "python", name: "Python", icon: "https://img.icons8.com/?size=100&id=13441&format=png&color=000000" },
  { id: "java", name: "Java", icon: "https://img.icons8.com/?size=100&id=13679&format=png&color=000000" }
]

export const imageUrls = [
  { name: "Alex", skillLevel: 78, technicalLevel: 88, behevioralLevel: 68, url: "/icons/emoji1.png" },
  { name: "Sophia", skillLevel: 80, technicalLevel: 90, behevioralLevel: 70, url: "/icons/emoji2.png" },
  { name: "Liam", skillLevel: 77, technicalLevel: 85, behevioralLevel: 69, url: "/icons/emoji3.png" },
  { name: "Emma", skillLevel: 79, technicalLevel: 92, behevioralLevel: 66, url: "/icons/emoji4.png" },
  { name: "Noah", skillLevel: 76, technicalLevel: 84, behevioralLevel: 68, url: "/icons/emoji5.png" },
  { name: "Olivia", skillLevel: 82, technicalLevel: 94, behevioralLevel: 70, url: "/icons/emoji6.png" },
  { name: "Ethan", skillLevel: 81, technicalLevel: 93, behevioralLevel: 69, url: "/icons/emoji7.png" },
  { name: "Ava", skillLevel: 77, technicalLevel: 86, behevioralLevel: 68, url: "/icons/emoji8.png" },
  { name: "Mason", skillLevel: 85, technicalLevel: 95, behevioralLevel: 75, url: "/icons/emoji9.png" },
  { name: "Isabella", skillLevel: 70, technicalLevel: 80, behevioralLevel: 60, url: "/icons/emoji10.png" },
  { name: "James", skillLevel: 72, technicalLevel: 82, behevioralLevel: 62, url: "/icons/emoji11.png" },
  { name: "Mia", skillLevel: 73, technicalLevel: 85, behevioralLevel: 61, url: "/icons/emoji12.png" },
  { name: "Benjamin", skillLevel: 74, technicalLevel: 84, behevioralLevel: 64, url: "/icons/emoji13.png" },
  { name: "Charlotte", skillLevel: 65, technicalLevel: 75, behevioralLevel: 55, url: "/icons/emoji14.png" },
  { name: "Lucas", skillLevel: 61, technicalLevel: 71, behevioralLevel: 51, url: "/icons/emoji15.png" },
  { name: "Amelia", skillLevel: 63, technicalLevel: 73, behevioralLevel: 53, url: "/icons/emoji16.png" },
  { name: "William", skillLevel: 59, technicalLevel: 69, behevioralLevel: 49, url: "/icons/emoji17.png" },
  { name: "Harper", skillLevel: 55, technicalLevel: 65, behevioralLevel: 45, url: "/icons/emoji18.png" },
  { name: "Elijah", skillLevel: 54, technicalLevel: 64, behevioralLevel: 44, url: "/icons/emoji19.png" },
  { name: "Evelyn", skillLevel: 58, technicalLevel: 68, behevioralLevel: 48, url: "/icons/emoji20.png" },
  { name: "Jack", skillLevel: 50, technicalLevel: 60, behevioralLevel: 40, url: "/icons/emoji21.png" },
  { name: "Henry", skillLevel: 45, technicalLevel: 55, behevioralLevel: 35, url: "/icons/emoji22.png" },
  { name: "Scarlett", skillLevel: 30, technicalLevel: 40, behevioralLevel: 20, url: "/icons/emoji23.png" },
  { name: "Daniel", skillLevel: 25, technicalLevel: 35, behevioralLevel: 15, url: "/icons/emoji24.png" },
  { name: "Victoria", skillLevel: 28, technicalLevel: 38, behevioralLevel: 18, url: "/icons/emoji25.png" },
  { name: "Matthew", skillLevel: 29, technicalLevel: 39, behevioralLevel: 19, url: "/icons/emoji26.png" },
  { name: "Lily", skillLevel: 80, technicalLevel: 92, behevioralLevel: 68, url: "/icons/emoji27.png" },
  { name: "Joseph", skillLevel: 82, technicalLevel: 95, behevioralLevel: 69, url: "/icons/emoji28.png" },
  { name: "Chloe", skillLevel: 79, technicalLevel: 91, behevioralLevel: 67, url: "/icons/emoji29.png" },
  { name: "Samuel", skillLevel: 77, technicalLevel: 90, behevioralLevel: 64, url: "/icons/emoji30.png" },
  { name: "Aria", skillLevel: 81, technicalLevel: 94, behevioralLevel: 68, url: "/icons/emoji31.png" },
  { name: "David", skillLevel: 76, technicalLevel: 89, behevioralLevel: 63, url: "/icons/emoji32.png" },
  { name: "Madison", skillLevel: 85, technicalLevel: 98, behevioralLevel: 72, url: "/icons/emoji33.png" },
  { name: "Carter", skillLevel: 88, technicalLevel: 99, behevioralLevel: 77, url: "/icons/emoji34.png" },
  { name: "Hannah", skillLevel: 75, technicalLevel: 87, behevioralLevel: 63, url: "/icons/emoji35.png" },
  { name: "Owen", skillLevel: 70, technicalLevel: 82, behevioralLevel: 58, url: "/icons/emoji36.png" },
  { name: "Avery", skillLevel: 60, technicalLevel: 72, behevioralLevel: 48, url: "/icons/emoji37.png" }
];

export const musicEmoji = [
  { name: "Alex", skillLevel: 78, technicalLevel: 88, behevioralLevel: 68, url: "/icons/music/emoji1.png" },
  { name: "Sophia", skillLevel: 80, technicalLevel: 90, behevioralLevel: 70, url: "/icons/music/emoji2.png" },
  { name: "Liam", skillLevel: 77, technicalLevel: 85, behevioralLevel: 69, url: "/icons/music/emoji3.png" },
  { name: "Emma", skillLevel: 79, technicalLevel: 92, behevioralLevel: 66, url: "/icons/music/emoji4.png" },
  { name: "Noah", skillLevel: 76, technicalLevel: 84, behevioralLevel: 68, url: "/icons/music/emoji5.png" },
  { name: "Olivia", skillLevel: 82, technicalLevel: 94, behevioralLevel: 70, url: "/icons/music/emoji6.png" },
  { name: "Ethan", skillLevel: 81, technicalLevel: 93, behevioralLevel: 69, url: "/icons/music/emoji7.png" },
  { name: "Ava", skillLevel: 77, technicalLevel: 86, behevioralLevel: 68, url: "/icons/music/emoji8.png" },
  { name: "Mason", skillLevel: 85, technicalLevel: 95, behevioralLevel: 75, url: "/icons/music/emoji9.png" },
  { name: "Isabella", skillLevel: 70, technicalLevel: 80, behevioralLevel: 60, url: "/icons/music/emoji10.png" },
]
export const developerEmoji = [
  { name: "James", skillLevel: 72, technicalLevel: 82, behevioralLevel: 62, url: "/icons/dev/emoji1.png" },
  { name: "Mia", skillLevel: 73, technicalLevel: 85, behevioralLevel: 61, url: "/icons/dev/emoji2.png" },
  { name: "Benjamin", skillLevel: 74, technicalLevel: 84, behevioralLevel: 64, url: "/icons/dev/emoji3.png" },
  { name: "Charlotte", skillLevel: 65, technicalLevel: 75, behevioralLevel: 55, url: "/icons/dev/emoji4.png" },
  { name: "Lucas", skillLevel: 61, technicalLevel: 71, behevioralLevel: 51, url: "/icons/dev/emoji5.png" },
  { name: "Amelia", skillLevel: 63, technicalLevel: 73, behevioralLevel: 53, url: "/icons/dev/emoji6.png" },
  { name: "William", skillLevel: 59, technicalLevel: 69, behevioralLevel: 49, url: "/icons/dev/emoji7.png" },
  { name: "Harper", skillLevel: 55, technicalLevel: 65, behevioralLevel: 45, url: "/icons/dev/emoji8.png" },
  { name: "Elijah", skillLevel: 54, technicalLevel: 64, behevioralLevel: 44, url: "/icons/dev/emoji9.png" },
  { name: "Evelyn", skillLevel: 58, technicalLevel: 68, behevioralLevel: 48, url: "/icons/dev/emoji10.png" }
]
export const accountantEmoji = [
  { name: "Scarlett", skillLevel: 30, technicalLevel: 40, behevioralLevel: 20, url: "/icons/accountant/emoji1.png" },
  { name: "Daniel", skillLevel: 25, technicalLevel: 35, behevioralLevel: 15, url: "/icons/accountant/emoji2.png" },
  { name: "Victoria", skillLevel: 28, technicalLevel: 38, behevioralLevel: 18, url: "/icons/accountant/emoji3.png" },
  { name: "Matthew", skillLevel: 29, technicalLevel: 39, behevioralLevel: 19, url: "/icons/accountant/emoji4.png" },
  { name: "Lily", skillLevel: 80, technicalLevel: 92, behevioralLevel: 68, url: "/icons/accountant/emoji5.png" },
  { name: "Joseph", skillLevel: 82, technicalLevel: 95, behevioralLevel: 69, url: "/icons/accountant/emoji6.png" },
  { name: "Chloe", skillLevel: 79, technicalLevel: 91, behevioralLevel: 67, url: "/icons/accountant/emoji7.png" },
  { name: "Samuel", skillLevel: 77, technicalLevel: 90, behevioralLevel: 64, url: "/icons/accountant/emoji8.png" },
  { name: "Aria", skillLevel: 81, technicalLevel: 94, behevioralLevel: 68, url: "/icons/accountant/emoji9.png" },
  { name: "David", skillLevel: 76, technicalLevel: 89, behevioralLevel: 63, url: "/icons/accountant/emoji10.png" }
]

export const designerEmoji = [
  { name: "Carter", skillLevel: 88, technicalLevel: 99, behevioralLevel: 77, url: "/icons/design/emoji1.png" },
  { name: "Hannah", skillLevel: 75, technicalLevel: 87, behevioralLevel: 63, url: "/icons/design/emoji2.png" },
  { name: "Owen", skillLevel: 70, technicalLevel: 82, behevioralLevel: 58, url: "/icons/design/emoji3.png" },
  { name: "Avery", skillLevel: 60, technicalLevel: 72, behevioralLevel: 48, url: "/icons/design/emoji4.png" },
  { name: "Jack", skillLevel: 50, technicalLevel: 60, behevioralLevel: 40, url: "/icons/design/emoji5.png" },
  { name: "Henry", skillLevel: 45, technicalLevel: 55, behevioralLevel: 35, url: "/icons/design/emoji6.png" },
  { name: "Ethan", skillLevel: 81, technicalLevel: 93, behevioralLevel: 69, url: "/icons/design/emoji7.png" },
  { name: "Ava", skillLevel: 77, technicalLevel: 86, behevioralLevel: 68, url: "/icons/design/emoji8.png" },
  { name: "Mason", skillLevel: 85, technicalLevel: 95, behevioralLevel: 75, url: "/icons/design/emoji9.png" },
  { name: "Isabella", skillLevel: 70, technicalLevel: 80, behevioralLevel: 60, url: "/icons/design/emoji10.png" }
]
