/* app/lib/supabase.ts */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://baeljjbcnnedgaubdlhm.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhZWxqamJjbm5lZGdhdWJkbGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNTcyNzksImV4cCI6MjA4OTgzMzI3OX0.4DHIoVmFb7USxo_dxNNo3wBPIs7h3aNtx5xCLXKFRcc"

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface DbImage {
  id:          string
  src:         string
  title:       string
  medium:      string
  dims:        string
  year:        string
  location:    string
  section:     string
  size:        string
  title_ar:    string
  medium_ar:   string
  location_ar: string
}