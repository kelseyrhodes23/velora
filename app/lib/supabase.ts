import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpmgvomrwphdxkvrdimd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwbWd2b21yd3BoZHhrdnJkaW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NzYwNDEsImV4cCI6MjA2MjQ1MjA0MX0.qHYyfwM_kQChOBU_0XYRwJFwyQiPQVy4G7K2nIyjbhY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 