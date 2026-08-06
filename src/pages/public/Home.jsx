import React from "react";
import Hero from "../../components/home/Hero";
import PromoStrip from "../../components/home/PromoStrip";
import CategoriesGrid from "../../components/home/CategoriesGrid";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import Testimonials from "../../components/home/Testimonials";
import FAQ from "../../components/home/FAQ";
import About from "../../components/home/About";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
      <PromoStrip />
        <About />
        <section aria-label="Categorías" className="container my-5">
          <CategoriesGrid />
        </section>

        <section aria-label="Productos destacados" className="container my-5">
          <FeaturedProducts />
        </section>

        <section aria-label="Testimonios" className="container my-5">
          <Testimonials />
        </section>

        <section aria-label="Preguntas frecuentes" className="container my-5">
          <FAQ />
        </section>

      </main>
    </>
  );
}
