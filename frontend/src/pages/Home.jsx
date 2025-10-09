import "../App.css";
import { ReactLenis } from "@studio-freight/react-lenis";
// import { useRef } from 'react';
import gsap from "gsap";
//import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import RippleButton from "../components/RippleButton";
import Image from "../components/Image";
import Footer from "../components/Footer";
// Add this import at the top
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faEye,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import Eyes from "../components/Home/eye";
import { Link } from "react-router-dom";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const Home = () => {
  useGSAP(() => {
    let tl = gsap.timeline();
    tl.from(".hero svg", {
      x: -400,
      opacity: 0,
      y: -400,
      duration: 1,
      ease: "back.out",
    })
      .from(".hero h1", {
        yPercent: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power2.inOut",
      })
      .from(".hero p", {
        // Removed video from this animation
        yPercent: 10,
        opacity: 0,
        stagger: 0.2,
        ease: "power2.inOut",
      })
      .from(".eye-container", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
  });

  useGSAP(() => {
    gsap.to(".hero", {
      scale: 0.8,
      opacity: 0,
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom 80%",
        scrub: 1,
      },
    });
  });

  // Modify this animation to prevent overlap
  useGSAP(() => {
    gsap.to(".video", {
      y: 100,
      scale: 1.8,
      transformOrigin: "left bottom",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
  });

  // Remove or modify this pin to prevent overlap
  // useGSAP(() => {
  //   ScrollTrigger.create({
  //     trigger: ".about-this",
  //     start: "top 30%",
  //     end: "bottom bottom",
  //     pin: ".video",
  //   });
  // });

  // New animation for the feature sections
  useGSAP(() => {
    gsap.from(".page", {
      opacity: 0,
      y: 50,
      stagger: 0.3,
      duration: 1,
      scrollTrigger: {
        trigger: ".about-this",
        start: "top 70%",
        end: "center center",
        scrub: 1,
      },
    });
  });

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
      <div className="main">
        {/* content */}
        <div className="hero">
          <p>
            Empowering Safety Through Real-Time Insights <br />
            Protecting Women with Advanced Analytics
          </p>
          {/* Eye animation below the title */}
          <div className="eye-container flex justify-center my-6">
            <Eyes />
          </div>
          <h1>Safe Watch</h1>
          <svg
            width="28"
            height="28"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.01 0.226198C5.04413 0.226198 0.228302 5.04202 0.228302 11.0079C0.228302 16.9738 5.04413 21.7896 11.01 21.7896C16.9759 21.7896 21.7917 16.9738 21.7917 11.0079C21.7917 5.04202 16.9759 0.226198 11.01 0.226198Z"
              fill="black"
            />
          </svg>

          <div className="hero-cta mt-8">
            <RippleButton text="Get Started" />
            <Link to="/contact">
              <button className="text-white border border-white px-6 py-2 rounded-md ml-4 hover:bg-white hover:text-black transition-all duration-300">
                Learn More
              </button>
            </Link>
          </div>
        </div>

        {/* Add a spacer to prevent overlap */}
        <div className="h-[50vh]"></div>

        {/* Redesigned about-this section with title */}
        {/*<div className="about-this">*/}
        <h2 className="section-title">Our Mission</h2>
        <div className="features-container">
          <div className="page page-1 mb-16">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon
                icon={faShieldAlt}
                className="text-3xl text-[#218EA6] mr-4"
              />
              <h2 className="text-3xl font-bold">
                Empowering Women's Safety with AI
              </h2>
            </div>
            <p className="text-lg font-semibold tracking-wide leading-8 my-3">
              SafeWatch is an AI-driven platform designed to enhance women's
              safety in public spaces. By leveraging real-time monitoring,
              anomaly detection, and gesture recognition, our system proactively
              identifies potential threats and alerts authorities, ensuring a
              safer environment for women everywhere.
            </p>
          </div>

          <div className="page page-2 mb-16 p-8 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon
                icon={faEye}
                className="text-3xl text-[#218EA6] mr-4"
              />
              <h2 className="text-3xl font-bold text-white">
                Real-Time Threat Detection
              </h2>
            </div>
            <p className="text-lg font-semibold tracking-wide leading-8 text-white my-3">
              Our innovative solution combines advanced computer vision and
              machine learning to monitor gender distribution and recognize
              unusual patterns. SafeWatch continuously analyzes public areas,
              identifying risks such as lone women at night or women surrounded
              by men, and generates immediate alerts to prevent incidents.
            </p>
          </div>

          <div className="page page-3 mb-16 p-8 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon
                icon={faChartLine}
                className="text-3xl text-[#218EA6] mr-4"
              />
              <h2 className="text-3xl font-bold text-white">
                Data-Driven Safety Planning
              </h2>
            </div>
            <p className="text-lg font-semibold tracking-wide leading-8 text-white my-3">
              SafeWatch goes beyond real-time protection by offering data-driven
              insights through hotspot mapping. By identifying areas with
              frequent incidents, our platform enables city planners and law
              enforcement to strategically allocate resources and develop
              targeted safety initiatives for long-term impact.
            </p>
          </div>
        </div>

        <div className="stats-section py-16 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a]">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Impact
          </h2>
          <div className="flex justify-center gap-16">
            <div className="stat-item text-center">
              <h3 className="text-4xl font-bold text-white mb-2">95%</h3>
              <p className="text-lg text-white">Accuracy Rate</p>
            </div>
            <div className="stat-item text-center">
              <h3 className="text-4xl font-bold text-white mb-2">500+</h3>
              <p className="text-lg text-white">Incidents Prevented</p>
            </div>
            <div className="stat-item text-center">
              <h3 className="text-4xl font-bold text-white mb-2">24/7</h3>
              <p className="text-lg text-white">Monitoring</p>
            </div>
          </div>
        </div>
        <Image />
      </div>
      <Footer />
    </ReactLenis>
  );
};

export default Home;
