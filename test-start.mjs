import { exec } from 'child_process';
const child = exec('node dist/server.cjs');
child.stdout.on('data', console.log);
child.stderr.on('data', console.error);
child.on('exit', code => console.log('Exit code:', code));
setTimeout(() => { child.kill(); console.log('killed'); process.exit(0); }, 3000);
