"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { riskAssessmentQuestions } from "@/app/risk-assessment/riskAssessmentQuestions";
import { Answer, Question } from "@/types/RiskAssessment";
import { LoaderCircle } from "lucide-react";

export default function RiskAssessmentPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to calculate visible questions given a set of answers
  const getVisibleQuestions = (answersToUse: Answer[]): Question[] => {
    const getIsVisible = (question: Question): boolean => {
      // If no showIf condition, always show
      if (!question.showIf) return true;

      // Find the dependent question and check if it's visible
      const dependentQuestion = riskAssessmentQuestions.find((q) => q.id === question.showIf!.questionId);

      // The dependent question must be visible
      if (!getIsVisible(dependentQuestion!)) return false;

      // Find the answer to the dependent question
      const dependentAnswer = answersToUse.find((a) => a.questionId === question.showIf!.questionId);

      // Only show if dependent question has been answered with matching value
      if (!dependentAnswer) return false;

      return question.showIf.answer.includes(dependentAnswer.answer);
    };

    return riskAssessmentQuestions.filter(getIsVisible);
  };

  // Filter questions based on showIf conditions
  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);

  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = visibleQuestions.length > 1 && currentQuestionIndex === visibleQuestions.length - 1;

  const handleNext = async () => {
    if (selectedOption !== null) {
      const selectedOptionData = currentQuestion.options[selectedOption];
      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        answer: selectedOptionData.text,
        points: selectedOptionData.points,
      };

      const updatedAnswers = [...answers.filter((a) => a.questionId !== currentQuestion.id), newAnswer];
      setAnswers(updatedAnswers);

      // if last question, calculate score and send to API for analysis
      if (isLastQuestion) {
        let numPointsQuestionsAnswered = 0;
        let totalPoints = 0;

        // calculate total points and number of questions answered with points
        for (const answer of updatedAnswers) {
          if (answer.points !== undefined) {
            numPointsQuestionsAnswered += 1;
            totalPoints += answer.points;
          }
        }

        // calculate final score
        const score = totalPoints / numPointsQuestionsAnswered;

        // determine risk category based on score
        const riskCategory = score > 2 ? "High Risk" : score > 1 ? "Medium Risk" : "Low Risk";

        // send answers and category to API for LLM analysis
        setIsLoading(true);
        try {
          const response = await fetch("/api/analyze-risk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ riskCategory, answers: updatedAnswers }),
          });
          if (!response.ok) throw new Error("Failed to analyze risk");

          router.push("/risk-assessment/results");
        } catch (error) {
          console.error("Error analyzing risk:", error);
          setIsLoading(false);
        }
        return;
      }

      // Move to next question
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      // Calculate visible questions with updated answers
      const nextVisibleQuestions = getVisibleQuestions(updatedAnswers);

      // Load previous answer for next question if it exists
      if (nextVisibleQuestions[nextIndex]) {
        const nextQuestion = nextVisibleQuestions[nextIndex];
        const previousAnswer = updatedAnswers.find((a) => a.questionId === nextQuestion.id);
        if (previousAnswer) {
          const optionIndex = nextQuestion.options.findIndex((opt) => opt.text === previousAnswer.answer);
          setSelectedOption(optionIndex);
        } else {
          setSelectedOption(null);
        }
      } else {
        setSelectedOption(null);
      }
    }
  };

  // navigate to previous question
  const handlePrevious = () => {
    if (!isFirstQuestion) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      const previousQuestion = visibleQuestions[prevIndex];
      const previousAnswer = answers.find((a) => a.questionId === previousQuestion.id);
      if (previousAnswer) {
        const optionIndex = previousQuestion.options.findIndex((opt) => opt.text === previousAnswer.answer);
        setSelectedOption(optionIndex);
      } else {
        setSelectedOption(null);
      }
    }
  };

  // cancel and return to home
  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12 space-y-4">
            <LoaderCircle className="h-10 w-10 animate-spin" />
            <p className="text-lg font-medium">Analyzing assessment...</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-2xl relative">
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
              <div className="space-y-2 min-h-[256px]">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption === index ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={selectedOption === index}
                      onChange={() => setSelectedOption(index)}
                      className="h-4 w-4"
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <div>
                {!isFirstQuestion && (
                  <Button onClick={handlePrevious} variant="outline" disabled={isLoading}>
                    Previous
                  </Button>
                )}
              </div>
              <Button onClick={handleNext} disabled={selectedOption === null || isLoading}>
                {isLastQuestion ? "Complete" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
