import { config } from 'dotenv';
import { supabase, createRequest, getStudentRequests, getAllAdminRequests } from './src/lib/supabaseClient.js';

// Load environment variables from .env.local or .env
config({ path: '.env.local' });

async function runTests() {
  console.log('--- Starting Supabase Tests ---');

  // 1. Create a dummy user first (since Requests needs a valid user_id)
  console.log('\nCreating a test user...');
  const { data: user, error: userError } = await supabase
    .from('Users')
    .insert([{ name: 'Test Student', role: 'student' }])
    .select()
    .single();

  if (userError) {
    console.error('Failed to create test user. Ensure tables exist and RLS allows inserts.', userError);
    return;
  }
  console.log('Created User:', user);

  // 2. Test createRequest
  console.log('\nTesting createRequest...');
  const newRequestData = {
    user_id: user.id,
    title: 'Leaky Faucet',
    description: 'The faucet in the restroom is leaking.',
    department: 'Maintenance',
    status: 'Pending',
    building_location: 'Science Building',
    priority: 'Low'
  };

  let createdRequest;
  try {
    createdRequest = await createRequest(newRequestData);
    console.log('Successfully created request:', createdRequest);
  } catch (err) {
    console.error('Failed createRequest test.');
    return;
  }

  // 3. Test getStudentRequests
  console.log('\nTesting getStudentRequests...');
  try {
    const studentRequests = await getStudentRequests(user.id);
    console.log(`Found ${studentRequests.length} requests for student ${user.id}:`, studentRequests);
  } catch (err) {
    console.error('Failed getStudentRequests test.');
  }

  // 4. Test getAllAdminRequests
  console.log('\nTesting getAllAdminRequests...');
  try {
    const allRequests = await getAllAdminRequests();
    console.log(`Found ${allRequests.length} total requests in the system. First one:`, allRequests[0]);
  } catch (err) {
    console.error('Failed getAllAdminRequests test.');
  }

  console.log('\n--- Tests Completed ---');
}

runTests();
