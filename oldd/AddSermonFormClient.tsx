import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { AddSermonFormProps, SermonData } from './AddSermonForm';

export default function AddSermonFormClient({ onAddSermon, onCancel }: AddSermonFormProps) {
  const [sermonData, setSermonData] = useState<SermonData>({
    title: '',
    date: new Date(),
    scripture: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSermonData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSermonData(prev => ({ ...prev, date }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSermon(sermonData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Sermon Title</Label>
        <Input
          id="title"
          name="title"
          value={sermonData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="date">Sermon Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${!sermonData.date && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {sermonData.date ? format(sermonData.date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={sermonData.date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="scripture">Scripture Reference</Label>
        <Input
          id="scripture"
          name="scripture"
          value={sermonData.scripture}
          onChange={handleInputChange}
          placeholder="e.g., John 3:16"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={sermonData.notes}
          onChange={handleInputChange}
          placeholder="Any initial thoughts or ideas for the sermon..."
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Sermon</Button>
      </div>
    </form>
  );
}