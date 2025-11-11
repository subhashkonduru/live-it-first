import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HowItWorks } from '@/components/HowItWorks';

const HowItWorksPage = () => (
  <div className="min-h-screen">
    <Navigation />
    <main className="container mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold mb-6">How It Works</h1>
      <HowItWorks />
    </main>
    <Footer />
  </div>
);

export default HowItWorksPage;
