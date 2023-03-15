import Form from "./form/page";
import { Greeting } from "./Greeting";
import Title from "./Title";


export default function Home() {
  return (
    <main>
      {/* a form, that has 20 questions, each with 4 options to choose.  */}
      {/* explain what this app does, click start to start answering the questions */}
      {/* when you click start, the first question will appear */}
      <Greeting />
    </main>
  );
}
