"use client";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wand2,
  PaintBucket,
  Crop,
  FileVideo,
  ArrowRight,
  Star,
  Check,
  LoaderIcon,
} from "lucide-react";
import { Subscription, Testimonial } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import ImageGallery from "@/components/ImageTransformationGallery";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { StarFilledIcon } from "@radix-ui/react-icons";
interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card
        className={`group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
          isHovered
            ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white"
            : "bg-white text-gray-800"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-6 relative z-10">
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            className="mb-4 text-indigo-600"
          >
            {feature.icon}
          </motion.div>
          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
          <p className="text-gray-600 group-hover:text-white">
            {feature.description}
          </p>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Button variant="ghost" className="group text-white">
                Learn more
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const features: Feature[] = [
  {
    icon: <Wand2 className="h-8 w-8" />,
    title: "Generative Fill",
    description:
      "Magically expand images or fill missing areas with AI-generated content",
  },
  {
    icon: <PaintBucket className="h-8 w-8" />,
    title: "Background Replace",
    description:
      "Remove and replace backgrounds with one click using advanced AI",
  },
  {
    icon: <Crop className="h-8 w-8" />,
    title: "Smart Resize",
    description:
      "Auto-resize and optimize for any social platform while keeping the focus",
  },
  {
    icon: <FileVideo className="h-8 w-8" />,
    title: "Video Enhancement",
    description:
      "Compress videos and generate accurate SRT files automatically",
  },
];

interface PricingTierProps {
  plan: Subscription;
  isPopular: boolean;
}

const PricingTier: React.FC<PricingTierProps> = ({ plan, isPopular }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative ${isPopular ? "scale-105" : ""}`}
    >
      <Card
        className={`relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ${
          isPopular ? "border-2 border-indigo-500 bg-indigo-50" : "bg-white"
        }`}
      >
        {isPopular && (
          <Badge className="absolute top-0 right-0 m-4 bg-indigo-500 text-white">
            Most Popular
          </Badge>
        )}
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-800">
            {plan.planName}
          </CardTitle>
          <div className="mt-4 flex items-baseline">
            <span className="text-5xl font-bold text-indigo-600">
              ${plan.price}
            </span>
            <span className="text-gray-600 ml-2">/month</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {Object.values(plan?.features || {}).map(
              (feature: string, idx: number) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-2 text-gray-800"
                >
                  <Check className="h-4 w-4 text-indigo-600" />
                  <span>{feature}</span>
                </motion.li>
              )
            )}
          </ul>
          <Button
            className={`w-full mt-6 ${
              isPopular
                ? "bg-indigo-600 text-white"
                : "border border-indigo-600 text-indigo-600 hover:bg-indigo-100"
            }`}
          >
            {isPopular ? "Start Free Trial" : "Choose Plan"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
interface ReviewCardProps {
  review: Testimonial;
}
const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <Card className="bg-white text-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 duration-300 min-h-64 flex flex-col justify-between">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <img
            src={review.profileImg}
            alt={`Avatar of ${review.name}`}
            className="w-14 h-14 rounded-full mr-4"
          />
          <div>
            <h3 className="text-xl font-bold">{review.name}</h3>
            <h4 className="text-gray-500 text-sm">{review.occupation}</h4>
            <div className="flex items-center text-amber-400 mt-1">
              {[...Array(review.rating)].map((_, i) => (
                <StarFilledIcon key={i} className="h-5 w-5" />
              ))}
              {[...Array(5 - review.rating)].map((_, i) => (
                <Star
                  key={i + review.rating}
                  className="h-5 w-5 text-gray-300"
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-lg">{review.text}</p>
      </CardContent>
    </Card>
  );
};
const HomePage: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -200]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<Subscription[]>(
    []
  );
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        const response = await axios.get("/api/get-subscription-plans");
        setSubscriptionPlans(response.data.subscriptionPlans);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch subscription plans",
          variant: "destructive",
        });
      }
    };
    const fetchReviews = async () => {
      console.log("called");

      try {
        const response = await axios.get("/api/get-hall-of-fame-testimonials");
        setReviews(response.data.reviews);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch reviews",
          variant: "destructive",
        });
      }
    };
    fetchReviews();
    fetchSubscriptionPlans();
  }, []);

  return (
    <div className="bg-white text-gray-800 min-h-screen ">
      <header className="pt-24 pb-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <motion.h1 className="text-5xl font-bold mb-4">
          Your Amazing App
        </motion.h1>
        <motion.p className="text-lg mb-8 max-w-2xl mx-auto">
          Transform your images and videos with the power of AI
        </motion.p>
        <motion.div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-amber-300 text-indigo-800 hover:bg-amber-400"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border border-white text-white hover:bg-white hover:text-indigo-600"
          >
            Learn More
          </Button>
        </motion.div>
      </header>

      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Our Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </section>

      <section className="py-16 bg-gray-800 text-white">
        <h2 className="text-3xl font-bold text-center mb-8">
          Image Transformations
        </h2>
        <ImageGallery />
      </section>

      <section className="py-16 bg-white lg:w-2/3 mx-auto">
        <h2 className="text-4xl font-bold text-center text-indigo-600 mb-8">
          What our Users Say
        </h2>
        <h2 className="text-3xl text-center text-indigo-300 mb-8">
          Discover insights through recent reviews from our
          users. Their reviews reflect the quality of the app.
        </h2>
        {!reviews.length && (
          <LoaderIcon
            className="mx-auto text-indigo-600 animate-spin"
            size={80}
          />
        )}
        {reviews && (
          <div className="flex justify-center">
            <Carousel
              plugins={[Autoplay({ delay: 2000 })]}
              className="w-full max-w-3xl"
            >
              <CarouselContent className="flex gap-4">
                {reviews.map((review, index) => (
                  <CarouselItem key={index} className="flex-1 md:basis-1/2 lg:basis-1/3">
                    <ReviewCard review={review} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}
      </section>

      <section className="py-16 bg-white w-full">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Pricing Plans
        </h2>
        {!subscriptionPlans.length && (
          <LoaderIcon
            className="mx-auto text-indigo-600 animate-spin"
            size={80}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {subscriptionPlans &&
            subscriptionPlans.map((plan, index) => (
              <PricingTier key={index} plan={plan} isPopular={index === 1} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
