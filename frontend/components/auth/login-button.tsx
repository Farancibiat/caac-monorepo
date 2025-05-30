import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth"

export const LoginButton = () => {
  const { signInWithGoogle, user, signOut } = useAuthStore()

  return (
    <div>
      {user ? (
        <Button onClick={signOut} variant="outline">
          Cerrar sesión
        </Button>
      ) : (
        <Button onClick={signInWithGoogle}>
          Iniciar sesión con Google
        </Button>
      )}
    </div>
  )
} 