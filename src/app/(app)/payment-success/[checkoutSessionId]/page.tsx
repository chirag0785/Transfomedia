"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import axios from 'axios';

const PaymentSuccess = ({ params }: { params: { checkoutSessionId: string } }) => {
  const [animate, setAnimate] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creditsIssued, setCreditsIssued] = useState(0);
  const [planName, setPlanName] = useState('');
  const checkoutSessionId = params.checkoutSessionId;
  
  useEffect(() => {
    setAnimate(true);

    const fetchSessionAndPaymentIntentData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/get-session-and-payment-intent-data/${checkoutSessionId}`);
        const session = response.data.session;
        setTotalAmount(session.amount_total / 100);
        setCreditsIssued(Number(session.metadata.creditsIssued) * ((session.amount_total / 100) / session.metadata.unitPrice));
        setPlanName(session.metadata.planName);
      } catch (err) {
        console.error(err);
        setError('Failed to load payment details. Please contact support if credits are not reflected in your account.');
      } finally {
        setLoading(false);
      }
    };
    fetchSessionAndPaymentIntentData();
  }, [checkoutSessionId]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-red-800/50 p-6 md:p-8 shadow-[0_0_30px_rgba(220,38,38,0.15)]">
            <div className="flex justify-center mb-8">
              <div className="rounded-full p-3 bg-red-500/10">
                <AlertCircle className="w-12 h-12 text-red-500" strokeWidth={2} />
              </div>
            </div>
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-red-400">
                Something went wrong
              </h1>
              <p className="text-gray-400">
                {error}
              </p>
              <Link 
                href="/support"
                className="inline-block mt-4 text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 md:p-8 animate-pulse">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gray-800 rounded-full" />
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-800 rounded-lg w-3/4 mx-auto" />
              <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto" />
            </div>
            <div className="space-y-4 my-8">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="h-4 bg-gray-800 rounded w-full mb-2" />
                <div className="h-4 bg-gray-800 rounded w-full" />
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 mb-8">
              <div className="h-4 bg-gray-800 rounded w-full" />
            </div>
            <div className="h-12 bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 md:p-8 shadow-[0_0_30px_rgba(79,70,229,0.15)]">
          <div className="flex justify-center mb-8">
            <div className={`rounded-full p-3 bg-green-500/10 ${animate ? 'animate-bounce' : ''}`}>
              <div className="rounded-full p-4 bg-green-500/20">
                <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
              </div>
            </div>
          </div>

          <div className="text-center space-y-2 mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Payment Successful!
            </h1>
            <p className="text-gray-400">
              Credits have been added to your account
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Plan</span>
                <span className="text-white font-medium">{planName} Plan</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Amount Paid</span>
                <span className="text-white font-medium">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-500/10 rounded-xl p-4 mb-8 flex items-center justify-between transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center gap-3">
              <Sparkles className="text-indigo-400 h-5 w-5" />
              <div className="text-sm">
                <div className="text-white font-medium">Credits Added</div>
                <div className="text-gray-400">{creditsIssued.toLocaleString()} credits added to your account</div>
              </div>
            </div>
            <div className={`text-indigo-400 font-bold ${animate ? 'animate-pulse' : ''}`}>
              +{creditsIssued.toLocaleString()}
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              href="/home"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-xl px-4 py-3 font-medium transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.15)] hover:shadow-[0_0_25px_rgba(79,70,229,0.25)] transform hover:scale-[1.02]"
            >
              Go to Home Page
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link 
            href="/support"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            Need help? Contact our support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;