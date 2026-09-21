import { useI18n } from "@/i18n";
import { FAQ_ITEMS } from "@/config/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const { t, locale } = useI18n();

  return (
    <section id="faq" className="border-b py-16">
      <div className="container grid gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{t("home.faqTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            关于数据来源、mock 边界与未移植功能的说明。
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={item.question.en} value={`faq-${index}`}>
              <AccordionTrigger>{item.question[locale]}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.answer[locale]}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
