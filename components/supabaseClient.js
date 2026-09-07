import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu-clave-anonima-aqui';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);