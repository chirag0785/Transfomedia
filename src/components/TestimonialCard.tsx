import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Testimonial } from '@prisma/client';

type TestimonialCardProps={
    testimonial:Testimonial;
    onHallOfFameToggle: (id: string, value: boolean) => void;
    toggleDisable:boolean;
}

const TestimonialCard = ({ testimonial, onHallOfFameToggle,toggleDisable }: TestimonialCardProps) => {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={testimonial.profileImg} alt={testimonial.name} />
            <AvatarFallback className="bg-primary/10">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{testimonial.name}</span>
              {!testimonial.canBePubliclyShown && (
                <Badge variant="secondary" className="text-xs">Private</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={12}
                    className={index < testimonial.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
                  />
                ))}
              </div>
              {testimonial.occupation && (
                <span className="truncate">• {testimonial.occupation}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy size={16} className={testimonial.hallOfFame ? "text-yellow-500" : "text-muted-foreground"} />
              <Switch 
                checked={testimonial.hallOfFame}
                onCheckedChange={(checked: boolean) => onHallOfFameToggle(testimonial.id, checked)}
                className="data-[state=checked]:bg-yellow-500"
                disabled={toggleDisable}
              />
            </div>
            <div className="text-right text-sm text-muted-foreground">
              {new Date(testimonial.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {testimonial.text}
        </p>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;