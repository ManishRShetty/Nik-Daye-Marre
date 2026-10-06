const fs = require('fs');

async function seedDatabase() {
  try {
    // Read the fallback data file
    const data = fs.readFileSync('fallbackData.json', 'utf8');
    const requests = JSON.parse(data);

    console.log(`Found ${requests.length} requests to insert...`);

    for (const req of requests) {
      console.log(`Inserting: ${req.title}...`);
      
      const response = await fetch('http://localhost:3000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error(`Failed to insert ${req.title}:`, err);
      } else {
        console.log(`✅ Success: ${req.title}`);
      }
    }

    console.log('Seeding completed!');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

seedDatabase();
