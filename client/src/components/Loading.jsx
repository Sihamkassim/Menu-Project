import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;
