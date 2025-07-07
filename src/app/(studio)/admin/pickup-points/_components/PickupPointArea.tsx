'use client';
import { PickupPoint } from '@/types/pickup-point';

import PickupPointItem from './PickupPointItem'
import Pagination from '@/components/Common/Pagination';
import usePagination from '@/hooks/usePagination';

export default function PickupPointArea({ points }: { points: PickupPoint[] }) {
    const per_page = 10;
    const { currentItems, handlePageClick, pageCount } = usePagination(points, per_page)
    return (
        <>
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-gray-3">
                        <th className="px-6 py-3 text-sm font-medium text-left">Id</th>
                        <th className="px-6 py-3 text-sm font-medium text-left">Name</th>
                        <th className="px-6 py-3 text-sm font-medium text-left">Kota</th>
                        <th className="px-6 py-3 text-sm font-medium text-left">Provinsi</th>
                        <th className="px-6 py-3 text-sm font-medium text-left">Status</th>
                        <th className="px-6 py-3 text-sm font-medium text-right">
                            Actions
                        </th> 
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-3">
                    {currentItems?.map((point) => (
                        <PickupPointItem key={point.id} pickupPoint={point} />
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            {points?.length > per_page && (
                <div className="flex justify-center pb-6 pagination">
                    <Pagination
                        handlePageClick={handlePageClick}
                        pageCount={pageCount}
                    />
                </div>
            )}
        </>
    )
}
