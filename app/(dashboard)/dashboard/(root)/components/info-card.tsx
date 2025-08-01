import React from 'react';
import IconBadge from '@/components/icon-badge';
import { LucideIcon } from 'lucide-react';
 
interface InfoCardProps {
    numberOfItems: number;
    variant?: 'default' | 'success';
    label: string;
    icon: LucideIcon;
}

const InfoCard = ({ 
    icon: Icon, 
    label, 
    numberOfItems,
    variant 
}: InfoCardProps) => {

    return (
    <div className='border flex items-center gap-x-2 p-2 px-4 w-fit rounded-full'>
        <IconBadge 
            variant={variant}
            icon={Icon}
            size="sm"
        />
        <div>
            <p className='font-medium text-sm'>
                {label}
            </p>
            <p className='text-xs text-gray-500'>
                {numberOfItems} courses
            </p>
        </div>

    </div>

    );
};

export default InfoCard;