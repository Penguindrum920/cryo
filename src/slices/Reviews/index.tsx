"use client";

import { Canvas } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Suspense, useRef } from "react";

import { Bounded } from "@/components/Bounded";
import { ReviewsKeyboardScene } from "@/slices/Reviews/Scene";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const reviews = [
  {
    quote:
      "Cryo became the drink our team reaches for before every late-night build. It tastes bright, stays crisp, and the cans look unreal on a desk.",
    name: "Maya Chen",
    role: "Creative director, Northline Studio",
  },
  {
    quote:
      "Frostbite Berry is sharp without turning syrupy. It feels like a proper cold soda instead of another heavy energy drink.",
    name: "Andre Patel",
    role: "Product designer",
  },
  {
    quote:
      "The flavours hit fast, the finish stays clean, and the can design makes the whole thing feel premium.",
    name: "Sofia Reyes",
    role: "Cafe owner",
  },
  {
    quote:
      "Cosmic Crush is the one I keep buying. Grape, kiwi, cold fizz, no weird aftertaste.",
    name: "Noah Brooks",
    role: "Motion artist",
  },
];

const REVIEW_HEADING = "Learn what our customers have to say about us.";

export default function Reviews() {
  const typedHeadingRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const headingText = typedHeadingRef.current;
      const typeState = { count: 0 };

      gsap.set(".reviews-keyboard-wrap", { opacity: 0, y: 54, scale: 0.96 });
      gsap.set(".reviews-card", { opacity: 0, y: 72, scale: 0.94 });
      gsap.set(".reviews-heading-wrap", { opacity: 1, y: 0, scale: 1 });

      const updateHeadingText = () => {
        if (!headingText) return;
        headingText.textContent = REVIEW_HEADING.slice(
          0,
          Math.round(typeState.count),
        );
      };

      updateHeadingText();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".reviews-section",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      tl.to(
        typeState,
        {
          count: REVIEW_HEADING.length,
          duration: 0.48,
          ease: "none",
          snap: { count: 1 },
          onUpdate: updateHeadingText,
        },
        0.04,
      )
        .to(
          ".reviews-keyboard-wrap",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
          },
          0.02,
        )
        .to(
          ".reviews-keyboard-wrap",
          {
            opacity: 1,
            duration: 0.48,
          },
          0.18,
        )
        .to(
          ".reviews-keyboard-wrap",
          {
            opacity: 0,
            y: -92,
            scale: 1.08,
            duration: 0.12,
            ease: "power2.in",
          },
          0.72,
        )
        .to(
          ".reviews-heading-wrap",
          {
            opacity: 0,
            y: -128,
            scale: 0.96,
            duration: 0.14,
            ease: "power2.in",
          },
          0.86,
        )
        .to(
          ".reviews-card",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
            stagger: 0.05,
          },
          1,
        );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (typedHeadingRef.current) {
        typedHeadingRef.current.textContent = REVIEW_HEADING;
      }

      gsap.set(".reviews-heading-wrap, .reviews-keyboard-wrap, .reviews-card", {
        opacity: 1,
        y: 0,
        scale: 1,
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="reviews-section relative h-[285dvh] overflow-clip bg-[#0b0f14] text-[#f5f7ff]">
      <div className="sticky top-0 min-h-dvh overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(245,247,255,0.1),transparent_28rem)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(245,247,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(245,247,255,0.045)_1px,transparent_1px)] bg-[size:44px_44px]" />

        <Bounded className="reviews-heading-wrap relative z-20 pt-14 text-center will-change-transform md:pt-20">
          <p className="text-sm font-black uppercase tracking-[0.36em] text-[#f5f7ff]/70 md:text-base">
            Reviews
          </p>
          <h2
            aria-label={REVIEW_HEADING}
            className="mx-auto mt-4 max-w-5xl text-balance text-4xl font-black uppercase leading-[0.88] tracking-normal text-[#f5f7ff] md:text-6xl lg:text-7xl"
          >
            <span ref={typedHeadingRef} aria-hidden="true" />
            <span
              aria-hidden="true"
              className="reviews-typing-cursor ml-[0.08em] inline-block h-[0.82em] w-[0.08em] translate-y-[0.08em] bg-[#f5f7ff]"
            />
          </h2>
        </Bounded>

        <div className="reviews-keyboard-wrap pointer-events-none absolute inset-x-0 top-[24dvh] z-10 h-[58dvh] opacity-0 md:top-[32dvh] md:h-[60dvh]">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            className="h-full w-full"
          >
            <Suspense fallback={null}>
              <ReviewsKeyboardScene />
            </Suspense>
          </Canvas>
        </div>

        <Bounded className="pointer-events-none absolute inset-x-0 bottom-[5dvh] z-30 md:bottom-[7dvh]">
          <div className="mx-auto grid w-full max-w-6xl gap-3 md:grid-cols-2 lg:grid-cols-4">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="reviews-card border-[#f5f7ff]/18 rounded-lg border bg-[#f5f7ff]/10 p-4 text-center opacity-0 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-5"
              >
                <div className="mb-3 flex justify-center gap-1 text-base text-[#f5f7ff] md:text-lg">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} aria-hidden="true">
                      *
                    </span>
                  ))}
                </div>
                <blockquote className="text-balance text-sm font-black uppercase leading-tight text-[#f5f7ff] md:text-base">
                  <span aria-hidden="true">&quot;</span>
                  {review.quote}
                  <span aria-hidden="true">&quot;</span>
                </blockquote>
                <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-[#f5f7ff]">
                  {review.name}
                </p>
                <p className="text-[#f5f7ff]/68 mt-1 text-xs font-semibold">
                  {review.role}
                </p>
              </article>
            ))}
          </div>
        </Bounded>
      </div>
    </section>
  );
}
