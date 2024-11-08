"use client";

import TestimonialCard from "@/components/TestimonialCard";
import { useToast } from "@/hooks/use-toast";
import { Testimonial } from "@prisma/client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@clerk/nextjs";

const TestimonialsPage = () => {
  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page") || "1";
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const { toast } = useToast();
  const [moreContentLeft, setMoreContentLeft] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggleDisable, setToggleDisable] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const router = useRouter();
  const {userId,isLoaded}=useAuth();
  useEffect(()=>{
    if(!userId && isLoaded){
      router.refresh();
      router.push('/');
    }
  },[userId])
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/get-all-testimonials?page=${pageNumber}&sort=${sortBy}`
      );
      setTestimonials(response.data.testimonials);
      setMoreContentLeft(response.data.moreContentLeft);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching testimonials",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [pageNumber, sortBy]);

  const onHallOfFameToggle = async (id: string, value: boolean) => {
    setToggleDisable(true);
    try {
      const response=await axios.post(`/api/toggle-hall-of-fame/${id}`, { value });
      toast({
        title: "Success",
        description: `Testimonial ${value ? "added to" : "removed from"} Hall of Fame`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update failed",
        description: "Could not update Hall of Fame status",
        variant: "destructive",
      });
      return;
    } finally {
      setToggleDisable(false);
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="h-[300px]">
          <CardContent className="p-6">
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-20 w-full mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <Card className="max-w-[1400px] mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-2xl font-bold">
              Testimonials Management
            </CardTitle>
            <div className="flex items-center gap-4">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="hallOfFame">Hall of Fame</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchTestimonials}
                disabled={loading}
              >
                <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    onHallOfFameToggle={onHallOfFameToggle}
                    toggleDisable={toggleDisable}
                  />
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    router.refresh();
                    router.push(
                      `/admin/testimonials?page=${Number(pageNumber) - 1}`
                    );
                  }}
                  disabled={pageNumber === "1"}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.refresh();
                    router.push(
                      `/admin/testimonials?page=${Number(pageNumber) + 1}`
                    );
                  }}
                  disabled={!moreContentLeft}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const MyTestimonialPage= () => {
  <Suspense fallback={<div>Loading...</div>}>
    <TestimonialsPage />
  </Suspense>
}
export default MyTestimonialPage;