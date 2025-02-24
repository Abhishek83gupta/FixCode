import { AnimatePresence, motion} from "framer-motion";
import { FC, useEffect, useState } from "react";
import { TESTIMONIALS } from "../_constants/testimonial";


 const TestimonialSlider: FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'right' | 'left'>('right');
  
    // Automatic sliding
    useEffect(() => {
      const interval = setInterval(() => {
        nextTestimonial();
      }, 5000);
      return () => clearInterval(interval);
    }, [currentIndex]);
  
    const nextTestimonial = () => {
      setDirection('right');
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    };
  
    const testimonialVariants = {
      enter: (direction: 'right' | 'left') => {
        return {
          x: direction === 'right' ? 300 : -300,
          opacity: 0
        };
      },
      center: {
        zIndex: 1,
        x: 0,
        opacity: 1
      },
      exit: (direction: 'right' | 'left') => {
        return {
          zIndex: 0,
          x: direction === 'right' ? -300 : 300,
          opacity: 0
        };
      }
    };
  
    const testimonial = TESTIMONIALS[currentIndex];
  
    return (
      <div className="relative max-w-2xl mx-auto">
        {/* Fixed height container to prevent layout shift */}
        <div className="relative h-[250px]"> {/* Adjust height as needed */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={testimonialVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0 bg-gray-800/50 rounded-lg p-6 text-center flex flex-col justify-center"
            >
              <p className="text-lg text-gray-300 italic mb-4 min-h-[100px]">
                "{testimonial.content}"
              </p>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {testimonial.author}
                </h3>
                <p className="text-gray-400">{testimonial.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
  
        {/* Navigation Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-500 w-4' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  export default TestimonialSlider;