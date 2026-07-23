import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Leaf, Shield, Smartphone, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export function Landing() {
  useDocumentTitle('AI Cotton Disease Advisory');

  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      name: 'AI-Powered Detection',
      description: 'Instantly diagnose crop diseases using our state-of-the-art machine learning models directly from your smartphone camera.',
      icon: Smartphone,
    },
    {
      name: 'Expert Treatments',
      description: 'Get verified, actionable treatment plans including organic, chemical, and biological methods tailored to the specific disease.',
      icon: Shield,
    },
    {
      name: 'Crop Health Tracking',
      description: 'Maintain a comprehensive history of your scans and monitor the health progress of your fields over time.',
      icon: Activity,
    },
  ];

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1 items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg shadow-sm">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-earth-900">AgriLens</span>
          </div>
          <div className="flex flex-1 justify-end gap-x-4">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero section */}
        <div className="relative isolate px-6 pt-14 lg:px-8 bg-earth-50 overflow-hidden">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight text-earth-900 sm:text-6xl">
                Protect your crops with AI-powered vision
              </h1>
              <p className="mt-6 text-lg leading-8 text-earth-600">
                AgriLens helps farmers instantly identify plant diseases and provides expert treatment recommendations. Secure your harvest and improve crop yield today.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link to="/register">
                  <Button size="lg">Start Scanning Now</Button>
                </Link>
                <Link to="/login" className="text-sm font-semibold leading-6 text-earth-900 hover:text-primary-600 transition-colors">
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Faster Diagnosis</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-earth-900 sm:text-4xl">
              Everything you need to secure your yield
            </p>
            <p className="mt-6 text-lg leading-8 text-earth-600">
              Stop guessing what is wrong with your crops. Get accurate, real-time disease identification and proven agricultural remedies.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.name} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative pl-16"
                >
                  <dt className="text-base font-semibold leading-7 text-earth-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-earth-600">{feature.description}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-earth-900 text-earth-200 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Leaf className="h-6 w-6 text-primary-500" />
            <span className="font-bold text-xl tracking-tight text-white">AgriLens</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} AgriLens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
