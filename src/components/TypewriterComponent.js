import { useEffect, useState } from "react";

export const TypewriterComponent = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const words = [
    'Find nearby cash exchange partners',
    'Convert upi to cash easily.',
    'Change denomination easily.'
  ];

  useEffect(() => {
    const handleTyping = () => {
      const currentWord = words[wordIndex];
      const shouldDelete = isDeleting
        ? text.length > 0
        : text.length < currentWord.length;

      if (shouldDelete) {
        setText(
          isDeleting
            ? currentWord.substring(0, text.length - 1)
            : currentWord.substring(0, text.length + 1)
        );
        setTypingSpeed(isDeleting ? 50 : 100);
      } else {
        if (isDeleting) {
          setWordIndex((prev) => (prev + 1) % words.length);
          setIsDeleting(false);
          setTypingSpeed(100);
        } else {
          setIsDeleting(true);
          setTypingSpeed(1000); // Pause before deleting
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, typingSpeed, words]);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-75 bg-light">
      <div className="card shadow-lg p-5 text-center w-100">
        <h1 className="display-4 mb-4 text-success" style={{fontFamily:'sans-serif'}}>RupeeSwap</h1>
        <div className="fs-3 text-secondary mb-4" style={{ minHeight: '2em' }}>
          {text}
          <span className="blink-caret">|</span>
        </div>
        
      </div>
    </div>
  );
};
const style = document.createElement('style');
style.textContent = `
  .blink-caret {
    animation: blink 0.75s step-end infinite;
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
`;
document.head.appendChild(style);

