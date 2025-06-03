"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  FaLightbulb,
  FaGlobeAmericas,
  FaRegClock,
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTumblr,
  FaYoutube,
} from "react-icons/fa";
import {
  FaA,
  FaB,
  FaC,
  FaG,
  FaI,
  FaN,
  FaP,
  FaR,
  FaT,
  FaXTwitter,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";

export default function AboutUs() {
  const missionRef = useRef(null);
  const historyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);

  const missionInView = useInView(missionRef, { once: true });
  const historyInView = useInView(historyRef, { once: true });
  const valuesInView = useInView(valuesRef, { once: true });
  const teamInView = useInView(teamRef, { once: true });

  const missionControls = useAnimation();
  const historyControls = useAnimation();
  const valuesControls = useAnimation();
  const teamControls = useAnimation();

  useEffect(() => {
    if (missionInView) missionControls.start("visible");
    if (historyInView) historyControls.start("visible");
    if (valuesInView) valuesControls.start("visible");
    if (teamInView) teamControls.start("visible");
  }, [
    missionInView,
    historyInView,
    valuesInView,
    teamInView,
    missionControls,
    historyControls,
    valuesControls,
    teamControls,
  ]);

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  return (
    <div className="min-h-screen font-sans">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="rounded-lg shadow-sm p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About OpenNews</h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-lg text-blue-400">
                Pushing the Boundaries of Information Since 2010
              </p>
            </motion.div>
          </div>

          <section className="mb-16">
            <div className="perspective-1000">
              <motion.div
                initial={{ rotateX: 15, rotateY: -15 }}
                animate={{ rotateX: 0, rotateY: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900 rounded-2xl p-8 shadow-xl transform-gpu"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-400 rounded-full opacity-20 z-0 blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-indigo-500 rounded-full opacity-20 z-0 blur-3xl"></div>

                <motion.div
                  className="relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  <p className="text-xl leading-relaxed mb-6 text-gray-700 dark:text-gray-200 ">
                    <span className="font-semibold">OpenNews</span> is a leading
                    online resource for obtaining up-to-date and reliable news
                    from around the world. We strive to provide objective,
                    timely, and in-depth information to our audience, helping
                    people better understand the events that impact their lives.
                  </p>

                  <div className="flex flex-wrap justify-center gap-8 mt-8">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                        <FaLightbulb size={28} className="text-white" />
                      </div>
                      <span className="font-medium ">Innovation</span>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                        <FaGlobeAmericas size={28} className="text-white" />
                      </div>
                      <span className="font-medium">Global Reach</span>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                        <FaRegClock size={28} className="text-white" />
                      </div>
                      <span className="font-medium">24/7 Coverage</span>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          <motion.section
            ref={missionRef}
            initial="hidden"
            animate={missionControls}
            variants={fadeIn}
            className="mb-16 text-muted-foreground"
          >
            <h2 className="text-2xl font-semibold text-blue-400 mb-6 border-b pb-2">
              Our Mission
            </h2>
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-blue-900 p-6 shadow-md transform hover:rotate-1 transition-transform duration-300">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 z-0 blur-3xl"></div>

              <p className="text-lg leading-relaxed relative z-10 text-gray-700 dark:text-gray-200">
                OpenNews&apos; mission is to provide the audience with
                objective, timely, and reliable information about events around
                the world. We strive to present diverse perspectives, analyze
                complex topics, and help our readers form their own opinions
                based on verified facts. Our goal is to contribute to a better
                understanding of the world and informed decision-making.
              </p>

              <motion.div
                className="mt-6 w-16 h-1 bg-blue-500"
                animate={{ width: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </div>
          </motion.section>

          <motion.section
            ref={historyRef}
            initial="hidden"
            animate={historyControls}
            variants={fadeIn}
            className="mb-16 text-muted-foreground"
          >
            <h2 className="text-2xl font-semibold text-blue-400 mb-6 border-b pb-2">
              Our History
            </h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-600 transform-gpu hover:scale-y-105 transition-transform duration-300"></div>

              <div className="space-y-10 ml-12">
                <motion.div
                  custom={0}
                  initial="hidden"
                  animate={historyInView ? "visible" : "hidden"}
                  variants={staggerVariants}
                  className="relative"
                >
                  <div className="absolute -left-16 top-0 w-8 h-8 bg-blue-500 rounded-full shadow-md"></div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    2010: Founding
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    OpenNews was founded by a group of journalists with the goal
                    of creating an independent, objective news source in the
                    digital age. We started as a small blog focused on
                    technology news.
                  </p>
                </motion.div>

                <motion.div
                  custom={1}
                  initial="hidden"
                  animate={historyInView ? "visible" : "hidden"}
                  variants={staggerVariants}
                  className="relative"
                >
                  <div className="absolute -left-16 top-0 w-8 h-8 bg-blue-500 rounded-full shadow-md"></div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    2015: Global Expansion
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Expanded coverage to global news and opened regional offices
                    in Europe, Asia, and Latin America. Our audience grew to one
                    million active readers.
                  </p>
                </motion.div>

                <motion.div
                  custom={2}
                  initial="hidden"
                  animate={historyInView ? "visible" : "hidden"}
                  variants={staggerVariants}
                  className="relative"
                >
                  <div className="absolute -left-16 top-0 w-8 h-8 bg-blue-500 rounded-full shadow-md"></div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    2020: Digital Transformation
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Launched an updated digital platform with personalized news
                    feeds, interactive visualizations, and multimedia content.
                    Integrated artificial intelligence to improve content
                    curation.
                  </p>
                </motion.div>

                <motion.div
                  custom={3}
                  initial="hidden"
                  animate={historyInView ? "visible" : "hidden"}
                  variants={staggerVariants}
                  className="relative"
                >
                  <div className="absolute -left-16 top-0 w-8 h-8 bg-blue-500 rounded-full shadow-md"></div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Today: Leading News Platform
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    As of June 02, 2025, OpenNews is a cutting-edge news
                    platform with over 5 million daily readers. We continue to
                    innovate and set new standards in digital journalism.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>

          <motion.section
            ref={valuesRef}
            initial="hidden"
            animate={valuesControls}
            variants={fadeIn}
            className="mb-16 text-muted-foreground"
          >
            <h2 className="text-2xl font-semibold text-blue-400 mb-6 border-b pb-2">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                variants={cardVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform-gpu hover:translate-y-[-5px] transition-transform duration-300"
              >
                <h3 className="text-xl font-bold mb-4 text-blue-600">
                  Accuracy and Reliability
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We adhere to the highest journalistic standards and verify
                  every fact before publication. Our commitment to truth is the
                  foundation of our readers&apos; trust.
                </p>
              </motion.div>

              <motion.div
                variants={cardVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform-gpu hover:translate-y-[-5px] transition-transform duration-300"
              >
                <h3 className="text-xl font-bold mb-4 text-blue-600">
                  Independence
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We maintain editorial independence and freedom from external
                  influence, allowing us to cover all events objectively.
                </p>
              </motion.div>

              <motion.div
                variants={cardVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform-gpu hover:translate-y-[-5px] transition-transform duration-300"
              >
                <h3 className="text-xl font-bold mb-4 text-blue-600">
                  Innovation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We constantly explore new formats and technologies to create
                  more informative, engaging, and accessible news.
                </p>
              </motion.div>

              <motion.div
                variants={cardVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform-gpu hover:translate-y-[-5px] transition-transform duration-300"
              >
                <h3 className="text-xl font-bold mb-4 text-blue-600">
                  Global Perspective
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We strive to present diverse perspectives from around the
                  world, creating a comprehensive picture of global events.
                </p>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            ref={teamRef}
            initial="hidden"
            animate={teamControls}
            variants={fadeIn}
            className="mb-16 text-muted-foreground"
          >
            <h2 className="text-2xl font-semibold text-blue-400 mb-6 border-b pb-2">
              Our Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transform-gpu hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-600 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-white dark:bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-blue-500">
                      SW
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">Sophie Westin</h3>
                  <p className="text-blue-500">TD</p>
                  <p className="text-blue-500 mb-4">Technical Director</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Expert in digital media and data analytics, leading the
                    platform&apos;s technical development.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transform-gpu hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-600 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-white dark:bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-blue-500">
                      KLN
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">Kristi El Ninja</h3>
                  <p className="text-blue-500 ">EIC</p>
                  <p className="text-blue-500 mb-4">Editor-in-Chief</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Over 20 years of experience in journalism, former
                    correspondent for international news agencies.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transform-gpu hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-600 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-white dark:bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-blue-500">
                      SW
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">Stanislava Westin</h3>
                  <p className="text-blue-500">FD</p>
                  <p className="text-blue-500 mb-4">Financial Director</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Specialist in strategic planning with extensive experience
                    in the media business.
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="mt-10 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Meet the Entire Team
              </motion.button>
            </div>
          </motion.section>

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
                    @Open_NewsHQ
                  </span>
                </Link>

                <Link
                  href="https://facebook.com/opennews"
                  className="flex items-center gap-3 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] hover:bg-[#0d65d9] text-white transition-all duration-300 shadow-lg hover:shadow-[#1877F2]/30 hover:-translate-y-1">
                    <FaFacebook size={20} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#1877F2] transition-colors duration-300">
                    @OpenNews
                  </span>
                </Link>

                <Link
                  href="https://instagram.com/opennews"
                  className="flex items-center gap-3 group"
                >
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-full text-white transition-all duration-300 shadow-lg hover:shadow-[#E1306C]/30 hover:-translate-y-1 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FFDC80] via-[#E1306C] to-[#833AB4]"></div>
                    <FaInstagram size={20} className="relative z-10" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#E1306C] transition-colors duration-300">
                    @open.news
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="https://tumblr.com/opennews"
                  className="flex items-center gap-3 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#34526f] hover:bg-[#2a4259] text-white transition-all duration-300 shadow-lg hover:shadow-[#34526f]/30 hover:-translate-y-1">
                    <FaTumblr size={20} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#34526f] transition-colors duration-300">
                    @opennews-tumblr
                  </span>
                </Link>

                <Link
                  href="https://linkedin.com/company/opennews"
                  className="flex items-center gap-3 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0A66C2] hover:bg-[#0952a0] text-white transition-all duration-300 shadow-lg hover:shadow-[#0A66C2]/30 hover:-translate-y-1">
                    <FaLinkedinIn size={20} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#0A66C2] transition-colors duration-300">
                    OpenNews
                  </span>
                </Link>

                <Link
                  href="https://youtube.com/opennews"
                  className="flex items-center gap-3 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#FF0000] hover:bg-[#d90000] text-white transition-all duration-300 shadow-lg hover:shadow-[#FF0000]/30 hover:-translate-y-1">
                    <FaYoutube size={20} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#FF0000] transition-colors duration-300">
                    @OpenNewsOfficial
                  </span>
                </Link>
              </div>
            </div>
          </section>

          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mb-16 text-muted-foreground"
          >
            <h2 className="text-2xl font-semibold text-blue-400 mb-6 border-b pb-2">
              Our Partners
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              <Link
                href="https://news.google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="w-64 h-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform-gpu perspective-1000 hover:shadow-xl"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="mb-4 flex-grow flex items-center justify-center">
                      <FaG className="text-6xl size-20 text-blue-500" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-blue-500 mb-2">
                        Google News
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Leading news aggregator and our strategic partner for
                        content distribution.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>

              <Link
                href="https://reuters.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-64 h-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform-gpu perspective-1000 hover:shadow-xl"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="mb-4 flex-grow flex items-center justify-center">
                      <FaT className="text-6xl size-20 text-blue-500" />
                      <FaR className="text-6xl size-20 text-blue-500" />
                      <FaI className="text-6xl size-20 text-blue-500" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-blue-500 mb-2">
                        Reuters
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        International news agency, with which we collaborate on
                        source and report exchanges.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>

              <Link
                href="https://bloomberg.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="w-64 h-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform-gpu perspective-1000 hover:shadow-xl"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="mb-4 flex-grow flex items-center justify-center">
                      <FaB className="text-6xl size-20 text-blue-500" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-blue-500 mb-2">
                        Bloomberg
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Our key partner for financial news and analytical data
                        for economic reports.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>

              <Link
                href="https://apnews.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="w-64 h-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform-gpu perspective-1000 hover:shadow-xl"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="mb-4 flex-grow flex items-center justify-center">
                      <FaA className="text-6xl size-20 text-blue-500" />
                      <FaP className="text-6xl size-20 text-blue-500" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-blue-500 mb-2">
                        Associated Press
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Collaboration with AP provides access to a global
                        network of journalists and photo reporters.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>

              <Link
                href="https://cnn.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="w-64 h-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform-gpu perspective-1000 hover:shadow-xl"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="mb-4 flex-grow flex items-center justify-center">
                      <FaC className="text-6xl size-20 text-blue-500" />
                      <FaN className="text-6xl size-20 text-blue-500" />
                      <FaN className="text-6xl size-20 text-blue-500" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-blue-500 mb-2">
                        CNN
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Collaboration for video content and breaking news
                        coverage across global events.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>

              <Link
                href="https://bbc.com/news"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="w-64 h-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform-gpu perspective-1000 hover:shadow-xl"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="mb-4 flex-grow flex items-center justify-center">
                      <FaB className="text-6xl size-20 text-blue-500" />
                      <FaB className="text-6xl size-20 text-blue-500" />
                      <FaC className="text-6xl size-20 text-blue-500" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-blue-500 mb-2">
                        BBC News
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Partnership for international reporting and documentary
                        content sharing.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>

            <div className="mt-10 text-center">
              <Button
                variant="outline"
                className="border-blue-400 text-blue-500 hover:bg-blue-50"
              >
                View All Partners
              </Button>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mb-16"
          >
            <h2 className="text-2xl font-semibold text-blue-400 mb-6 border-b pb-2">
              Contact Us
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <p className="flex items-center gap-2">
                      <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        info@opennews.com
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        +1 (555) 123-4567
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        123 News Street, Media City, MC 12345
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Feedback Form</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-md transition duration-300 flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Write to Us
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-20 pt-8 border-t text-center"
          >
            <p className="text-gray-500">
              © {new Date().getFullYear()} OpenNews. All rights reserved.
            </p>
          </motion.footer>
        </div>
      </main>
    </div>
  );
}
