const { execSync } = require('child_process');

try {
  // Use wmic or powershell to inspect the handle or environment of process 12076
  const out = execSync('powershell -Command "Get-CimInstance Win32_Process -Filter \\"ProcessId = 12076\\" | Select-Object -ExpandProperty CommandLine"', { encoding: 'utf-8' });
  console.log('CommandLine:', out);

  // Check parent process
  const parentId = execSync('powershell -Command "(Get-CimInstance Win32_Process -Filter \\"ProcessId = 12076\\").ParentProcessId"', { encoding: 'utf-8' }).trim();
  console.log('Parent PID:', parentId);

  const parentCmd = execSync(`powershell -Command "Get-CimInstance Win32_Process -Filter \\"ProcessId = ${parentId}\\" | Select-Object -ExpandProperty CommandLine"`, { encoding: 'utf-8' });
  console.log('Parent Cmd:', parentCmd);
} catch (e) {
  console.error(e.message);
}

