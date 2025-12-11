import React from "react";

interface TitleProps {
  text: string;
  subText?: string;
}

const Title: React.FC<TitleProps> = ({ text, subText }) => {
  return (
    <div className="text-center mb-4 mt-4">
      <h1 className="fw-bold display-6 display-md-5 display-lg-4">{text}</h1>
      {subText && <p className="text-muted fs-6 fs-md-5 mt-2">{subText}</p>}
    </div>
  );
};

export default Title;
