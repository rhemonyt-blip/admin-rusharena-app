"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const slides = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/dnvlk6ubg/image/upload/v1761876748/banner2_crxpqu.jpg",
    title: "",
    link: "",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/dnvlk6ubg/image/upload/v1761876748/banner1_b0k2ww.jpg",
    title: "",
    link: "",
  },
  {
    id: 3,
    image:
      "https://res.cloudinary.com/dnvlk6ubg/image/upload/v1761876748/banner3_endek3.jpg",
    title: "",
    link: "",
  },
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full sm:w-[90%] h-[200px] sm:h-[600px] overflow-hidden rounded-2xl">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Link href={slide.link}>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-fill"
              priority={index === current}
            />
            {slide.title.length > 1 && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white">
                <h2 className="text-xl font-semibold mb-4">{slide.title}</h2>
              </div>
            )}
          </Link>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}
