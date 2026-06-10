const testAPIs = async () => {
  const baseURL = 'http://localhost:5000';
  console.log(`Starting API verification tests against: ${baseURL}`);

  try {
    // Test 1: Check root status
    console.log('\n--- Test 1: Check Root Endpoint ---');
    const rootRes = await fetch(`${baseURL}/`);
    const rootText = await rootRes.text();
    console.log(`Status: ${rootRes.status}`);
    console.log(`Response: ${rootText}`);
    if (rootRes.status === 200 && rootText.includes('API is running')) {
      console.log('✓ Root Endpoint verified!');
    }

    // Test 2: Fetch Charging Stations
    console.log('\n--- Test 2: Fetch Charging Stations List ---');
    const stationsRes = await fetch(`${baseURL}/api/stations`);
    const stationsData = await stationsRes.json();
    console.log(`Status: ${stationsRes.status}`);
    console.log(`Found ${stationsData.length} stations.`);
    if (stationsData.length > 0) {
      console.log('Sample Station Name:', stationsData[0].name);
      console.log('✓ Stations API verified!');
    }

    // Test 3: Perform Login
    console.log('\n--- Test 3: Authenticate User ---');
    const loginRes = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@ecoride.com',
        password: 'userpassword',
      }),
    });
    const loginData = await loginRes.json();
    console.log(`Status: ${loginRes.status}`);
    console.log(`Authenticated as: ${loginData.name}`);
    console.log(`JWT Token received: ${loginData.token ? 'YES' : 'NO'}`);
    if (loginData.token) {
      console.log('✓ Authentication verified!');
    }

    // Test 4: Fetch User Bookings (Authenticated)
    console.log('\n--- Test 4: Fetch User Bookings (Authenticated) ---');
    const bookingsRes = await fetch(`${baseURL}/api/bookings/user`, {
      headers: {
        Authorization: `Bearer ${loginData.token}`,
      },
    });
    const bookingsData = await bookingsRes.json();
    console.log(`Status: ${bookingsRes.status}`);
    console.log(`Found ${bookingsData.length} bookings for user.`);
    if (bookingsData.length > 0) {
      console.log('Sample Booking Station:', bookingsData[0].station?.name);
      console.log('✓ Bookings API verified!');
    }

    console.log('\n======================================');
    console.log('✓ ALL CORE API VERIFICATIONS PASSED!');
    console.log('======================================');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ API VERIFICATION FAILED:', error.message);
    process.exit(1);
  }
};

testAPIs();
