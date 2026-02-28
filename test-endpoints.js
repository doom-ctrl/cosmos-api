const BASE_URL = process.env.API_URL || 'http://localhost:3000';

async function testEndpoint(name, url, expectedStatus = 200) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.status === expectedStatus) {
      console.log(`✅ ${name}: PASSED`);
      return { success: true, data };
    } else {
      console.log(`❌ ${name}: FAILED (status ${response.status})`);
      console.log('   Response:', JSON.stringify(data).slice(0, 200));
      return { success: false, data };
    }
  } catch (error) {
    console.log(`❌ ${name}: ERROR - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Running API Tests\n');
  
  // Health
  await testEndpoint('Health', `${BASE_URL}/health`);
  
  // Search
  await testEndpoint('Search', `${BASE_URL}/api/v1/search?q=naruto`);
  
  // Anime
  await testEndpoint('Anime', `${BASE_URL}/api/v1/anime/naruto-100`);
  
  // Episodes
  await testEndpoint('Episodes', `${BASE_URL}/api/v1/episodes/naruto-100`);
  
  // Servers
  await testEndpoint('Servers', `${BASE_URL}/api/v1/servers?episodeId=naruto-100?ep=1`);
  
  // Stream (most important)
  await testEndpoint('Stream', `${BASE_URL}/api/v1/stream?episodeId=naruto-100?ep=1&server=hd-1&type=sub`);
  
  console.log('\n✅ Tests Complete');
}

runTests();
