"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { submitContactForm } from "@/actions/contact-us";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaXTwitter, FaFacebook, FaTumblr } from "react-icons/fa6";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactUs() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("subject", data.subject);
    formData.append("message", data.message);

    const result = await submitContactForm(formData);

    if (result.success) {
      toast.success(
        "Message Sent! Thank you for reaching out. Our team will contact you within 24 hours.",
        { duration: 5000 }
      );
      form.reset();
    } else {
      toast.error(`Error: ${result.message}`, { duration: 5000 });
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-lg shadow-sm p-8 ">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-blue-400">
              We&apos;d love to hear from you!
            </p>
          </div>

          <section className="mb-10 text-muted-foreground">
            <p className="text-lg leading-relaxed text-muted-foreground">
              At OpenNews, we value your feedback and are here to help with any
              questions or concerns. Please reach out using any of the methods
              below, and our team will get back to you as soon as possible.
            </p>
          </section>

          <section className="mb-10 ">
            <h2 className="text-2xl font-semibold text-blue-400 mb-6 border-b pb-2">
              Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-3 text-gray-800">
                    General Inquiries
                  </h3>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaEnvelope className="text-blue-400" />
                    <strong>Email:</strong> info@opennews.com
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaPhone className="text-blue-400" />
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3 text-gray-800">
                    Customer Support
                  </h3>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaEnvelope className="text-blue-400" />
                    <strong>Email:</strong> support@opennews.com
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaPhone className="text-blue-400" />
                    <strong>Phone:</strong> +1 (555) 987-6543
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-3 text-gray-800">
                    Press & Media
                  </h3>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaEnvelope className="text-blue-400" />
                    <strong>Email:</strong> press@opennews.com
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaPhone className="text-blue-400" />
                    <strong>Phone:</strong> +1 (555) 456-7890
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-3 text-gray-800">
                    Office Location
                  </h3>
                  <p className="flex items-start gap-2 text-gray-600">
                    <FaMapMarkerAlt className="text-blue-400 mt-1" />
                    <span>
                      OpenNews Headquarters
                      <br />
                      123 News Street
                      <br />
                      Media City, MC 12345
                      <br />
                      United States
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-blue-400 mb-6 border-b pb-2">
              Send Us a Message
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Button type="submit">Send Message</Button>
                </div>
              </form>
            </Form>
          </section>

          <section className="mb-10 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-blue-400 mb-6 border-b pb-2">
              Business Hours
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST
              </p>
              <p>
                <strong>Saturday:</strong> 10:00 AM - 2:00 PM EST
              </p>
              <p>
                <strong>Sunday:</strong> Closed
              </p>
              <p className="mt-4">
                <em>
                  * Customer support available 24/7 for breaking news and urgent
                  matters.
                </em>
              </p>
            </div>
          </section>

          <section className="mb-10 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-blue-400 mb-6 border-b pb-2">
              Follow Us
            </h2>
            <div className="flex flex-col space-y-6 ">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="https://twitter.com/opennews"
                  className="flex items-center gap-3 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#030303] hover:bg-[#1d1e1f] text-white transition-all duration-300 shadow-lg hover:shadow-[#1d9bf0]/30 hover:-translate-y-1 ">
                    <FaXTwitter size={20} className="relative z-10" />
                  </div>
                  <span className=" text-gray-700 dark:text-gray-300 group-hover:text-[#2c2d2e] transition-colors duration-300">
                    @Alien_Tech_FusionHQ
                  </span>
                </Link>

                <Link
                  href="https://facebook.com/AlienTechFusion"
                  className="flex items-center gap-3 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] hover:bg-[#0d65d9] text-white transition-all duration-300 shadow-lg hover:shadow-[#1877F2]/30 hover:-translate-y-1">
                    <FaFacebook size={20} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#1877F2] transition-colors duration-300">
                    @AlienTechFusion
                  </span>
                </Link>

                <Link
                  href="https://instagram.com/AlienTechFusion"
                  className="flex items-center gap-3 group"
                >
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-full text-white transition-all duration-300 shadow-lg hover:shadow-[#E1306C]/30 hover:-translate-y-1 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FFDC80] via-[#E1306C] to-[#833AB4]"></div>
                    <FaInstagram size={20} className="relative z-10" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#E1306C] transition-colors duration-300">
                    @alien.tech.fusion
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="https://tumblr.com/AlienTechFusion"
                  className="flex items-center gap-3 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#34526f] hover:bg-[#2a4259] text-white transition-all duration-300 shadow-lg hover:shadow-[#34526f]/30 hover:-translate-y-1">
                    <FaTumblr size={20} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#34526f] transition-colors duration-300">
                    @AlienTechFusion-tumblr
                  </span>
                </Link>

                <Link
                  href="https://linkedin.com/company/AlienTechFusion"
                  className="flex items-center gap-3 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0A66C2] hover:bg-[#0952a0] text-white transition-all duration-300 shadow-lg hover:shadow-[#0A66C2]/30 hover:-translate-y-1">
                    <FaLinkedinIn size={20} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#0A66C2] transition-colors duration-300">
                    AlienTechFusion
                  </span>
                </Link>

                <Link
                  href="https://youtube.com/AlienTechFusion"
                  className="flex items-center gap-3 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FF0000] hover:bg-[#d90000] text-white transition-all duration-300 shadow-lg hover:shadow-[#FF0000]/30 hover:-translate-y-1">
                    <FaYoutube size={20} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#FF0000] transition-colors duration-300">
                    @AlienTechFusionOfficial
                  </span>
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-10 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-blue-400 mb-6 border-b pb-2">
              Find Us
            </h2>
            <div className="w-full h-80 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-[#e8e8e8] dark:bg-[#1a1a1a]">
                <div className="absolute w-[85%] h-[2px] bg-[#c4c4c4] dark:bg-[#3a3a3a] top-[30%] left-[5%]"></div>
                <div className="absolute w-[2px] h-[60%] bg-[#c4c4c4] dark:bg-[#3a3a3a] top-[20%] left-[30%]"></div>
                <div className="absolute w-[2px] h-[40%] bg-[#c4c4c4] dark:bg-[#3a3a3a] top-[40%] left-[70%]"></div>
                <div className="absolute w-[40%] h-[2px] bg-[#c4c4c4] dark:bg-[#3a3a3a] top-[60%] left-[30%]"></div>

                <div className="absolute w-[30%] h-[1px] bg-[#d4d4d4] dark:bg-[#2d2d2d] top-[45%] left-[50%]"></div>
                <div className="absolute w-[1px] h-[25%] bg-[#d4d4d4] dark:bg-[#2d2d2d] top-[35%] left-[50%]"></div>
                <div className="absolute w-[20%] h-[1px] bg-[#d4d4d4] dark:bg-[#2d2d2d] top-[25%] left-[30%]"></div>

                <div className="absolute w-[15%] h-[1px] bg-[#d4d4d4] dark:bg-[#2d2d2d] top-[55%] left-[65%]"></div>
                <div className="absolute w-[1px] h-[18%] bg-[#d4d4d4] dark:bg-[#2d2d2d] top-[42%] left-[25%]"></div>
                <div className="absolute w-[10%] h-[1px] bg-[#d4d4d4] dark:bg-[#2d2d2d] top-[65%] left-[15%]"></div>

                <div className="absolute w-[10%] h-[8%] bg-[#cccccc] dark:bg-[#333333] top-[22%] left-[25%]"></div>
                <div className="absolute w-[8%] h-[10%] bg-[#cccccc] dark:bg-[#333333] top-[35%] left-[55%]"></div>
                <div className="absolute w-[12%] h-[6%] bg-[#cccccc] dark:bg-[#333333] top-[50%] left-[40%]"></div>
                <div className="absolute w-[6%] h-[12%] bg-[#cccccc] dark:bg-[#333333] top-[55%] left-[20%]"></div>
                <div className="absolute w-[9%] h-[9%] bg-[#cccccc] dark:bg-[#333333] top-[65%] left-[60%]"></div>

                <div className="absolute w-[7%] h-[7%] bg-[#d2d2d2] dark:bg-[#2c2c2c] top-[18%] left-[45%]"></div>
                <div className="absolute w-[5%] h-[8%] bg-[#d2d2d2] dark:bg-[#2c2c2c] top-[70%] left-[50%]"></div>
                <div className="absolute w-[11%] h-[5%] bg-[#d2d2d2] dark:bg-[#2c2c2c] top-[38%] left-[15%]"></div>
                <div className="absolute w-[6%] h-[6%] bg-[#d2d2d2] dark:bg-[#2c2c2c] top-[28%] left-[75%]"></div>

                <div className="absolute w-[15%] h-[15%] rounded-full bg-[#d1e7dd] dark:bg-[#1e3a2f] top-[20%] left-[60%]"></div>
                <div className="absolute w-[12%] h-[12%] rounded-full bg-[#d1e7dd] dark:bg-[#1e3a2f] top-[70%] left-[30%]"></div>
                <div className="absolute w-[8%] h-[8%] rounded-full bg-[#d1e7dd] dark:bg-[#1e3a2f] top-[40%] left-[85%]"></div>

                <div className="absolute w-[30%] h-[20%] rounded-[50%] bg-[#cfe2ff] dark:bg-[#1a2c44] top-[10%] left-[10%]"></div>

                <div className="absolute w-[20px] h-[20px] bg-blue-500 dark:bg-blue-400 rounded-full top-[45%] left-[45%] z-10 shadow-lg">
                  <div className="absolute w-[30px] h-[30px] bg-blue-400 dark:bg-blue-500 rounded-full opacity-75 -top-[5px] -left-[5px] animate-ping"></div>
                </div>

                <div className="absolute w-[20%] h-[15%] border border-[#d0d0d0] dark:border-[#333333] top-[15%] left-[35%]"></div>
                <div className="absolute w-[15%] h-[25%] border border-[#d0d0d0] dark:border-[#333333] top-[45%] left-[65%]"></div>

                <div className="absolute top-[46%] left-[48%] text-sm font-bold text-gray-700 dark:text-gray-200">
                  OpenNews HQ
                </div>

                <div className="absolute top-[28%] left-[40%] text-xs text-gray-500 dark:text-gray-400 rotate-0">
                  News Street
                </div>
                <div className="absolute top-[40%] left-[32%] text-xs text-gray-500 dark:text-gray-400 rotate-90">
                  Media Avenue
                </div>
                <div className="absolute top-[58%] left-[45%] text-xs text-gray-500 dark:text-gray-400 rotate-0">
                  Press Boulevard
                </div>
                <div className="absolute top-[20%] left-[70%] text-xs text-gray-500 dark:text-gray-400 rotate-45">
                  Journalist Way
                </div>
              </div>

              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
                data-dark-style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                }}
              ></div>

              <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-gray-800/80 p-2 rounded-md text-xs backdrop-blur-sm">
                <p className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>{" "}
                  OpenNews Headquarters
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  123 News Street, Media City
                </p>
                <div className="mt-1 flex gap-3">
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#d1e7dd] dark:bg-[#1e3a2f]"></span>
                    <span>Parks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm bg-[#cfe2ff] dark:bg-[#1a2c44]"></span>
                    <span>Lake</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-10 h-1 bg-gray-400 dark:bg-gray-500"></div>
                  <span className="text-gray-500 dark:text-gray-400">500m</span>
                </div>
              </div>
            </div>
          </section>

          <section className="text-center pt-8 border-t text-muted-foreground">
            <p className="text-sm text-gray-400">
              The information you provide will be processed in accordance with
              our{" "}
              <Link
                href="/privacy-policy"
                className="text-blue-400 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaTwitter, FaInstagram, FaGlobe, FaYoutube } from "react-icons/fa";

// export default function ContactPage() {
//   return (
//     <main className="px-4 py-12">
//       <Card>
//         <CardHeader>
//           <CardTitle>Contact UFO 🛸NEWS</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6 text-muted-foreground">
//           <div className="space-y-2">
//             <p className="flex items-center gap-2">
//               <FaEnvelope className="text-primary" /> hello@ufonews.fake
//             </p>
//             <p className="flex items-center gap-2">
//               <FaPhone className="text-primary" /> +46 (111) 123-UFO1
//             </p>
//             <p className="flex items-center gap-2">
//               <FaMapMarkerAlt className="text-primary" /> 123 Area 51 Road, Roswell, NM 87544
//             </p>
//           </div>

//           {/* SM links */}
//           <div>
//             <h3 className="font-semibold text-primary mb-2">Follow us on the Cosmic Web:</h3>
//             <div className="flex flex-wrap gap-4">
//               <a href="#" className="hover:text-primary flex items-center gap-2">
//                 <FaTwitter /> @UFO_NewsHQ
//               </a>
//               <a href="#" className="hover:text-primary flex items-center gap-2">
//                 <FaInstagram /> @ufo.news
//               </a>
//               <a href="#" className="hover:text-primary flex items-center gap-2">
//                 <FaGlobe /> www.ufonews.fake
//               </a>
//               <a href="#" className="hover:text-primary flex items-center gap-2">
//                 <FaYoutube /> UFO News Channel
//               </a>
//             </div>
//           </div>

//           <p className="text-sm pt-4 text-center italic">
//             We don&apos;t actually communicate through earthly channels. But we appreciate your curiosity. 🛸
//           </p>
//         </CardContent>
//       </Card>
//     </main>
//   );
// }
