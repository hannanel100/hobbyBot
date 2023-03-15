"use client";
import { useState } from "react";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";
interface Question {
  question: string;
  options: string[];
  answer: string;
}
interface Answer {
  answer: {
    role: "assistant";
    content: string;
  };
}
const questions: Question[] = [
  {
    question: "What kind of outdoor activities do you enjoy?",
    options: ["Hiking", "Camping", "Fishing", "Biking"],
    answer: "",
  },
  {
    question: "Do you prefer solitary or group activities?",
    options: ["Solitary", "Group", "Both", "Depends on the activity"],
    answer: "",
  },
  {
    question: "How much time do you have to dedicate to a hobby?",
    options: [
      "Less than 1 hour per week",
      "1-3 hours per week",
      "3-5 hours per week",
      "More than 5 hours per week",
    ],
    answer: "",
  },
  {
    question: "Do you enjoy creative or analytical pursuits?",
    options: ["Creative", "Analytical", "Both", "Depends on the activity"],
    answer: "",
  },
  {
    question: "What kind of physical activities do you enjoy?",
    options: ["Running", "Swimming", "Yoga", "Weightlifting"],
    answer: "",
  },
  {
    question: "Do you prefer indoor or outdoor activities?",
    options: ["Indoor", "Outdoor", "Both", "Depends on the activity"],
    answer: "",
  },
  {
    question: "How important is socializing to you?",
    options: [
      "Very important",
      "Somewhat important",
      "Not important",
      "Depends on the activity",
    ],
    answer: "",
  },
  {
    question: "Do you enjoy reading or watching movies/TV shows?",
    options: ["Reading", "Watching", "Both", "Neither"],
    answer: "",
  },
  {
    question: "What kind of music do you enjoy?",
    options: ["Rock", "Pop", "Hip hop", "Classical"],
    answer: "",
  },
  {
    question: "Do you enjoy working with your hands?",
    options: ["Yes", "No", "Depends on the activity", "I'm not sure"],
    answer: "",
  },
  {
    question: "Do you enjoy cooking or baking?",
    options: ["Cooking", "Baking", "Both", "Neither"],
    answer: "",
  },
  {
    question: "Do you enjoy playing games?",
    options: ["Board games", "Video games", "Card games", "Sports games"],
    answer: "",
  },
  {
    question: "What kind of art do you enjoy?",
    options: ["Drawing", "Painting", "Sculpture", "None"],
    answer: "",
  },
  {
    question: "Do you enjoy learning about history or science?",
    options: ["History", "Science", "Both", "Neither"],
    answer: "",
  },
  {
    question: "Do you enjoy traveling?",
    options: [
      "Yes, I love it!",
      "I like it, but don't do it often",
      "I don't really care for it",
      "I haven't done it much",
    ],
    answer: "",
  },
 
  {
    question: "Do you enjoy gardening or caring for plants?",
    options: [
      "Yes, I love it!",
      "I do it occasionally",
      "I don't really do it",
      "I haven't done it much",
    ],
    answer: "",
  },
  {
    question: "Do you enjoy attending concerts or live events?",
    options: [
      "Yes, I love it!",
      "I enjoy it occasionally",
      "I don't really care for it",
      "I haven't done it much",
    ],
    answer: "",
  },
  {
    question: "Do you enjoy working on DIY projects or home improvement tasks?",
    options: [
      "Yes, I love it!",
      "I do it occasionally",
      "I don't really do it",
      "I haven't done it much",
    ],
    answer: "",
  },
  {
    question: "Do you enjoy practicing or playing musical instruments?",
    options: [
      "Yes, I love it!",
      "I do it occasionally",
      "I don't really do it",
      "I haven't done it much",
    ],
    answer: "",
  },
  {
    question: "How many hobby ideas do you want to see?",
    options: ["1", "2", "3", "4"],
    answer: "",
  }
];
function Form() {
  const queryClientLocal = useQueryClient();
  const mutation = useMutation((data: any) => axios.post("/api/form", data), {
    onSuccess: () => {
      queryClientLocal.invalidateQueries(["form"]);
    },
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      mutation.mutate({
        prompt: questions
          .map((question, index) => {
            return `${question.question}: ${newAnswers[index]}`;
          })
          .join(". "),
      });
    }
  };
  const prevQuestion = () => {
    const prevQuestion = currentQuestion - 1;
    if (prevQuestion >= 0) {
      setCurrentQuestion(prevQuestion);
      //remove last answer
      const newAnswers = [...answers];
      newAnswers.pop();
      setAnswers(newAnswers);
    }
  };
  const restartHandler = () => {
    setCurrentQuestion(0);
    setAnswers([]);
  };

  if (mutation.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex text-4xl font-bold tracking-tight">
          <span className="mr-2 animate-ping">beep</span>
          <span className="mr-2 animate-pulse">boop</span>
          <span className="animate-ping">beep</span>
        </div>
      </div>
    );
  }
  if (mutation.isSuccess) {
    console.log(mutation.data.data);
    const { data }: { data: Answer } = mutation.data;
    console.log("🚀 ~ file: Form.tsx:214 ~ Form ~ data:", data);
    return (
      <div className="container mx-auto my-4">
        <div className="rounded-lg border border-gray-400 p-4">
          <p className="text-white">{data.answer.content}</p>
        </div>
      </div>
    );
  }
  if (mutation.isError) {
    return (
      <div className="container mx-auto my-4">
        <div className="rounded-lg border border-gray-400 p-4">
          <p className="text-white">Something went wrong. Please try again.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto my-4 space-y-4">
      <div className="rounded-lg border border-gray-400 p-4">
        <h2 className="mb-4 text-xl font-bold">
          {questions[currentQuestion].question}
        </h2>
        <div className="flex flex-col">
          {questions[currentQuestion].options.map((option, index) => (
            <label key={index} className="mb-2">
              <input
                type="radio"
                name={`question${currentQuestion}`}
                value={option}
                checked={answers[currentQuestion] === option}
                onChange={() => handleAnswer(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
        {/* find the index of the question and display it */}
        <div className="mx-auto flex justify-center">
          <div className="text-gray-400">
            {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      </div>

      {currentQuestion > 0 && (
        <div className="flex justify-between">
          <button
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            onClick={() => prevQuestion()}
          >
            Back
          </button>
          <button
            className="rounded bg-teal-500 py-2 px-4 font-bold text-white hover:bg-teal-700"
            onClick={restartHandler}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}

export default Form;
