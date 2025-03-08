"use client"
import {ReactNode} from 'react';
import {Button} from '@/components/ui';
import { MdOutlineDarkMode,MdOutlineLightMode } from "react-icons/md";
import {useTheme} from 'next-themes';


const UnauthenticatedLayout: React.FC<{children:ReactNode}> = ({children}) => {
    const {setTheme}=useTheme();
    const selectedTheme=localStorage.getItem("theme")??"light";
    return <div>
        <div className="flex justify-end pt-5 pr-5">
            <Button onClick={()=>setTheme(selectedTheme==="light"?"dark":"light")}>
                {selectedTheme==="light"?
                    <MdOutlineDarkMode/> : <MdOutlineLightMode/>}
            </Button>
        </div>
        {children}
    </div>
}

export default UnauthenticatedLayout