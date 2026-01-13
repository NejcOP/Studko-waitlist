-- Create waiting_list table for email collection
CREATE TABLE public.waiting_list (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public inserts (no auth required for waitlist)
ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their email (public waitlist)
CREATE POLICY "Anyone can join the waiting list"
ON public.waiting_list
FOR INSERT
WITH CHECK (true);

-- Prevent reading emails (admin only via dashboard)
CREATE POLICY "No public read access"
ON public.waiting_list
FOR SELECT
USING (false);