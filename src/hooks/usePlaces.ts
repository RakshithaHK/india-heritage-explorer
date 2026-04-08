import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Place } from '@/types/place';

export function usePlaces() {
  return useQuery({
    queryKey: ['places'],
    queryFn: async (): Promise<Place[]> => {
      const { data, error } = await supabase
        .from('places')
        .select('id, name, latitude, longitude, description_en, description_hi, description_kn, images, category');
      if (error) throw error;
      return data ?? [];
    },
  });
}
