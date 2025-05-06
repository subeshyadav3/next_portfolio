import { useState, useEffect } from "react";

const useInViewAnimation = (threshold: number = 0.8, id: string) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();

        if (rect.top >= 0 && rect.top <= window.innerHeight * threshold) {
          setIsInView(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, id]);

  return isInView;
};

export default useInViewAnimation;
