export interface EventDistance {
  id: number;
  event_id: number;
  name: string;
  distance: number;
  distance_display: string;
  max_participants: number;
  current_enrolled: number;
  min_age: number;
  max_age: number;
  requirements: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  start_date: string;
  end_date: string;
  location: string;
  coordinates_lat: number;
  coordinates_lng: number;
  max_participants: number;
  current_enrolled: number;
  min_age: number;
  max_age: number;
  organizator_name: string;
  is_own_event: boolean;
  contact_email: string;
  contact_phone: string;
  event_main_type: 'pool' | 'open_water';
  event_location_type: 'pool_25' | 'pool_50' | 'sea' | 'lake' | 'river';
  event_category: 'competitivo' | 'formativo' | 'travesia';
  status: 'draft' | 'soon' | 'active' | 'finished' | 'cancelled';
  cost: {
    min: number;
    max: number;
    currency: string;
    description: string;
  };
  featured_image: string;
  has_gallery: boolean;
  requirements: string[];
  equipment: string[];
  is_active: boolean;
  is_featured: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  distances?: EventDistance[];
}

export interface EventFilters {
  event_main_type?: 'pool' | 'open_water';
  event_location_type?: 'pool_25' | 'pool_50' | 'sea' | 'lake' | 'river';
  event_category?: 'competitivo' | 'formativo' | 'travesia';
  status?: 'draft' | 'soon' | 'active' | 'finished' | 'cancelled';
  min_age?: number;
  max_age?: number;
  is_active?: boolean;
  is_featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
} 