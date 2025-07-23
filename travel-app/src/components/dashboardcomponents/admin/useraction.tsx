'use client';

import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

export default function UserActions() {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" className="text-blue-600 border-blue-200">
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button size="sm" variant="outline" className="text-red-600 border-red-200">
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </div>
  );
}
