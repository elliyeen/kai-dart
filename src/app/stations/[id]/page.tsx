import { notFound } from "next/navigation";
import StationDashboard from "@/components/stations/StationDashboard";
import { STATION_RECORDS, getStationByAnyId } from "@/lib/stations";

export const dynamicParams = false;
export function generateStaticParams() { return STATION_RECORDS.map((r) => ({ id: r.id })); }

export default async function StationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const station = getStationByAnyId(id);
  if (!station) notFound();
  return <StationDashboard station={station} />;
}
