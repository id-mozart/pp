import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Requests } from "@/components/sections/Requests";
import { Formats } from "@/components/sections/Formats";
import { Clients } from "@/components/sections/Clients";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactForm } from "@/components/sections/ContactForm";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Pan&Partners",
  founder: { "@type": "Person", name: "Тетяна Пан" },
  description:
    "Корпоративні тренінги, онлайн-курси та консультації з B2B-продажів і переговорів.",
  areaServed: "UA",
  knowsAbout: ["B2B продажі", "Переговори", "Управління продажами"],
  slogan: "Продавайте впевнено та з очікуваним результатом.",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <About />
      <Requests />
      <Formats />
      <Clients />
      <Testimonials />
      <ContactForm />
    </>
  );
}
