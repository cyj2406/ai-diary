const fs = require('fs');

async function run() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const keyMatch = envContent.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.*)/);
    if (!keyMatch) {
      console.error("No API key found in .env.local");
      return;
    }
    const key = keyMatch[1].trim();
    
    console.log("Fetching models...");
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + key);
    const data = await response.json();
    console.log("Available models:");
    data.models.map(m => m.name).forEach(name => console.log(name));
  } catch (e) {
    console.error(e);
  }
}
run();
