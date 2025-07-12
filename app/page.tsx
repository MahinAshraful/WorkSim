import React from 'react';
import Link from 'next/link';
import { ArrowRight, Target, Zap, Users } from 'lucide-react';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { SimulationCard } from '@/components/SimulationCard';
import { JOB_SIMULATIONS } from '@/lib/constants';

export default function Home() {
  const featuredSimulations = JOB_SIMULATIONS.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-100 via-primary-50 to-primary-200 min-h-[60vh] flex items-center overflow-hidden">
        {/* Animated gradient blob accent for hero */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-gradient-to-tr from-primary-400 via-primary-200 to-primary-600 opacity-40 blur-3xl animate-blobPulse z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative animate-fade-in z-10">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-extrabold text-primary-900 mb-8 font-sans drop-shadow-lg">
              Experience Real Jobs.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 animate-fade-in">Before You Apply.</span>
            </h1>
            <p className="text-2xl text-primary-700 mb-10 max-w-3xl mx-auto animate-slide-up font-medium">
              Practice real-world job skills through interactive simulations. From data analysis to product design, 
              get hands-on experience that matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link href="/simulations">
                <Button size="lg" className="group bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold rounded-xl shadow-md hover:from-primary-700 hover:to-primary-600 focus:ring-2 focus:ring-primary-400 focus:outline-none transition-all text-lg py-3 px-8">
                  Explore Simulations
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg" className="rounded-xl text-lg px-8">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/90 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-primary-900 mb-4 font-sans">Why JobSim?</h2>
            <p className="text-xl text-primary-700 max-w-2xl mx-auto font-medium">
              Get practical experience that helps you stand out in your job search
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <Card className="p-8 text-center rounded-2xl shadow-lg border border-primary-100 bg-white/95 animate-slide-up">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Target className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-primary-800">Real-World Scenarios</h3>
              <p className="text-primary-700 font-medium">
                Practice with actual challenges professionals face in their daily work
              </p>
            </Card>

            <Card className="p-8 text-center rounded-2xl shadow-lg border border-primary-100 bg-white/95 animate-slide-up">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Zap className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-primary-800">Instant Feedback</h3>
              <p className="text-primary-700 font-medium">
                Get immediate results and learn from your mistakes in real-time
              </p>
            </Card>

            <Card className="p-8 text-center rounded-2xl shadow-lg border border-primary-100 bg-white/95 animate-slide-up">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Users className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-primary-800">Industry Relevant</h3>
              <p className="text-primary-700 font-medium">
                Simulations designed with input from industry professionals
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Simulations */}
      <section className="py-24 bg-primary-50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-14 gap-6">
            <div className="text-left">
              <h2 className="text-4xl font-extrabold text-primary-900 mb-2 font-sans">Popular Simulations</h2>
              <p className="text-xl text-primary-700">Start with our most popular job simulations</p>
            </div>
            <Link href="/simulations">
              <Button variant="ghost" className="rounded-xl text-primary-700 font-semibold hover:bg-primary-100">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredSimulations.map((simulation) => (
              <SimulationCard key={simulation.id} simulation={simulation} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-700 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-6 font-sans drop-shadow-lg">
            Ready to Start Your Journey?
          </h2>
          <p className="text-2xl text-primary-100 mb-10 font-medium">
            Join thousands of professionals practicing their skills on JobSim
          </p>
          <Link href="/simulations">
            <Button size="lg" variant="secondary" className="rounded-xl text-lg px-10 bg-white/90 text-primary-700 font-bold hover:bg-primary-100">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}