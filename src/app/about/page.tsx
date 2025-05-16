import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="px-4">
      <Card className="border-none">
        <CardHeader>
          <CardTitle>
            <h2 className="text-2xl border-b py-4 font-bold flex items-center gap-2">
            🛸 About UFO News
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                width={500}
                height={500}
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3RodmNqa2t4MTRlMDhlbm1sZGJvMnFmbHYxd2cxNTF0dXhrazA1NSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/r88w2d7tHqazFwNEGN/giphy.gif" 
                alt="Flying Saucer"
                className="w-full h-auto max-h-72 rounded-lg shadow object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 space-y-4">
              <p>
                At <strong>UFO News</strong>, we believe the world deserves better news—especially when it comes to the unknown. We bring you the latest reports on UFO sightings, extraterrestrial encounters, and cosmic discoveries from across the globe.
              </p>
              <p>
                Whether it’s breaking news on alien phenomena, government disclosures, or UFO sightings in your neighborhood — we keep you informed with clarity and excitement. No fluff, just the truth… and maybe a little mystery. 🛸
              </p>
              <p>
                Founded in 2025 by a group of sky-watchers, stargazers, and truth-seekers, UFO News is dedicated to exploring the great unknown while bringing reliable, cutting-edge updates to our ever-curious audience. Thanks for joining us on this journey beyond the stars.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
