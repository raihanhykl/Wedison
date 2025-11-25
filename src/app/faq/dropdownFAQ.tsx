import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
// import { questions } from "./questions";
// import { Button } from "@/components/ui/button";
import GetQuestions from "./questions";

type Props = {
  // title: keyof typeof questions;
  title: keyof ReturnType<typeof GetQuestions>;
};

// export default function DropdownFAQ() {
export default function DropdownFAQ({ title }: Props) {
  const questions = GetQuestions();
  const section = questions[title];

  return (
    // <div className="w-full max-w-7xl mx-auto my-10">
    <div className="w-full max-w-[2200px] mx-auto my-10">
      {/* <h2 className="text-3xl fnt-bold border-b-3 w-fit border-primary "> */}
      {/* <h2 className="text-3xl font-bold mb-6 uppercase">{section.title}</h2> */}
      <div className=" w-full">
        <Accordion type="single" collapsible defaultValue="item-1">
          {section.questions.map((q, idx) => {
            return (
              <AccordionItem
                key={idx}
                value={`item-${idx + 1}`}
                className=" border-none"
              >
                <AccordionTrigger className="font-medium text-xl tracking-wide">
                  {q.question}
                </AccordionTrigger>
                <AccordionContent className=" tracking-wide ">
                  {q.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
