import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <h1 className="text-9xl font-black text-earth-200">404</h1>
      <h2 className="text-3xl font-bold text-earth-900 mt-4 tracking-tight">Page not found</h2>
      <p className="text-earth-500 mt-4 mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link to="/">
        <Button size="lg">Return to Homepage</Button>
      </Link>
    </div>
  );
}
