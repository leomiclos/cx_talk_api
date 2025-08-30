import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Pega os primeiros 5 usuários
    const { data, error } = await supabase.from('users').select('*').limit(5);

    if (error) {
      console.error('Erro na conexão:', error);
      return;
    }

    console.log('Conexão funcionando! Usuários:', data);
  } catch (err) {
    console.error('Erro inesperado:', err);
  }
}

testConnection();
