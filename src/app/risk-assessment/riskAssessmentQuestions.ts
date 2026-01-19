import { Question } from "@/types/RiskAssessment";

export const riskAssessmentQuestions: Question[] = [
  {
    id: "personal_insurance_experience",
    question: "What is your biggest frustration with insurance?",
    options: [
      { text: "High cost" },
      { text: "Poor customer service" },
      { text: "Lack of transparency" },
      { text: "Claims delays" },
    ],
  },
  {
    id: "personal_insurance_coverage",
    question: "What type of insurance coverage do you need?",
    options: [
      { text: "Auto" },
      { text: "Homeowners / Renters" },
      { text: "Both" },
      //
    ],
  },
  {
    id: "personal_insurance_bundle",
    question: "Do you currently bundle your home and auto insurance?",
    options: [
      { text: "Yes", points: 0 },
      { text: "No", points: 2 },
      { text: "I would be open to it", points: 1 },
    ],
    showIf: { questionId: "personal_insurance_coverage", answer: ["Both"] },
  },
  {
    id: "home_own_or_rent",
    question: "Do you own or rent your home?",
    options: [
      { text: "Own", points: 0 },
      { text: "Rent", points: 1 },
    ],
    showIf: { questionId: "personal_insurance_coverage", answer: ["Homeowners / Renters", "Both"] },
  },
  {
    id: "home_size",
    question: "What size of home do you live in?",
    options: [
      { text: "Apartment / Townhouse", points: 0 },
      { text: "Small (< 3,000 sq ft)", points: 1 },
      { text: "Medium (3,000-5,000 sq ft)", points: 2 },
      { text: "Large (> 5,000 sq ft)", points: 3 },
    ],

    showIf: { questionId: "home_own_or_rent", answer: ["Own"] },
  },
  {
    id: "home_age",
    question: "How old is your home?",
    options: [
      { text: "Less than 5 years old", points: 0 },
      { text: "5-20 years old", points: 1 },
      { text: "20-50 years old", points: 2 },
      { text: "Over 50 years old", points: 3 },
    ],
    showIf: { questionId: "home_own_or_rent", answer: ["Own"] },
  },
  {
    id: "home_updates",
    question: "Have you made any recent renovations or updates to your home?",
    options: [
      { text: "Major (roof, plumbing, electrical)", points: 0 },
      { text: "Moderate (kitchen/bath remodel, HVAC)", points: 1 },
      { text: "Minor (painting, flooring, fixtures)", points: 2 },
      { text: "No", points: 3 },
    ],
    showIf: { questionId: "home_age", answer: ["20-50 years old", "Over 50 years old"] },
  },
  {
    id: "home_safety",
    question: "Does your home have any safety features?",
    options: [
      { text: "Major (Full security system, fire sprinklers)", points: 0 },
      { text: "Moderate (Doorbell camera, fenced yard)", points: 1 },
      { text: "Minor (Smoke detectors, carbon monoxide detectors)", points: 2 },
      { text: "No", points: 3 },
    ],
    showIf: { questionId: "personal_insurance_coverage", answer: ["Homeowners / Renters", "Both"] },
  },
  {
    id: "auto_vehicle_amount",
    question: "How many vehicles do you need to insure?",
    options: [
      { text: "1", points: 0 },
      { text: "2", points: 1 },
      { text: "3 or more", points: 2 },
    ],
    showIf: { questionId: "personal_insurance_coverage", answer: ["Auto", "Both"] },
  },
  {
    id: "auto_vehicle_usage",
    question: "What is the primary use of your vehicle(s)?",
    options: [
      { text: "Recreational", points: 0 },
      { text: "Commuting", points: 1 },
      { text: "Business", points: 2 },
    ],
    showIf: { questionId: "personal_insurance_coverage", answer: ["Auto", "Both"] },
  },
  {
    id: "auto_vehicle_description",
    question: "What best describes your vehicle(s)?",
    options: [
      { text: "Economy / small car", points: 0 },
      { text: "Mid-range sedan or SUV", points: 1 },
      { text: "Large SUV or truck", points: 2 },
      { text: "Luxury or sports vehicle", points: 3 },
    ],
    showIf: { questionId: "personal_insurance_coverage", answer: ["Auto", "Both"] },
  },
  {
    id: "auto_driver_under_25",
    question: "How many drivers on your policy are under 25?",
    options: [
      { text: "0", points: 0 },
      { text: "1", points: 1 },
      { text: "2", points: 2 },
      { text: "3 or more", points: 3 },
    ],
    showIf: { questionId: "personal_insurance_coverage", answer: ["Auto", "Both"] },
  },
  {
    id: "auto_driver_behavior_monitoring",
    question: "Do you currently use any driver safety monitoring apps or devices?",
    options: [
      { text: "Yes", points: 0 },
      { text: "No", points: 2 },
      { text: "I would be open to it", points: 1 },
    ],
    showIf: { questionId: "personal_insurance_coverage", answer: ["Auto", "Both"] },
  },
  {
    id: "auto_claims",
    question: "In the past 5 years, have you had any accidents, violations, or tickets?",
    options: [
      { text: "None", points: 0 },
      { text: "1", points: 1 },
      { text: "2", points: 2 },
      { text: "3+", points: 3 },
    ],
    showIf: { questionId: "personal_insurance_coverage", answer: ["Auto", "Both"] },
  },
  {
    id: "personal_insurance_premium_and_deductible",
    question: "Would you prefer:",
    options: [
      { text: "Lower monthly premiums with higher deductibles" },
      { text: "Higher monthly premiums with lower deductibles" },
    ],
  },
  {
    id: "personal_insurance_goal",
    question: "What is your primary goal for insurance?",
    options: [
      { text: "Lowest cost" },
      { text: "Comprehensive coverage" },
      { text: "Balanced approach" },
      //
    ],
  },
];
