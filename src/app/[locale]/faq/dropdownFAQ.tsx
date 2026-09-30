import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React from "react";
import GetQuestions, { type FaqCategory } from "./questions";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

type Props = {
  title: FaqCategory;
};

/**
 * Accordion tanya-jawab satu kategori. Isi jawaban selalu ada di DOM (`forceMount` +
 * disembunyikan lewat CSS saat tertutup) supaya seluruh jawaban terbaca crawler tanpa JS;
 * Radix bawaan melepas konten tertutup dari DOM.
 */
export default function DropdownFAQ({ title }: Props) {
  const questions = GetQuestions();
  const section = questions[title];

  return (
    <div className="mx-auto my-10 w-full">
      <Accordion type="single" collapsible defaultValue="item-1" key={title}>
        <Stagger>
          {section.questions.map((q, idx) => (
            <StaggerItem key={idx}>
              <AccordionItem
                value={`item-${idx + 1}`}
                className="border-b border-border last:border-b-0"
              >
                <AccordionTrigger className="font-display text-lg font-semibold tracking-tight text-foreground md:text-xl">
                  <h3 className="text-left">{q.question}</h3>
                </AccordionTrigger>
                <AccordionPrimitive.Content
                  forceMount
                  className="overflow-hidden text-base leading-relaxed text-muted-foreground data-[state=closed]:hidden data-[state=open]:animate-accordion-down"
                >
                  <div className="whitespace-pre-line pb-4 pt-0">{q.answer}</div>
                </AccordionPrimitive.Content>
              </AccordionItem>
            </StaggerItem>
          ))}
        </Stagger>
      </Accordion>
    </div>
  );
}
