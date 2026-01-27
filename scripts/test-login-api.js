// Test NextAuth signin directly
const testLogin = async () => {
    const email = 'admin@blackstone.com';
    const password = 'Admin123!';

    console.log('Testing login to:', 'http://localhost:3000/api/auth/callback/credentials');

    try {
        const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                email,
                password,
                redirect: 'false',
                json: 'true'
            }),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        const text = await response.text();
        console.log('Response body:', text);

        if (response.ok) {
            console.log('✅ Login successful!');
        } else {
            console.log('❌ Login failed');
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

testLogin();
