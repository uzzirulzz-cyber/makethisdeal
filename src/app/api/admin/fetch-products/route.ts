import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

const PRODUCTS = [
  { id: 'proj_playbeat_live', name: 'PlayBeat.live', url: 'https://playbeat.live', filename: 'playbeat-live' },
  { id: 'proj_playbeat_digital', name: 'PlayBeat.digital', url: 'https://playbeat.digital', filename: 'playbeat-digital' },
  { id: 'proj_playbeatdigital_world', name: 'PlayBeatDigital.world', url: 'https://playbeatdigital.world', filename: 'playbeatdigital-world' },
  { id: 'proj_blockexchange', name: 'BlockExchange.buzz', url: 'https://blockexchange.buzz', filename: 'blockexchange-buzz' },
  { id: 'proj_brockexchange', name: 'BrockExchange.quest', url: 'https://brockexchange.quest', filename: 'brockexchange-quest' },
  { id: 'proj_buzzcryp', name: 'BuzzCryp.buzz', url: 'https://buzzcryp.buzz', filename: 'buzzcryp-buzz' },
  { id: 'proj_nextradepro', name: 'NexTradePro.top', url: 'https://nextradepro.top', filename: 'nextradepro-top' },
  { id: 'proj_playbeattv', name: 'PlayBeatTV.buzz', url: 'https://playbeattv.buzz', filename: 'playbeattv-buzz' },
  { id: 'proj_magxtv', name: 'MagxTV', url: 'https://magxtv.click', filename: 'magxtv-click' },
  { id: 'proj_malik_indol', name: 'Malik Indol', url: 'https://malik-indol-six.vercel.app', filename: 'malik-indol' },
  { id: 'proj_zxc_sigma', name: 'ZXC Sigma Ivory', url: 'https://zxc-sigma-ivory.vercel.app', filename: 'zxc-sigma-ivory' },
  { id: 'proj_propertyatlas', name: 'PropertyAtlas.lifestyle', url: 'https://propertyatlas.lifestyle', filename: 'propertyatlas-lifestyle' },
];

const SCRIPT_PATH = path.join(process.cwd(), 'scripts', 'auto-fetch-products.sh');

// GET: Return product URL list and status (no browser needed)
export async function GET() {
  const productStatus = PRODUCTS.map((p) => {
    const imgPath = path.join(process.cwd(), 'public', 'images', 'products', `${p.filename}.png`);
    return {
      id: p.id,
      name: p.name,
      url: p.url,
      imageExists: existsSync(imgPath),
    };
  });

  return NextResponse.json({
    products: productStatus,
    total: productStatus.length,
    scriptAvailable: existsSync(SCRIPT_PATH),
  });
}

// POST: Trigger full fetch (screenshot + data extraction)
export async function POST() {
  if (!existsSync(SCRIPT_PATH)) {
    return NextResponse.json({ error: 'Fetch script not found' }, { status: 500 });
  }

  const imagesDir = path.join(process.cwd(), 'public', 'images', 'products');
  const jsonOutput = path.join(process.cwd(), 'product-data.json');

  try {
    const output = execSync(
      `bash ${SCRIPT_PATH} ${imagesDir} ${jsonOutput}`,
      { timeout: 300000, encoding: 'utf-8' }
    );

    // Read the generated JSON
    let data = null;
    try {
      data = JSON.parse(require('fs').readFileSync(jsonOutput, 'utf-8'));
    } catch {
      data = null;
    }

    return NextResponse.json({
      success: true,
      message: 'Product images and data fetched successfully',
      output: output.slice(-500),
      data,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
