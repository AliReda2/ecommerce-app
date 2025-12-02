'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { toggleTag } from '@/lib/features/productSlice';
import { useAppDispatch } from '@/lib/hooks';
import toast from 'react-hot-toast';

export default function ToggleTag({
  tagName,
  productId,
  isActive: initialActive,
}: {
  tagName: string;
  productId: string;
  isActive: boolean;
}) {
  const dispatch = useAppDispatch();
  const [isActive, setIsActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await dispatch(toggleTag({ productId, tagName })).unwrap();
      setIsActive((prev) => !prev); // toggle UI immediately
      toast.success('Tag toggled successfully');
    } catch (error: any) {
      toast.error(error || 'Failed to toggle tag');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="cursor-pointer"
    >
      <Badge variant={isActive ? 'success' : 'secondary'}>
        {loading ? 'Toggling...' : tagName}
      </Badge>
    </button>
  );
}
