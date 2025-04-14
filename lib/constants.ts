export const welcomeScreenSlides = [
  {
    id: 0,
    title: "Welcome to FairShare!",
    subtitle: "Split expenses effortlessly with your friends and family.",
    image: require("../assets/images/Welcome Screen/Trip.jpg"),
  },
  {
    id: 1,
    title: "Scan Receipts Instantly",
    subtitle: "Use your camera to scan receipts and split bills in seconds.",
    image: require("../assets/images/Welcome Screen/Receipt.jpg"),
  },
  {
    id: 2,
    title: "Track Group Expenses",
    subtitle: "Keep track of who owes what in real-time.",
    image: require("../assets/images/Welcome Screen/Expense.jpg"),
  },
  {
    id: 3,
    title: "Ready to Simplify Your Expenses?",
    subtitle: "Join FairShare today and make splitting bills a breeze.",
    image: require("../assets/images/Welcome Screen/Welcome.jpg"),
  },
];

export const expenseMemberListTabs = ["Equally", "Shares", "Unequally"];

export function formatDate(timestamp: any): string {
  if (!timestamp || !timestamp.seconds) {
    return "No date";
  }

  // Create date from seconds
  const date = new Date(timestamp.seconds * 1000);

  // Format the date
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
