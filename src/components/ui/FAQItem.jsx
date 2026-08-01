import Accordion from "./Accordion";

/** Single FAQ disclosure for contexts that do not need a full accordion collection. */
export default function FAQItem({ answer, defaultOpen = false, id, question }) {
  return (
    <Accordion
      defaultOpenIds={defaultOpen ? [id] : []}
      items={[{ content: answer, id, title: question }]}
    />
  );
}
