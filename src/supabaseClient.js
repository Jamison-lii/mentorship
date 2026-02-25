import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ymjbdqmttyuxvbmpmvfz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltamJkcW10dHl1eHZibXBtdmZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0OTIyNTUsImV4cCI6MjA4NzA2ODI1NX0.HWIo-ynzWx0Tzk0RtIWnKHzYaarY-pja0O3Ps4vSPwY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)