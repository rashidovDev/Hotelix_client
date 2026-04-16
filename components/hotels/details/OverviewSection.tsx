import {
  Bath,
  Car,
  Clock3,
  KeyRound,
  Snowflake,
  Wifi,
} from "lucide-react";

const amenityItems = [
  { label: "Free Wifi", icon: Wifi },
  { label: "Free parking", icon: Car },
  { label: "Air conditioning", icon: Snowflake },
  { label: "24-hour front desk", icon: Clock3 },
  { label: "Private bathroom", icon: Bath },
  { label: "Key card access", icon: KeyRound },
];

export default function OverviewSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Property overview</h2>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
          {amenityItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-700"
              >
                <Icon className="h-4 w-4 text-blue-600" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="h-[150px] w-full rounded-2xl bg-gray-100 lg:w-[320px]">
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Map placeholder
          </div>
        </div>
      </div>
    </section>
  );
}
