import { useState, useEffect, useMemo } from 'react';
import { reqClient } from '@/lib/api-client';
import type { ClubSimple } from '@/types/models/club';

const CLUBS_FALLBACK: ClubSimple[] = [
  { id: 1, nombre: 'Sin Club' },
  { id: 2, nombre: 'Otro' }
];

interface UseClubsReturn {
  clubs: ClubSimple[];
  clubOptions: string[];
  isLoading: boolean;
  error: string | null;
  getClubIdByName: (name: string) => number | null;
  getClubNameById: (id: number) => string;
}

export const useClubs = (): UseClubsReturn => {
  const [clubs, setClubs] = useState<ClubSimple[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await reqClient.get('/api/clubes');
        
        if (response.ok && response.data) {
          setClubs(response.data as ClubSimple[]);
        } else {
          setClubs([]);
        }
      } catch (err) {
        console.error('Error al cargar clubs:', err);
        setError('Error al cargar clubs');
        setClubs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const allClubs = useMemo(() => {
    const otherClubs = clubs.filter(
      club => !['Sin Club', 'Otro'].includes(club.nombre)
    );
    otherClubs.sort((a, b) => a.nombre.localeCompare(b.nombre));
    
    return [...CLUBS_FALLBACK, ...otherClubs];
  }, [clubs]);

  const clubOptions = useMemo(() => 
    allClubs.map(club => club.nombre), 
    [allClubs]
  );

  const getClubIdByName = useMemo(() => (name: string): number | null => {
    const club = allClubs.find(c => c.nombre === name);
    return club?.id ?? null;
  }, [allClubs]);

  const getClubNameById = useMemo(() => (id: number): string => {
    const club = allClubs.find(c => c.id === id);
    return club?.nombre ?? '';
  }, [allClubs]);

  return {
    clubs: allClubs,
    clubOptions,
    isLoading,
    error,
    getClubIdByName,
    getClubNameById
  };
}; 