import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ndxmoefdpfmgtfycxfvt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5keG1vZWZkcGZtZ3RmeWN4ZnZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMzY0OTAsImV4cCI6MjA2MjgxMjQ5MH0.qqHWyq3p7SmivGw2uXzZzdrsJJ7E3Vams8n5KwLbnso";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);