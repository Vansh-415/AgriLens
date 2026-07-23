export function Footer() {
  return (
    <footer className="border-t border-earth-200 bg-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-earth-500">
          &copy; {new Date().getFullYear()} AgriLens. All rights reserved.
        </p>
        <div className="flex gap-4 mt-4 md:mt-0 text-sm text-earth-500">
          <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
          <a href="#" className="hover:text-primary-600 transition-colors">Help</a>
        </div>
      </div>
    </footer>
  );
}
