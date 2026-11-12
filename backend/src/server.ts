import { createApp } from './app';
import { ENV } from './config/env';
import { connectDatabase } from './config/database';

async function startServer() {
  const app = createApp();

  // Attempt database connection
  await connectDatabase();

  const server = app.listen(ENV.PORT, () => {
    console.log(`🚀 Kidooza Backend running on http://localhost:${ENV.PORT}`);
    console.log(`🛡️ Child Safety Guardrails active (Phase 3)`);
  });

  const shutdown = () => {
    console.log('\n🛑 Gracefully shutting down Kidooza Backend...');
    server.close(() => {
      console.log('✅ Server terminated.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();
