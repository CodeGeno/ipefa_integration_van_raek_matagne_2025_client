import {ReactNode} from 'react';
import UnauthenticatedLayout from '@/components/layout/unathenticated-layout';

const SecurityLayout=({children}: {children:ReactNode})=>{
    return <UnauthenticatedLayout>{children}</UnauthenticatedLayout>
}
export default SecurityLayout