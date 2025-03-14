import { useAppDispatch } from '@/redux/hooks'
import { getCurrentUser } from '@/services/authService'
import { Navigate } from 'react-router'
import { useRouter } from './hooks'
import { useEffect } from 'react'
import { fetchProfileByEmail } from '@/redux/slices/userSlice'

export default function PrivatePage({requiredRole, component: Component}: {requiredRole?: string[], component: (() => JSX.Element )| React.LazyExoticComponent<() => JSX.Element>}) {
    const user = getCurrentUser()
    const router = useRouter()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if(requiredRole && !requiredRole.includes(user.role)) {
            router.back()
        }
        dispatch(fetchProfileByEmail());
    }, [])
    
    if(requiredRole && !requiredRole.includes(user.role)) {
        return <Navigate to='/'/>
    }

    return (
        user?.email? <Component /> : <Navigate to='/login' replace/>
    )
}
