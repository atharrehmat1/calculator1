import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileJson } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DownloadBackupButton } from '@/components/download-backup-button';
import type { Calculator } from '@/lib/api';

// Ensure this page is always rendered dynamically
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCalculatorsFromDatabase(): Promise<Calculator[]> {
  try {
    // Fetch all calculators from the database API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${API_BASE_URL}/calculators`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch calculators: ${response.status}`);
    }
    
    const calculators: Calculator[] = await response.json();
    return calculators;
  } catch (error) {
    console.error('[Backup Page] Error fetching calculators from database:', error);
    return [];
  }
}

export default async function BackupCalculatorsPage() {
  const calculators = await getCalculatorsFromDatabase();

  // Format calculators for JSON display (similar to backup format)
  const formattedCalculators = calculators.map(calc => ({
    name: calc.name,
    slug: calc.slug,
    description: calc.description || null,
    subtitle: (calc as any).subtitle || null,
    href: (calc as any).href || null,
    is_active: calc.is_active,
    category: calc.category_name || null,
    subcategory: calc.subcategory_name || null,
    inputs: calc.inputs || [],
    results: calc.results || [],
    tags: calc.tags || [],
    most_used: calc.most_used || false,
    popular: calc.popular || false,
    likes: calc.likes || 0,
  }));

  const jsonData = {
    version: '1.0',
    last_updated: new Date().toISOString(),
    total_calculators: formattedCalculators.length,
    calculators: formattedCalculators
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Button variant="ghost" size="icon" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold font-headline mb-2">Backup Calculators</h1>
            <p className="text-muted-foreground">
              View all calculators from the database in JSON format
            </p>
          </div>
          {calculators.length > 0 && (
            <DownloadBackupButton backupData={jsonData} />
          )}
        </div>
      </div>

      {calculators.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileJson className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg mb-2">No calculators found</p>
              <p className="text-sm text-muted-foreground">
                There are no calculators in the database yet.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Metadata Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calculators Information</CardTitle>
                  <CardDescription>All calculators from the database</CardDescription>
                </div>
                <DownloadBackupButton backupData={jsonData} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Version</p>
                  <p className="text-lg font-semibold">{jsonData.version}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Calculators</p>
                  <p className="text-lg font-semibold">{jsonData.total_calculators}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <p className="text-lg font-semibold">
                    {new Date(jsonData.last_updated).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* JSON Display */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>JSON Data</CardTitle>
              <CardDescription>Complete JSON representation of all calculators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px] text-sm">
                  <code>{JSON.stringify(jsonData, null, 2)}</code>
                </pre>
                <div className="absolute top-4 right-4">
                  <DownloadBackupButton backupData={jsonData} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calculators List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-headline mb-4">Calculators ({calculators.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formattedCalculators.map((calc, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{calc.name}</CardTitle>
                      <div className="flex gap-1 flex-wrap">
                        {calc.popular && (
                          <Badge variant="default" className="text-xs">Popular</Badge>
                        )}
                        {calc.most_used && (
                          <Badge variant="secondary" className="text-xs">Most Used</Badge>
                        )}
                        {!calc.is_active && (
                          <Badge variant="outline" className="text-xs">Inactive</Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription>
                      {calc.subtitle || calc.description || 'No description available.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Slug: </span>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">{calc.slug}</code>
                      </div>
                      {calc.category && (
                        <div>
                          <span className="text-muted-foreground">Category: </span>
                          <span className="font-medium">{calc.category}</span>
                        </div>
                      )}
                      {calc.subcategory && (
                        <div>
                          <span className="text-muted-foreground">Subcategory: </span>
                          <span className="font-medium">{calc.subcategory}</span>
                        </div>
                      )}
                      {calc.likes !== undefined && (
                        <div>
                          <span className="text-muted-foreground">Likes: </span>
                          <span className="font-medium">{calc.likes}</span>
                        </div>
                      )}
                      {calc.inputs && calc.inputs.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Inputs: </span>
                          <span className="font-medium">{calc.inputs.length}</span>
                        </div>
                      )}
                      {calc.results && calc.results.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Results: </span>
                          <span className="font-medium">{calc.results.length}</span>
                        </div>
                      )}
                      {calc.tags && calc.tags.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Tags: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {calc.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
