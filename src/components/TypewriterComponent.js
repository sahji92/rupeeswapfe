import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const TypewriterComponent = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  const words = [
    'Convert upi to cash easily.',
    'Convert cash to upi easily.',
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
    <div className="container d-flex flex-column align-items-center justify-content-around min-vh-100 scroll-hidden p-4">
      <div className="p-5 text-center w-100">
        <h1 className="display-4 mb-4" style={{fontFamily:'Lilita One', color:'#0baa41',fontStyle:'normel',fontWeight:'bold'}}>RupeeSwap</h1>
        <div className="fs-3 text-secondary mb-4" style={{ minHeight: '2em' }}>
          {text}
          <span className="blink-caret">|</span>
        </div>
      <Link className="btn btn-danger"  to='/'><i class="fa fa-map-marker"></i> Find nearby</Link>
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

