import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaTwitter, FaInstagram, FaGlobe, FaYoutube } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="px-4 py-12 font-inika">
      <Card>
        <CardHeader>
          <CardTitle>Contact Panda🐼NEWS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-primary" /> hello@pandanews.fake
            </p>
            <p className="flex items-center gap-2">
              <FaPhone className="text-primary" /> +46 (111) 123-NEWS
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" /> 123 Bamboo Blvd, Pandatown, ZN 90210
            </p>
          </div>

          {/* SM links */}
          <div>
            <h3 className="font-semibold text-primary mb-2">Follow us:</h3>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="hover:text-primary flex items-center gap-2">
                <FaTwitter /> @PandaNewsHQ
              </a>
              <a href="#" className="hover:text-primary flex items-center gap-2">
                <FaInstagram /> @panda.news
              </a>
              <a href="#" className="hover:text-primary flex items-center gap-2">
                <FaGlobe /> www.pandanews.fake
              </a>
              <a href="#" className="hover:text-primary flex items-center gap-2">
                <FaYoutube /> PandaNEWS Channel
              </a>
            </div>
          </div>

          <p className="text-sm pt-4 text-center italic">
            We don&apos;t actually exist. But we appreciate your curiosity. 🐼
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
