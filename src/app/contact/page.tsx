import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaTwitter, FaInstagram, FaGlobe, FaYoutube } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Contact UFO 🛸NEWS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-primary" /> hello@ufonews.fake
            </p>
            <p className="flex items-center gap-2">
              <FaPhone className="text-primary" /> +46 (111) 123-UFO1
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" /> 123 Area 51 Road, Roswell, NM 87544
            </p>
          </div>

          {/* SM links */}
          <div>
            <h3 className="font-semibold text-primary mb-2">Follow us on the Cosmic Web:</h3>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="hover:text-primary flex items-center gap-2">
                <FaTwitter /> @UFO_NewsHQ
              </a>
              <a href="#" className="hover:text-primary flex items-center gap-2">
                <FaInstagram /> @ufo.news
              </a>
              <a href="#" className="hover:text-primary flex items-center gap-2">
                <FaGlobe /> www.ufonews.fake
              </a>
              <a href="#" className="hover:text-primary flex items-center gap-2">
                <FaYoutube /> UFO News Channel
              </a>
            </div>
          </div>

          <p className="text-sm pt-4 text-center italic">
            We don&apos;t actually communicate through earthly channels. But we appreciate your curiosity. 🛸
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
