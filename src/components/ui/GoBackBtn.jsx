import React from "react";
import { ArrowLeft } from "lucide-react";

const GoBackBtn = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleGoBack}
      className="flex items-center px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-blue-600 hover:bg-blue-700 text-white"
      aria-label="Return to previous page"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
    </button>
  );
};

export default GoBackBtn;
