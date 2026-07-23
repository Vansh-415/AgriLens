import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-earth-500 hover:text-earth-900 transition-colors">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          const href = `/${paths.slice(0, index + 1).join('/')}`;
          const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);

          return (
            <li key={path} aria-current={isLast ? 'page' : undefined}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-earth-400" />
                {isLast ? (
                  <span className="ml-1 text-sm font-medium text-earth-900 md:ml-2">{formattedPath}</span>
                ) : (
                  <Link to={href} className="ml-1 text-sm font-medium text-earth-500 hover:text-earth-900 md:ml-2 transition-colors">
                    {formattedPath}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
