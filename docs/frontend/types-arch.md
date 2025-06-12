# Guía de Tipos para Frontend

Esta es la estructura organizada de tipos para el frontend de la aplicación.

## Estructura de Directorios

```
frontend/types/
├── api.ts                  # Tipos base para respuestas (ApiResponse<T>)
├── models/                 # Modelos de datos que maneja el frontend
│   ├── user.ts             # Tipos relacionados con usuarios
│   ├── club.ts             # Tipos relacionados con clubs
│   ├── schedule.ts         # Tipos relacionados con horarios
│   ├── reservation.ts      # Tipos relacionados con reservas
│   └── email.ts            # Tipos relacionados con emails
├── forms/                  # Tipos específicos para formularios
│   ├── profile-form.ts     # Formulario de perfil
│   ├── auth-form.ts        # Formularios de autenticación
│   ├── reservation-form.ts # Formularios de reservas
│   └── admin-forms.ts      # Formularios administrativos
└── api-responses/          # Interfaces específicas de datos de API
    ├── profile.ts          # Interfaces específicas de perfil (ProfileApiData)
    └── user.ts             # Interfaces específicas de usuario

```

## Cómo Usar los Tipos

### 1. Importar sin Barrel Files

```typescript
// ✅ Correcto - Imports específicos y claros
import type { ProfileFormData } from '@/types/forms/profile-form';
import type { ProfileApiData } from '@/types/api-responses/profile';
import type { User } from '@/types/models/user';
import type { ApiResponse } from '@/types/api';

```

### 2. En Componentes

```typescript
import type { ProfileFormData, ProfileFormProps } from '@/types/forms/profile-form';
import type { ProfileApiData } from '@/types/api-responses/profile';
import type { ClubSimple } from '@/types/api-responses/club';
import type { ApiResponse } from '@/types/api';

const ProfileForm: React.FC<ProfileFormProps> = ({ mode, onSuccess }) => {
  const [clubs, setClubes] = useState<ClubSimple[]>([]);
  
  const onSubmit = async (data: ProfileFormData) => {
    const response: ApiResponse<ProfileApiData> = await api.post('/profile', data);
    // TypeScript inferirá automáticamente los tipos
  };
};
```

### 3. En Hooks o Services

```typescript
import type { ClubSimple } from '@/types/api-responses/club';
import type { ApiResponse } from '@/types/api';

export const useClubs = () => {
  const [clubs, setClubs] = useState<ClubSimple[]>([]);
  
  const fetchClubs = async (): Promise<ClubSimple[]> => {
    const response: ApiResponse<ClubSimple[]> = await api.get('/clubs');
    return response.data || [];
  };
};
```

## Principios de la Arquitectura

### 1. **Separación Clara**
- `models/`: Cómo estructuramos los datos internamente
- `forms/`: Tipos específicos para formularios y validación  
- `api-responses/`: Solo interfaces específicas que agregan valor

### 2. **Simplicidad**
- Usar `ApiResponse<T>` directamente en lugar de crear wrapper types
- Solo crear tipos específicos cuando agregan valor real
- Eliminar redundancias y tipos innecesarios

### 3. **Type Safety**
TypeScript puede inferir mejor los tipos y detectar errores en tiempo de compilación.

### 4. **Escalabilidad**
Fácil agregar nuevos dominios sin crear tipos wrapper innecesarios.

## Ejemplos por Dominio

### Usuarios
```typescript
// Modelo de usuario
import type { User } from '@/types/models/user';

// Formulario de perfil
import type { ProfileFormData } from '@/types/forms/profile-form';

// Respuesta de API - Usar ApiResponse directamente
import type { ApiResponse } from '@/types/api';

// En uso
const response: ApiResponse<User> = await api.get('/user/profile');
```

### Reservas
```typescript
// Modelo de reserva
import type { ReservationWithRelations } from '@/types/api-responses/reservation';

// Formulario de reserva
import type { CreateReservationFormData } from '@/types/forms/reservation-form';

// Respuesta de API - Usar ApiResponse directamente
import type { ApiResponse } from '@/types/api';

// En uso
const response: ApiResponse<ReservationWithRelations> = await api.post('/reservations', data);
```

### Clubs
```typescript
// Modelo de club
import type { ClubSimple } from '@/types/api-responses/club';

// Formulario de club
import type { ClubFormData } from '@/types/forms/admin-forms';

// Respuesta de API - Usar ApiResponse directamente
import type { ApiResponse } from '@/types/api';

// En uso
const response: ApiResponse<ClubSimple[]> = await api.get('/clubs');
```
