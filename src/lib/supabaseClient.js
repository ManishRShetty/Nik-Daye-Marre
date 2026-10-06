import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Ensure we have URL and Key to initialize Supabase
if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase URL and Key are missing. Please add them to your environment variables.");
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder-key');

/**
 * Inserts a new row into the Requests table.
 * @param {Object} data - The request data object.
 * @returns {Promise<Object>} The created request or an error.
 */
export async function createRequest(data) {
  const { data: request, error } = await supabase
    .from('Requests')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error('Error creating request:', error);
    throw error;
  }
  return request;
}

/**
 * Fetches all requests where the user_id matches.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Array>} The list of requests.
 */
export async function getStudentRequests(userId) {
  const { data: requests, error } = await supabase
    .from('Requests')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching student requests:', error);
    throw error;
  }
  return requests;
}

/**
 * Fetches all requests in the database and sorts them by created_at descending.
 * @returns {Promise<Array>} The list of all requests.
 */
export async function getAllAdminRequests() {
  const { data: requests, error } = await supabase
    .from('Requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin requests:', error);
    throw error;
  }
  return requests;
}
