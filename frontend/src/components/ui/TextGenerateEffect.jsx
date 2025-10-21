import React from "react";
import { motion, stagger, useAnimate } from "framer-motion";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  
  React.useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
      },
      {
        duration: duration,
        delay: stagger(0.1),
      }
    );
  }, [animate, duration]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className={`${filter ? "text-shadow-none" : ""} opacity-0`}
              style={{
                filter: filter ? "blur(0px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={className}>
      {renderWords()}
    </div>
  );
};