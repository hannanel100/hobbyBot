import { useState } from "react";
import Button from "~/components/Button";
import { IoArrowBack, IoRefresh } from "react-icons/io5";
import Card from "~/components/Card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";
interface Question {
  question: string;
  options: string[];
}
const questions: Question[] = [
  {
    question: "What kind of outdoor activities do you enjoy?",
    options: ["Hiking", "Camping", "Fishing", "Biking"],
  },
  {
    question: "Do you prefer solitary or group activities?",
    options: ["Solitary", "Group", "Both", "Depends on the activity"],
  },
  {
    question: "How much time do you have to dedicate to a hobby?",
    options: [
      "Less than 1 hour per week",
      "1-3 hours per week",
      "3-5 hours per week",
      "More than 5 hours per week",
    ],
  },
  {
    question: "Do you enjoy creative or analytical pursuits?",
    options: ["Creative", "Analytical", "Both", "Depends on the activity"],
  },
  // {
  //   question: "What kind of physical activities do you enjoy?",
  //   options: ["Running", "Swimming", "Yoga", "Weightlifting"],
  // },
  // {
  //   question: "Do you prefer indoor or outdoor activities?",
  //   options: ["Indoor", "Outdoor", "Both", "Depends on the activity"],
  // },
  // {
  //   question: "How important is socializing to you?",
  //   options: [
  //     "Very important",
  //     "Somewhat important",
  //     "Not important",
  //     "Depends on the activity",
  //   ],
  // },
  // {
  //   question: "Do you enjoy reading or watching movies/TV shows?",
  //   options: ["Reading", "Watching", "Both", "Neither"],
  // },
  // {
  //   question: "What kind of music do you enjoy?",
  //   options: ["Rock", "Pop", "Hip hop", "Classical"],
  // },
  // {
  //   question: "Do you enjoy working with your hands?",
  //   options: ["Yes", "No", "Depends on the activity", "I'm not sure"],
  // },
  // {
  //   question: "Do you enjoy cooking or baking?",
  //   options: ["Cooking", "Baking", "Both", "Neither"],
  // },
  // {
  //   question: "Do you enjoy playing games?",
  //   options: ["Board games", "Video games", "Card games", "Sports games"],
  // },
  // {
  //   question: "What kind of art do you enjoy?",
  //   options: ["Drawing", "Painting", "Sculpture", "None"],
  // },
  // {
  //   question: "Do you enjoy learning about history or science?",
  //   options: ["History", "Science", "Both", "Neither"],
  // },
  // {
  //   question: "Do you enjoy traveling?",
  //   options: [
  //     "Yes, I love it!",
  //     "I like it, but don't do it often",
  //     "I don't really care for it",
  //     "I haven't done it much",
  //   ],
  // },

  // {
  //   question: "Do you enjoy gardening or caring for plants?",
  //   options: [
  //     "Yes, I love it!",
  //     "I do it occasionally",
  //     "I don't really do it",
  //     "I haven't done it much",
  //   ],
  // },
  // {
  //   question: "Do you enjoy attending concerts or live events?",
  //   options: [
  //     "Yes, I love it!",
  //     "I enjoy it occasionally",
  //     "I don't really care for it",
  //     "I haven't done it much",
  //   ],
  // },
  // {
  //   question: "Do you enjoy working on DIY projects or home improvement tasks?",
  //   options: [
  //     "Yes, I love it!",
  //     "I do it occasionally",
  //     "I don't really do it",
  //     "I haven't done it much",
  //   ],
  // },
  // {
  //   question: "Do you enjoy practicing or playing musical instruments?",
  //   options: [
  //     "Yes, I love it!",
  //     "I do it occasionally",
  //     "I don't really do it",
  //     "I haven't done it much",
  //   ],
  // },
  {
    question: "How many hobby ideas do you want to see?",
    options: ["1", "2", "3", "4"],
  },
];
function Form() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const ctx = api.useContext();

  const { mutate, isError, isSuccess, isLoading, reset } =
    api.hobbies.post.useMutation({
      onSuccess: async (data) => {
        console.log("🚀 ~ file: index.tsx:174 ~ onSuccess: ~ data:", data);
        await ctx.hobbies.getAll.invalidate();
        router.push(`/hobbies/${session?.user.id || ""}`);
      },
    });
  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      mutate({
        prompt: questions
          .map((question, index) => {
            return `${question.question}: ${newAnswers[index] || ""}`;
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
    if (isError || isSuccess) reset();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex text-4xl font-bold tracking-tight">
          <span className="mr-4 animate-ping">beep</span>
          <span className="mr-4 animate-pulse">boop</span>
          <span className="animate-ping">beep</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto my-4 space-y-4">
        <Card>
          <p>Something went wrong. Please try again.</p>
        </Card>
        <Button onClick={restartHandler}>
          Restart <IoRefresh />
        </Button>
      </div>
    );
  }
  return (
    <div className="container mx-auto my-4 space-y-4">
      <Card>
        <h2 className="mb-4 text-xl font-bold">
          {questions[currentQuestion]?.question}
        </h2>
        <div className="flex flex-col">
          {questions[currentQuestion]?.options.map((option, index) => (
            <label
              key={index}
              className={`mb-2  w-fit cursor-pointer rounded-md p-2 transition-colors duration-200 ease-in-out md:hover:bg-teal-900 md:hover:text-teal-50 md:dark:hover:bg-teal-50 md:dark:hover:text-teal-900`}
            >
              <input
                type="radio"
                name={`question${currentQuestion}`}
                value={option}
                checked={answers[currentQuestion] === option}
                onChange={() => handleAnswer(option)}
                className="mr-2 hidden"
              />
              {option}
            </label>
          ))}
        </div>
        {/* find the index of the question and display it */}
        <div className="mx-auto flex justify-center">
          <div>
            <span className="text-teal-500">{currentQuestion + 1}</span>{" "}
            <span>of {questions.length}</span>
          </div>
        </div>
      </Card>

      {currentQuestion > 0 && (
        <div className="flex justify-between">
          <Button onClick={() => prevQuestion()}>
            <IoArrowBack /> Back
          </Button>
          <Button onClick={restartHandler}>
            Restart
            <IoRefresh />
          </Button>
        </div>
      )}
    </div>
  );
}

export default Form;
