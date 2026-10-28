import { DealDetail } from '@/components/portugal/deal-detail';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <DealDetail id={decodeURIComponent(id)}/>;}
