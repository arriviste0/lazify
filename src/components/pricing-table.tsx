'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PricingPlan {
  title: string;
  description: string;
  price: {
    usd: string;
    inr: string;
  };
  features: string[];
  isPopular?: boolean;
  cta: string;
}

const plans: PricingPlan[] = [
  {
    title: 'Starter',
    description: 'Perfect for individuals and small projects getting started with AI.',
    price: { usd: '$49', inr: '₹1,999' },
    features: ['1 AI Agent', 'Basic Automation', 'Email Support'],
    isPopular: false,
    cta: 'Choose Starter',
  },
  {
    title: 'Pro',
    description: 'For power users and small teams who need advanced automation.',
    price: { usd: '$149', inr: '₹4,999' },
    features: ['All Starter Features', 'Advanced AI Agents', 'API Access', 'Priority Support'],
    isPopular: true,
    cta: 'Get Started with Pro',
  },
  {
    title: 'Enterprise',
    description: 'Tailored solutions for large organizations with specific needs.',
    price: { usd: 'Custom', inr: 'Custom' },
    features: ['Custom AI Agents', 'Dedicated Account Manager', 'On-Premise Deployment', '24/7 Support'],
    isPopular: false,
    cta: 'Contact Sales',
  },
];

export function PricingTable() {
  const [currency, setCurrency] = useState<'usd' | 'inr'>('usd');

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'usd' ? 'inr' : 'usd'));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-12 space-x-3">
        <Label htmlFor="currency-toggle" className={`transition-colors ${currency === 'usd' ? 'text-primary' : 'text-muted-foreground'}`}>
          USD ($)
        </Label>
        <Switch
          id="currency-toggle"
          checked={currency === 'inr'}
          onCheckedChange={toggleCurrency}
          aria-label="Toggle currency between USD and INR"
        />
        <Label htmlFor="currency-toggle" className={`transition-colors ${currency === 'inr' ? 'text-primary' : 'text-muted-foreground'}`}>
          INR (₹)
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
            className={cn(
              "relative flex flex-col h-full",
              plan.isPopular ? 'popular-plan' : ''
            )}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-full shadow-lg">
                Most Popular
              </div>
            )}
            <Card className={cn(
              "modern-card flex flex-col flex-grow",
              plan.isPopular 
                ? 'border-2 border-primary shadow-primary/20' 
                : 'hover:border-primary/40'
            )}>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-center">{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {plan.price[currency]}
                  </span>
                  {plan.price.usd !== 'Custom' && (
                    <span className="text-muted-foreground">{plan.price.usd !== 'Custom' ? `/ month` : ''}</span>
                  )}
                </div>
                <ul className="space-y-3 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${plan.isPopular ? 'cta-button' : 'outline-button-glow'}`}
                  variant={plan.isPopular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

