import { useState } from "react";
import Button from "~/components/Button";
import { IoArrowBack, IoRefresh } from "react-icons/io5";
import Card from "~/components/Card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";
import Loader from "~/components/Loader";
interface Option {
  option: string;
}
interface Question {
  question: string;
  options: Option[];
}
interface Length {
  length: "short" | "default" | "long";
  value?: number;
}
const lengthValueHash = {
  short: 10,
  default: 20,
  long: 40,
};
// const questions: Question[] = [
//   {
//     question: "What kind of outdoor activities do you enjoy?",
//     options: ["Hiking", "Camping", "Fishing", "Biking"],
//   },
//   {
//     question: "Do you prefer solitary or group activities?",
//     options: ["Solitary", "Group", "Both", "Depends on the activity"],
//   },
//   {
//     question: "How much time do you have to dedicate to a hobby?",
//     options: [
//       "Less than 1 hour per week",
//       "1-3 hours per week",
//       "3-5 hours per week",
//       "More than 5 hours per week",
//     ],
//   },
//   {
//     question: "Do you enjoy creative or analytical pursuits?",
//     options: ["Creative", "Analytical", "Both", "Depends on the activity"],
//   },
//   // {
//   //   question: "What kind of physical activities do you enjoy?",
//   //   options: ["Running", "Swimming", "Yoga", "Weightlifting"],
//   // },
//   // {
//   //   question: "Do you prefer indoor or outdoor activities?",
//   //   options: ["Indoor", "Outdoor", "Both", "Depends on the activity"],
//   // },
//   // {
//   //   question: "How important is socializing to you?",
//   //   options: [
//   //     "Very important",
//   //     "Somewhat important",
//   //     "Not important",
//   //     "Depends on the activity",
//   //   ],
//   // },
//   // {
//   //   question: "Do you enjoy reading or watching movies/TV shows?",
//   //   options: ["Reading", "Watching", "Both", "Neither"],
//   // },
//   // {
//   //   question: "What kind of music do you enjoy?",
//   //   options: ["Rock", "Pop", "Hip hop", "Classical"],
//   // },
//   // {
//   //   question: "Do you enjoy working with your hands?",
//   //   options: ["Yes", "No", "Depends on the activity", "I'm not sure"],
//   // },
//   // {
//   //   question: "Do you enjoy cooking or baking?",
//   //   options: ["Cooking", "Baking", "Both", "Neither"],
//   // },
//   // {
//   //   question: "Do you enjoy playing games?",
//   //   options: ["Board games", "Video games", "Card games", "Sports games"],
//   // },
//   // {
//   //   question: "What kind of art do you enjoy?",
//   //   options: ["Drawing", "Painting", "Sculpture", "None"],
//   // },
//   // {
//   //   question: "Do you enjoy learning about history or science?",
//   //   options: ["History", "Science", "Both", "Neither"],
//   // },
//   // {
//   //   question: "Do you enjoy traveling?",
//   //   options: [
//   //     "Yes, I love it!",
//   //     "I like it, but don't do it often",
//   //     "I don't really care for it",
//   //     "I haven't done it much",
//   //   ],
//   // },

//   // {
//   //   question: "Do you enjoy gardening or caring for plants?",
//   //   options: [
//   //     "Yes, I love it!",
//   //     "I do it occasionally",
//   //     "I don't really do it",
//   //     "I haven't done it much",
//   //   ],
//   // },
//   // {
//   //   question: "Do you enjoy attending concerts or live events?",
//   //   options: [
//   //     "Yes, I love it!",
//   //     "I enjoy it occasionally",
//   //     "I don't really care for it",
//   //     "I haven't done it much",
//   //   ],
//   // },
//   // {
//   //   question: "Do you enjoy working on DIY projects or home improvement tasks?",
//   //   options: [
//   //     "Yes, I love it!",
//   //     "I do it occasionally",
//   //     "I don't really do it",
//   //     "I haven't done it much",
//   //   ],
//   // },
//   // {
//   //   question: "Do you enjoy practicing or playing musical instruments?",
//   //   options: [
//   //     "Yes, I love it!",
//   //     "I do it occasionally",
//   //     "I don't really do it",
//   //     "I haven't done it much",
//   //   ],
//   // },
//   {
//     question: "How many hobby ideas do you want to see?",
//     options: ["1", "2", "3", "4"],
//   },
// ];
function Form() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [length, setLength] = useState<Length>({
    length: "default",
    value: 20,
  });
  const ctx = api.useContext();
  const finalQuestion: Question = {
    question: "How many hobby ideas do you want to see?",
    options: [
      { option: "1" },
      { option: "2" },
      { option: "3" },
      { option: "4" },
    ],
  };
  const {
    mutate,
    isError: hobbiesPostIsError,
    isSuccess: hobbiesPostIsSuccess,
    isLoading,
    reset,
  } = api.hobbies.post.useMutation({
    onSuccess: async (data) => {
      console.log("🚀 ~ file: index.tsx:174 ~ onSuccess: ~ data:", data);
      await ctx.hobbies.getAll.invalidate();
      router.push(`/hobbies/${session?.user.id || ""}`);
    },
  });

  const {
    data: questions,
    isLoading: questionsIsLoading,
    isError: questionsIsError,
  } = api.questions.getRandomQuestionsAndOptions.useQuery(
    {
      max: length.value || 20,
    },
    {
      enabled: !!length.value,
      refetchOnWindowFocus: false,
    }
  );

  // This function updates the current length state when a
  // user selects a different length.

  const handleLengthToggle = ({ length }: Length) => {
    setLength({ length, value: lengthValueHash[length] });
  };

  // This function handles the user's answer to a question.
  const handleAnswer = (answer: string) => {
    // Make a copy of the answers array
    const newAnswers = [...answers];
    // Update the copy of the answers array with the new answer
    newAnswers[currentQuestion] = answer;
    // Update the state with the new answers array
    setAnswers(newAnswers);
    // Move on to the next question
    const nextQuestion = currentQuestion + 1;
    // If there are more questions, move to the next question
    if (questions && nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      // Otherwise, submit the answers
    } else {
      mutate({
        // Make a string out of the questions and answers
        prompt: questions
          ? questions
              .map((question, index) => {
                return `${question.question}: ${newAnswers[index] || ""}`;
              })
              .join(". ")
          : "",
      });
    }
  };
  const prevQuestion = () => {
    // get the previous question
    const prevQuestion = currentQuestion - 1;
    // if there is a previous question
    if (prevQuestion >= 0) {
      // set the current question to the previous question
      setCurrentQuestion(prevQuestion);
      // remove the last answer
      const newAnswers = [...answers];
      newAnswers.pop();
      setAnswers(newAnswers);
    }
  };
  // This function handles restarting the quiz
  const restartHandler = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    if (hobbiesPostIsError || hobbiesPostIsSuccess) reset();
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

  if (hobbiesPostIsError) {
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
  if (questionsIsLoading) {
    return (
      <div className="container mx-auto my-4 space-y-4">
        <Card>
          <Loader size="lg" />
        </Card>
      </div>
    );
  }
  return (
    <div className="container mx-auto my-4 space-y-4">
      {/* three buttons, short, default and long default is selected */}
      {currentQuestion === 0 && (
        <div className="flex items-center justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className="rounded-l-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-teal-600 dark:bg-teal-700 dark:text-white dark:hover:bg-teal-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
              onClick={() => handleLengthToggle({ length: "short" })}
            >
              Short
            </button>
            <button
              type="button"
              className="border-t border-b border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-teal-600 dark:bg-teal-700 dark:text-white dark:hover:bg-teal-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
              onClick={() => handleLengthToggle({ length: "default" })}
            >
              Default
            </button>
            <button
              type="button"
              className="rounded-r-md border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-teal-600 dark:bg-teal-700 dark:text-white dark:hover:bg-teal-600 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
              onClick={() => handleLengthToggle({ length: "long" })}
            >
              Long
            </button>
          </div>
        </div>
      )}
      <Card>
        <h2 className="mb-4 text-xl font-bold">
          {questions && questions[currentQuestion]?.question}
        </h2>
        <div className="flex flex-col">
          {questions &&
            questions[currentQuestion]?.options.map((option, index) => {
              const optionString = option.option;
              return (
                <label
                  key={index}
                  className={`mb-2  w-fit cursor-pointer rounded-md p-2 transition-colors duration-200 ease-in-out md:hover:bg-teal-900 md:hover:text-teal-50 md:dark:hover:bg-teal-50 md:dark:hover:text-teal-900`}
                >
                  <input
                    type="radio"
                    name={`question${currentQuestion}`}
                    value={optionString}
                    checked={answers[currentQuestion] === optionString}
                    onChange={() => handleAnswer(optionString)}
                    className="mr-2 hidden"
                  />
                  {optionString}
                </label>
              );
            })}
        </div>
        {/* find the index of the question and display it */}
        <div className="mx-auto flex justify-center">
          <div>
            <span className="text-teal-500">{currentQuestion + 1}</span>{" "}
            <span>of {questions && questions.length}</span>
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
