# RedirectMessage Component

Componente estándar para mostrar mensajes de redirección con spinners y estados visuales consistentes.

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `message` | `string?` | `undefined` | Mensaje principal personalizado (opcional) |
| `location` | `string` | **requerido** | Destino de la redirección |
| `variant` | `'loading' \| 'success' \| 'warning' \| 'error'` | `'loading'` | Tipo de mensaje |
| `showSpinner` | `boolean` | `true` | Si mostrar el spinner animado |
| `className` | `string?` | `undefined` | Clases CSS adicionales |

## Variants

### `loading` (default)
- **Color**: Azul primario
- **Icono**: Spinner animado
- **Uso**: Mientras se verifica o procesa algo

### `success`
- **Color**: Verde
- **Icono**: CheckCircle
- **Uso**: Operación exitosa, redirigiendo

### `warning`
- **Color**: Ámbar
- **Icono**: AlertCircle
- **Uso**: Advertencias, falta permisos

### `error`
- **Color**: Rojo
- **Icono**: XCircle
- **Uso**: Errores que requieren redirección

## Ejemplos de Uso

### Básico
```tsx
<RedirectMessage 
  location="dashboard"
/>
// Resultado: "Redirigiendo a dashboard..."
```

### Con mensaje personalizado
```tsx
<RedirectMessage 
  message="Verificando autenticación"
  location="dashboard"
  variant="loading"
/>
```

### Error con botón
```tsx
<RedirectMessage 
  message="Error de autenticación"
  location="login"
  variant="error"
  showSpinner={false}
/>
```

### Éxito
```tsx
<RedirectMessage 
  message="Perfil completado exitosamente"
  location="dashboard"
  variant="success"
/>
```

## Casos de Uso Comunes

### 1. Verificando autenticación
```tsx
if (loading) {
  return (
    <RedirectMessage 
      message="Verificando autenticación"
      location="dashboard"
      variant="loading"
    />
  )
}
```

### 2. Usuario no autenticado
```tsx
if (!user) {
  return (
    <RedirectMessage 
      message="No autenticado"
      location="login"
      variant="warning"
    />
  )
}
```

### 3. Error de autenticación
```tsx
if (error) {
  return (
    <RedirectMessage 
      message="Error de autenticación"
      location="login"
      variant="error"
      showSpinner={false}
    />
  )
}
```

### 4. Perfil incompleto
```tsx
if (shouldCompleteProfile) {
  return (
    <RedirectMessage 
      message="Completando perfil requerido"
      location="complete-profile"
      variant="warning"
    />
  )
}
```

## Estructura Visual

El componente siempre incluye:
- **Fondo**: Gradient de pantalla completa
- **Contenedor**: Centrado con padding responsive
- **Icono**: Spinner animado o icono estático según variant
- **Mensaje principal**: Texto grande y prominente
- **Mensaje secundario**: "Destino: [location]" (si hay mensaje personalizado)
- **Barra de progreso**: Solo en variant "loading"

## Personalización

### Colores por variant
- `loading`: Azul primario del tema
- `success`: Verde estándar
- `warning`: Ámbar/amarillo
- `error`: Rojo estándar

### CSS Custom
```tsx
<RedirectMessage 
  location="dashboard"
  className="custom-class"
/>
``` 