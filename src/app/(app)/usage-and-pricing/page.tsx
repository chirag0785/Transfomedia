"use client"
import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { Subscription, User } from '@prisma/client';
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Crown, LucideCoins, Wand2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button';
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from 'next/navigation';

const Page = () => {
  const { userId } = useAuth();
  const [user, setUser] = useState<User>();
  const [subscriptionPlans, setSubscriptionPlans] = useState<Subscription[]>([]);
  const router=useRouter();
  const getLoadStripe = useCallback(async () => {
    try {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      return stripe;
    } catch (err) {
      alert('Error loading stripe');
      console.error(err);
      return null;
    }
  }, [])
  const getPaymentDone = async ({ subscriptionId }: { subscriptionId: string }) => {
    try {
      const response = await axios.post('/api/create-checkout-session', {
        subscriptionId
      })

      const sessionId = response.data?.sessionId;
      const stripe = await getLoadStripe();
      if (sessionId && stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId
        })

        if (result.error) {
          alert(result.error.message);
        }
      }

    } catch (err) {
      console.error(err);
      alert('Error creating checkout session');
    }
  }
  useEffect(() => {
    if(userId){
        router.refresh();
        router.push('/');
        return;
    }
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/get-user-details/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
        alert('Error fetching user details');
      }
    };

    const fetchSubscriptionPlans = async () => {
      try {
        const response = await axios.get('/api/get-subscription-plans');
        setSubscriptionPlans(response.data.subscriptionPlans);

      } catch (error) {
        console.error(error);
        alert('Error fetching subscription plans');
      }
    };

    fetchUser();
    fetchSubscriptionPlans();
  }, [userId]);

  const UserStats = () => (
    <div className="flex gap-6 mb-8 p-4 bg-secondary/10 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary/10 rounded-full">
          <LucideCoins className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Available Credits</p>
          <p className="font-semibold text-lg">{user?.credits || 0}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary/10 rounded-full">
          <Wand2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Transformations</p>
          <p className="font-semibold text-lg">{user?.tranformationsDone || 0}</p>
        </div>
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border rounded-lg space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2">
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const getPlanBadge = (planName: string) => {
    if (planName.toLowerCase() === 'free') {
      return <Badge variant="secondary">Free</Badge>;
    }
    if (planName.toLowerCase().includes('standard')) {
      return <Badge variant="default" className="bg-gradient-to-r from-green-500 to-blue-500">Standard</Badge>;
    }
    return <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-blue-500">Pro</Badge>;
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-muted-foreground">Choose the perfect plan for your needs</p>
      </div>

      {user && <UserStats />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card key={plan.id} className="relative overflow-hidden">
            {plan.planName.toLowerCase() !== 'free' && (
              <div className="absolute top-0 right-0 p-4">
                <Crown className="h-6 w-6 text-yellow-500" />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>{plan.planName}</CardTitle>
                {getPlanBadge(plan.planName)}
              </div>
              <CardDescription className="mt-2">
                <div className="text-2xl font-bold">${plan.price}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {plan.creditsIssued} credits included
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features?.toString().split(',').map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature.trim()}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-2">
              {plan.planName.toLowerCase() === 'free' && (
                <Button variant="secondary" disabled>
                  Current Plan
                </Button>
              )}

              {plan.planName.toLowerCase() === 'standard' && (
                <Button
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-300 ease-in-out"
                  onClick={() => getPaymentDone({ subscriptionId: plan.id })}
                >
                  Subscribe
                </Button>
              )}

              {plan.planName.toLowerCase() === 'pro' && (
                <Button
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-300 ease-in-out"
                  onClick={() => getPaymentDone({ subscriptionId: plan.id })}
                >
                  Subscribe
                </Button>
              )}

            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
