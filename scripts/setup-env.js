#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up environment variables for Worksim...\n');

// Check if .env.local already exists
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('⚠️  .env.local already exists. Skipping setup.');
  console.log('   If you need to update your API key, edit .env.local manually.\n');
  process.exit(0);
}

// Check if env.example exists
const envExamplePath = path.join(process.cwd(), 'env.example');
if (!fs.existsSync(envExamplePath)) {
  console.log('❌ env.example not found. Please create it first.');
  process.exit(1);
}

// Copy env.example to .env.local
try {
  fs.copyFileSync(envExamplePath, envLocalPath);
  console.log('✅ Created .env.local from env.example');
  console.log('📝 Please edit .env.local and add your actual API keys:');
  console.log('   - GOOGLE_GEMINI_API_KEY: Get from https://makersuite.google.com/app/apikey\n');
  console.log('🔒 Security reminder: .env.local is already in .gitignore and will not be committed.\n');
} catch (error) {
  console.error('❌ Failed to create .env.local:', error.message);
  process.exit(1);
} 