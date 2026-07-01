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
import { Stagger, StaggerItem } from "@/components/motion/stagger";

type Props = {
  // title: keyof typeof questions;
  title: keyof ReturnType<typeof GetQuestions>;
};

// export default function DropdownFAQ() {
export default function DropdownFAQ({ title }: Props) {
  const questions = GetQuestions();
  const section = questions[title];

  return (
    <div className="w-full mx-auto my-10">
      <div className=" w-full">
        <Accordion type="single" collapsible defaultValue="item-1" key={title}>
          <Stagger>
            {section.questions.map((q, idx) => {
              return (
                <StaggerItem key={idx}>
                  <AccordionItem
                    value={`item-${idx + 1}`}
                    className="border-b border-border last:border-b-0"
                  >
                    <AccordionTrigger className="font-display font-semibold text-lg md:text-xl tracking-tight text-foreground">
                      {q.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                      {q.answer}
                    </AccordionContent>
                  </AccordionItem>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Accordion>
      </div>
    </div>
  );
}
