import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nvvuulsctlxezdxcswvb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dnV1bHNjdGx4ZXpkeGNzd3ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NjQzMjAsImV4cCI6MjA5NTM0MDMyMH0.-J0FMM4eFZc5GC5nrQy4l2y0z2o5q68SiS2Ry6zjVic'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
