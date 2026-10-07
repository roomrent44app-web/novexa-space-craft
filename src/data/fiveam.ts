export const CONTACT = {
  brand: "5AM",
  mobile: "+91 8400122294",
  tel: "+918400122294",
  whatsapp: "918400122294",
  email: "brandhousstudio@gmail.com",
  address: "Lucknow, India",
  domain: "5am.co.in",
};

export const WEEKLY_PLANS = [
  { days: 3, calls: 3, price: 0, freeTrial: true },
  { days: 5, calls: 5, price: 199 },
  { days: 7, calls: 7, price: 249, popular: true },
];

export const PLANS_PAGE_WEEKLY = [
  { days: 3, calls: 3, price: 0, freeTrial: true },
  { days: 4, calls: 4, price: 199 },
  { days: 6, calls: 6, price: 249 },
];

export const TRIAL_PLAN = { code: "trial-3d", name: "3 Days Free Trial", days: 3, calls: 3, price: 0 };

export const MONTHLY_PLANS = [
  { days: 9, calls: 9, price: 499, freeTrial: false },
  { days: 15, calls: 15, price: 799, freeTrial: false },
  { days: 21, calls: 21, price: 1099, popular: true, freeTrial: false },
];

export const PURCHASE_PLANS = [
  TRIAL_PLAN,
  ...[PLANS_PAGE_WEEKLY[1], PLANS_PAGE_WEEKLY[2], ...MONTHLY_PLANS].map((plan) => ({
    ...plan,
    code: `${plan.days}d-${plan.price}`,
    name: `${plan.days} Days Plan`,
  })),
];

export const FEATURES = [
  { icon: "Users", title: "Live Study Sessions", text: "Study together with a community" },
  { icon: "Bell", title: "Daily Wake-Up Calls", text: "Get a wake-up call and never miss 5 AM" },
  { icon: "Chart", title: "Stay Consistent", text: "Track progress and build habits" },
  { icon: "Shield", title: "Supportive Community", text: "Surround yourself with like-minded students" },
  { icon: "Book", title: "Be a Better You", text: "Daily motivation and study support" },
];

export const FAQS = [
  { q: "How many wake-up calls will I get and what is the timing?", a: "You will receive **2** follow-up calls on your selected days.\nThe first call is at **4:55 AM** and if you don't answer, the second call will be at **5:10 AM.**" },
  { q: "How will the wake-up call help me?", a: "It is an AI generated reminder call. It motivates you to stand up and take action\nin the moment, so you don't oversleep and can follow your study routine." },
  { q: "Is the amount refundable?", a: "No, the amount is not refundable at any payment." },
  { q: "What should I do after the wake-up call?", a: "After receiving the wake-up call, join our **study link** at 5 AM through the website\nto **study with** students from all over India." },
  { q: "How long are the study sessions?", a: "The study session **starts** at **5 AM** and **continues** till the last student.\nYou can stay as long as you want and study at your own pace." },
  { q: "Can anyone join the community?", a: "Yes! Students from all over India can join. Whether you're preparing for school,\nNEET, UPSC or any other exam, this community is for you." },
];

export const orderLink = (plan = "5AM Study Community") =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hello 5AM, I want to place an order for ${plan}.\n\nName:\nAddress:\nCity:\nState:\nPincode:\nMobile:`)}`;
