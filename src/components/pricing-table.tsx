
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
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
}

const plans: PricingPlan[] = [
  {
    title: 'Starter',
    description: 'For individuals and small teams getting started with automation.',
    price: { usd: '$49', inr: '₹3,999' },
    features: ['1 AI Agent', 'Basic Task Automation', 'Email Support', '500 Operations/mo'],
  },
  {
    title: 'Pro',
    description: 'For growing businesses needing more power and customization.',
    price: { usd: '$149', inr: '₹11,999' },
    features: ['3 AI Agents', 'Advanced Automation Flows', 'Priority Support', '2,000 Operations/mo', 'API Access'],
    isPopular: true,
  },
  {
    title: 'Enterprise',
    description: 'For large organizations requiring dedicated solutions and support.',
    price: { usd: 'Custom', inr: 'Custom' },
    features: ['Unlimited Agents', 'Custom Agent Development', 'Dedicated Account Manager', 'Unlimited Operations', 'Premium SLAs'],
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
            className="relative flex flex-col"
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
              )}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-center">{plan.title}</CardTitle>
                <CardDescription className="text-center pt-1">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-2 pb-6">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">
                    {plan.price[currency]}
                  </span>
                  {plan.price.usd !== 'Custom' && (
                     <span className="text-muted-foreground">/ month</span>
                  )}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  className={`w-full ${plan.isPopular ? 'cta-button' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                  variant={plan.isPopular ? 'default' : 'secondary'}
                >
                  {plan.title === 'Enterprise' ? 'Contact Sales' : 'Choose Plan'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

