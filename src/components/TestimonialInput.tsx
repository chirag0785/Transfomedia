"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { testimonialSchema } from "@/schemas/testimonialSchema";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./StarRating";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
type TestimonialInputProps = {
  name: string;
  profileImg: string;
  triggerRef: React.RefObject<HTMLButtonElement>;
};
const TestimonialInput = ({
  name,
  profileImg,
  triggerRef,
}: TestimonialInputProps) => {
  const form = useForm<z.infer<typeof testimonialSchema>>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      occupation: "",
      text: "",
      rating: 1,
      canBePubliclyShown: false,
    },
  });
  const [rating, setRating] = useState(1);
  const [hover, setHover] = useState(1);
  const {toast}=useToast();
  const onSubmit = (values: z.infer<typeof testimonialSchema>) => {
        console.log(values)
        axios.post('/api/add-testimonial',{
            ...values,
            profileImg:profileImg,
            name:name
        })
        .then((response)=> response.data)
        .then((data)=>{
            toast({
                title:'Success',
                description:'Testimonial added successfully'
            })
        })
        .catch((err)=>{
            toast({
                title:'Error',
                description:'Error while adding testimonial',
                variant:'destructive'
            })
        })
  }
  return (
    <Dialog>
      <DialogTrigger hidden ref={triggerRef}>
        Open
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Testimonial Form</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Occupation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Give Feedback about your experience with transformify"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <StarRating
                          rating={rating}
                          setRating={setRating}
                          hover={hover}
                          setHover={setHover}
                          field={field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canBePubliclyShown"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Can your feedback be publicly shown?
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialInput;
