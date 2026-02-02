"use client"

import { UrlList } from '@/components/urls/url-list';
import { CreateUrlDialog } from '@/components/urls/create-url-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function UrlsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">URLs</h1>
          <p className="text-muted-foreground">
            Gerencie suas URLs encurtadas
          </p>
        </div>
        <CreateUrlDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova URL
          </Button>
        </CreateUrlDialog>
      </div>

      <UrlList />
    </div>
  );
}

