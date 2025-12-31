import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Path to the backup file
    // The backup file is saved to Frontend/data/calculators-backup.json
    // In Next.js, process.cwd() points to the Frontend directory (project root)
    const projectRoot = process.cwd();
    const backupFilePath = path.join(projectRoot, 'data', 'calculators-backup.json');
    
    console.log('[Backup API] Looking for backup file at:', backupFilePath);
    
    // Check if file exists
    if (!fs.existsSync(backupFilePath)) {
      console.log('[Backup API] File not found at:', backupFilePath);
      // Try alternative path (in case we're in a different directory structure)
      const altPath = path.resolve(projectRoot, '..', 'Frontend', 'data', 'calculators-backup.json');
      if (fs.existsSync(altPath)) {
        console.log('[Backup API] Found file at alternative path:', altPath);
        const fileContent = fs.readFileSync(altPath, 'utf8');
        const backupData = JSON.parse(fileContent);
        return NextResponse.json(backupData);
      }
      
      return NextResponse.json(
        { error: 'Backup file not found', searchedPaths: [backupFilePath, altPath] },
        { status: 404 }
      );
    }
    
    // Read and parse the JSON file
    const fileContent = fs.readFileSync(backupFilePath, 'utf8');
    const backupData = JSON.parse(fileContent);
    
    console.log('[Backup API] Successfully loaded backup file with', backupData.total_calculators || 0, 'calculators');
    
    return NextResponse.json(backupData);
  } catch (error) {
    console.error('[Backup API] Error reading backup file:', error);
    return NextResponse.json(
      { error: 'Failed to read backup file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

