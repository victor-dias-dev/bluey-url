"use client"

import { Url } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { UrlActions } from './url-actions';
import { formatShortUrl } from '@/lib/url-utils';

interface UrlCardProps {
  url: Url;
}

export function UrlCard({ url }: UrlCardProps) {
  const { toast } = useToast();
  const shortUrl = formatShortUrl(url.shortCode, url.domain?.domain);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    toast({
      title: 'URL copiada!',
      description: 'A URL foi copiada para a área de transferência.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-medium line-clamp-1">
              {url.originalUrl}
            </CardTitle>
            <CardDescription className="mt-1">
              {shortUrl}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={url.isActive ? 'default' : 'secondary'}>
              {url.isActive ? 'Ativa' : 'Inativa'}
            </Badge>
            {url.expiresAt && (
              <Badge variant="outline">
                Expira {formatDistanceToNow(new Date(url.expiresAt), { addSuffix: true, locale: ptBR })}
              </Badge>
            )}
            {url._count && (
              <Badge variant="outline">
                {url._count.clickEvents} cliques
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(shortUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <UrlActions url={url} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

