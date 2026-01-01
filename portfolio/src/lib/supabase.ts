import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our data structures
export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  problem: string;
  solution: string;
  result: string;
  github_url?: string;
  demo_url?: string;
  image_url?: string;
  created_at: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

// API Functions
export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
};

export const submitContactForm = async (formData: ContactMessage) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([formData])
    .select();

  if (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }

  return data;
};
