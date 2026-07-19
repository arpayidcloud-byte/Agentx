import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.resolve(process.cwd(), '.agentx');

interface PluginRecord {
  id: string;
  version: string;
  kind: string;
  status: 'pending-review' | 'enabled' | 'disabled' | 'rejected';
  installedAt: string;
}

function loadPlugins(): Record<string, PluginRecord> {
  const file = path.join(DATA_DIR, 'plugins.json');
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function savePlugins(plugins: Record<string, PluginRecord>): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, 'plugins.json'), JSON.stringify(plugins, null, 2));
}

export async function plugin(args: string[]): Promise<void> {
  const subcommand = args[0];

  if (!subcommand || subcommand === 'list') {
    const plugins = loadPlugins();
    const entries = Object.values(plugins);
    if (entries.length === 0) {
      console.log('No plugins installed.');
      return;
    }
    console.log('Installed Plugins:');
    for (const p of entries) {
      const icon = p.status === 'enabled' ? '🟢' : p.status === 'disabled' ? '🔴' : '🟡';
      console.log(`  ${icon} ${p.id}@${p.version} (${p.kind}) — ${p.status}`);
    }
    return;
  }

  if (subcommand === 'install') {
    const pluginPath = args[1];
    if (!pluginPath) throw new Error('Usage: agentx plugin install <path-or-name>');

    let manifest: { id: string; version: string; kind: string };
    if (fs.existsSync(pluginPath)) {
      const manifestPath = path.join(pluginPath, 'manifest.json');
      if (!fs.existsSync(manifestPath))
        throw new Error('No manifest.json found in plugin directory');
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as {
        id: string;
        version: string;
        kind: string;
      };
    } else {
      manifest = { id: pluginPath, version: '0.0.0', kind: 'unknown' };
    }

    const plugins = loadPlugins();
    plugins[manifest.id] = {
      id: manifest.id,
      version: manifest.version,
      kind: manifest.kind,
      status: 'pending-review',
      installedAt: new Date().toISOString(),
    };
    savePlugins(plugins);

    console.log(`Plugin installed: ${manifest.id}@${manifest.version}`);
    console.log(`Status: pending-review`);
    console.log(`Run "agentx plugin enable ${manifest.id}" after review.`);
    return;
  }

  if (subcommand === 'enable') {
    const id = args[1];
    if (!id) throw new Error('Usage: agentx plugin enable <id>');
    const plugins = loadPlugins();
    const plugin = plugins[id];
    if (!plugin) throw new Error(`Plugin not found: ${id}`);
    plugin.status = 'enabled';
    savePlugins(plugins);
    console.log(`✅ Plugin ${id} enabled.`);
    return;
  }

  if (subcommand === 'disable') {
    const id = args[1];
    if (!id) throw new Error('Usage: agentx plugin disable <id>');
    const plugins = loadPlugins();
    const plugin = plugins[id];
    if (!plugin) throw new Error(`Plugin not found: ${id}`);
    plugin.status = 'disabled';
    savePlugins(plugins);
    console.log(`🔴 Plugin ${id} disabled.`);
    return;
  }

  throw new Error(`Unknown plugin subcommand: ${subcommand}. Use: install|enable|disable|list`);
}
