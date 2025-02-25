import { useEffect, useState } from "react";
import "../style/SplitText.css"; // Importamos los estilos

export default function SplitText({ text, delay = 50 }) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    if (visibleChars < text.length) {
      const timeout = setTimeout(() => {
        setVisibleChars((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [visibleChars, text, delay]);

  return (
    <span className="split-text">
      {text.split("").map((char, index) => (
        <span key={index} className={`char ${index < visibleChars ? "visible" : ""}`}>
          {char}
        </span>
      ))}
    </span>
  );
}

