import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
const Index = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const pictures = [
    {
      src: "/images/6.png",
      scale: scale4,
    },
    {
      src: "/images/1.jpeg",
      scale: scale5,
    },
    {
      src: "/images/7.png",
      scale: scale6,
    },
    {
      src: "/images/3.png",
      scale: scale5,
    },
    {
      src: "/images/4.png",
      scale: scale6,
    },
    {
      src: "/images/1.png",
      scale: scale8,
    },
    {
      src: "/images/3.jpeg",
      scale: scale9,
    },
  ];

  return (
    <div ref={container} className="container">
      <div className="sticky">
        {pictures.map(({ src, scale }, index) => (
          <motion.div key={index} style={{ scale }} className="el">
            <div className="imageContainer">
              <img
                src={src}
                alt="image"
                className="image" // Add class for styling
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Index;
