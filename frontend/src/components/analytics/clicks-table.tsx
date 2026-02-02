"use client"

import { ClickEvent } from '@/types/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClicksTableProps {
  clicks: ClickEvent[];
}

export function ClicksTable({ clicks }: ClicksTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cliques Recentes</CardTitle>
        <CardDescription>Últimos 10 cliques</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Dispositivo</TableHead>
              <TableHead>Navegador</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clicks.map((click) => (
              <TableRow key={click.id}>
                <TableCell>
                  {format(new Date(click.timestamp), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell>{click.country || 'N/A'}</TableCell>
                <TableCell>{click.city || 'N/A'}</TableCell>
                <TableCell>{click.device || 'N/A'}</TableCell>
                <TableCell>{click.browser || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

