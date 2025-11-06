import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-6 text-center">{message || 'An unexpected error occurred'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
