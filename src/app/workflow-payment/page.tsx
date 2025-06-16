
'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, CalendarDays, Lock, IndianRupee, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const paymentFormSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be 16 digits.").max(16, "Card number must be 16 digits.").regex(/^\d+$/, "Card number must only contain digits."),
  expiryDate: z.string().min(5, "Expiry date must be MM/YY.").max(5, "Expiry date must be MM/YY.").regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date format (MM/YY)."),
  cvv: z.string().min(3, "CVV must be 3 or 4 digits.").max(4, "CVV must be 3 or 4 digits.").regex(/^\d+$/, "CVV must only contain digits."),
  nameOnCard: z.string().min(2, "Name on card is required."),
});

export default function WorkflowPaymentPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
    },
  });

  async function onSubmit(values: z.infer<typeof paymentFormSchema>) {
    startTransition(async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Simulated payment submitted:', values);

      toast({
        title: 'Payment Successful! (Simulated)',
        description: (
          <div className="flex flex-col gap-1">
            <p>Your AI Workflow Folder (Digital Product) access details would be sent to your email.</p>
            <p className="text-xs text-muted-foreground">Order Total: ₹9.00</p>
          </div>
        ),
        variant: 'default',
      });
      form.reset();
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-teal-900/10 to-background py-8 px-4 md:px-6 flex flex-col items-center">
      <header className="w-full max-w-xl mb-8">
        <Link href="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <Card className="modern-card shadow-2xl border-teal-500/30 bg-card">
          <CardHeader className="text-center border-b border-teal-500/20 pb-6">
            <div className="flex justify-center items-center mb-3">
              <ShieldCheck className="h-12 w-12 text-teal-400" />
            </div>
            <CardTitle className="text-3xl font-bold text-teal-400">Secure Checkout</CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              AI Workflow Folder - Get Instant Access!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashed border-border">
              <span className="text-foreground font-medium">Product: AI Workflow Folder</span>
              <span className="text-2xl font-bold text-teal-400 flex items-center">
                <IndianRupee className="h-6 w-6 mr-0.5" />9
              </span>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nameOnCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90">Name on Card</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Priya Mehta"
                          {...field}
                          className="bg-input border-border focus:ring-teal-500"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90">Card Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            placeholder="0000 0000 0000 0000"
                            {...field}
                            className="pl-10 bg-input border-border focus:ring-teal-500"
                            disabled={isPending}
                            maxLength={16}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/90">Expiry Date</FormLabel>
                        <FormControl>
                           <div className="relative">
                             <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              placeholder="MM/YY"
                              {...field}
                              className="pl-10 bg-input border-border focus:ring-teal-500"
                              disabled={isPending}
                              maxLength={5}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/90">CVV</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              type="password"
                              placeholder="123"
                              {...field}
                              className="pl-10 bg-input border-border focus:ring-teal-500"
                              disabled={isPending}
                              maxLength={4}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormDescription className="text-xs text-center text-muted-foreground pt-2">
                  This is a simulated payment for demo purposes. No real transaction will occur.
                </FormDescription>
                <Button type="submit" className="w-full cta-button bg-teal-500 hover:bg-teal-600 text-background text-lg py-3" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay <IndianRupee className="inline-block h-5 w-5 mx-1" />9 Now
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      <footer className="mt-12 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Lazify AI. Demo purposes only.</p>
      </footer>
    </div>
  );
}
