import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { booths } from '@/src/mocks/booths';
import { BOOTH_TYPE } from '@/src/shared/constants/boothType';
import BoothCard from './boothCard';

export default function BoothTab() {
  return (
    <Tabs defaultValue="F&B">
      <TabsList className="flex gap-2 bg-transparent">
        {BOOTH_TYPE.map((type) => (
          <TabsTrigger
            key={type.value}
            value={type.value}
            className="
          rounded-full px-3 py-1 text-caption-M-medium cursor-pointer
          border border-color-gray-500
          data-[state=active]:bg-[var(--color-pink-400)]
          data-[state=active]:text-white
          data-[state=active]:border-[var(--color-pink-400)]
          "
          >
            {type.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {BOOTH_TYPE.map((type) => (
        <TabsContent
          key={type.value}
          value={type.value}
          className="flex flex-col gap-3"
        >
          {booths.content
            .filter((booth) => booth.type === type.value)
            .map((booth) => (
              <BoothCard key={booth.boothId} booth={booth} />
            ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
