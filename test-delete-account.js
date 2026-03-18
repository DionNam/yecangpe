// Test script for account deletion functionality
// Run with: node test-delete-account.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDeleteAccount() {
  console.log('🧪 Testing Account Deletion Functions\n')

  // Test 1: Check if RPC functions exist
  console.log('1️⃣ Testing if RPC functions are available...')

  try {
    const { data, error } = await supabase.rpc('soft_delete_user_account', {
      user_id_param: '00000000-0000-0000-0000-000000000000', // dummy UUID
      reason_param: 'Test call'
    })

    if (error) {
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        console.error('❌ RPC functions not found in database')
        console.error('   Error:', error.message)
        return false
      }
      // Other errors are OK (like user not found)
      console.log('✅ soft_delete_user_account function exists')
    } else {
      console.log('✅ soft_delete_user_account function exists')
    }
  } catch (e) {
    console.error('❌ Error calling RPC function:', e.message)
    return false
  }

  // Test 2: Check restore function
  console.log('\n2️⃣ Testing restore_user_account function...')
  try {
    const { error } = await supabase.rpc('restore_user_account', {
      user_id_param: '00000000-0000-0000-0000-000000000000'
    })

    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      console.error('❌ restore_user_account function not found')
      return false
    }
    console.log('✅ restore_user_account function exists')
  } catch (e) {
    console.error('❌ Error calling restore function:', e.message)
    return false
  }

  // Test 3: Check hard delete function
  console.log('\n3️⃣ Testing hard_delete_user_account function...')
  try {
    const { error } = await supabase.rpc('hard_delete_user_account', {
      user_id_param: '00000000-0000-0000-0000-000000000000'
    })

    if (error && error.message.includes('function') && error.message.includes('does not exist')) {
      console.error('❌ hard_delete_user_account function not found')
      return false
    }
    console.log('✅ hard_delete_user_account function exists')
  } catch (e) {
    console.error('❌ Error calling hard delete function:', e.message)
    return false
  }

  console.log('\n✅ All RPC functions are properly configured!')
  console.log('   You can now test with a real user account through the UI.')

  return true
}

testDeleteAccount()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(err => {
    console.error('❌ Test failed:', err)
    process.exit(1)
  })
