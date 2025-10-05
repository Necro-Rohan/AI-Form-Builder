const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AI Form Builder Frontend...');
console.log('📁 Serving from:', path.join(__dirname, 'dist'));

const serve = spawn('npx', ['serve', 'dist', '-p', '10000', '-s'], {
  cwd: __dirname,
  stdio: 'inherit'
});

serve.on('error', (err) => {
  console.error('❌ Error starting serve:', err);
  process.exit(1);
});

serve.on('exit', (code) => {
  console.log(`📊 Serve exited with code ${code}`);
  process.exit(code);
});
