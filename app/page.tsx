import React from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Code2, Palette, Target, Zap, Users } from 'lucide-react';
import { Button } from '@/components/UI/Button';
import { Card } from '@/components/UI/Card';
import { SimulationCard } from '@/components/SimulationCard';
import { JOB_SIMULATIONS } from '@/lib/constants';

export default function Home() {
  const featuredSimulations = JOB_SIMULATIONS.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Experience Real Jobs.
              <span className="block text-primary-600">Before You Apply.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
              Practice real-world job skills through interactive simulations. From data analysis to product design, 
              get hands-on experience that matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link href="/simulations">
                <Button size="lg" className="group">
                  Explore Simulations
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why JobSim?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get practical experience that helps you stand out in your job search
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-World Scenarios</h3>
              <p className="text-gray-600">
                Practice with actual challenges professionals face in their daily work
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
              <p className="text-gray-600">
                Get immediate results and learn from your mistakes in real-time
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Industry Relevant</h3>
              <p className="text-gray-600">
                Simulations designed with input from industry professionals
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Simulations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Simulations</h2>
              <p className="text-lg text-gray-600">Start with our most popular job simulations</p>
            </div>
            <Link href="/simulations">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredSimulations.map((simulation) => (
              <SimulationCard key={simulation.id} simulation={simulation} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of professionals practicing their skills on JobSim
          </p>
          <Link href="/simulations">
            <Button size="lg" variant="secondary">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}