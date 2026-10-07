// Illustrative guest activity only — never inserted into student records.
export const DASHBOARD_PREVIEW = {
  name: "Manya",
  attendance: [true, true, true, false, true, false, true],
  planDay: 8,
  streaks: [
    { user_id: "sample-1", full_name: "Manya", streak_days: 21 },
    { user_id: "sample-2", full_name: "Ananya", streak_days: 18 },
    { user_id: "sample-3", full_name: "Priya", streak_days: 15 },
    { user_id: "sample-4", full_name: "Arjun", streak_days: 12 },
    { user_id: "sample-5", full_name: "Rohit", streak_days: 10 },
  ],
  posts: [
    { id: "revision", author: "Riya Sharma", category: "Progress", time: "2h ago", content: "Completed today’s revision ✅\nFeeling productive! Let’s keep going everyone 💪✨", likes: 48, comments: 12 },
    { id: "focus", author: "Arjun Patel", category: "Study Tips", time: "3h ago", content: "One chapter, one focused session at a time. Keeping my phone away made all the difference today!", likes: 32, comments: 6 },
    { id: "habit", author: "Ananya Singh", category: "Motivation", time: "4h ago", content: "Small steps every morning add up. Show up for yourself — you’ve got this! ☀️", likes: 27, comments: 4 },
    { id: "doubt", author: "Priya Verma", category: "Doubts", time: "5h ago", content: "How do you balance revision and mock tests? I’m planning my next study week.", likes: 16, comments: 8 },
  ],
};