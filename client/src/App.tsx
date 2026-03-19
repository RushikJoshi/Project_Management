import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  return (
    <AnimatePresence mode="wait">
      <RouterProvider router={router} />
    </AnimatePresence>
  );
};

export default App;
