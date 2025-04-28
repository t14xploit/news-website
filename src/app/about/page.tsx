import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowBigRight } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="px-4 py-12 font-inika">
      <Card>
        <CardHeader>
          <CardTitle>
          <h2 className="text-2xl font-bold  flex items-center gap-2">
          About Panda🐼NEWS <ArrowBigRight className="w-6 h-6 text-primary" />
      </h2> </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                width={500}
                height={500}
                src="https://media.giphy.com/media/TObbUke0z8Mo/giphy.gif"
                alt="Sliding Panda"
                className="w-full h-auto max-h-72 rounded-lg shadow object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 space-y-4">
              <p>
                At <strong>PandaNEWS</strong>, we believe the world deserves better news. We deliver clear, trustworthy, and real-time updates with a focus on what truly matters.
              </p>
              <p>
                Whether it’s breaking stories, global trends, or local updates — we keep you informed with calm clarity and zero fluff. Just the news, like pandas prefer it: peaceful and focused.
              </p>
              <p>
                Founded in 2025 by a group of curious minds and caffeine enthusiasts, PandaNEWS is independent, reader-first, and always evolving. Thanks for joining the bamboo grove of smart news readers. 🌿
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
