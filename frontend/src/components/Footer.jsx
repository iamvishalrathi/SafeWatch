import React from "react";
import RippleButton from "./RippleButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLinkedin, 
  faGithub, 
  faInstagram 
} from "@fortawesome/free-brands-svg-icons";
import { 
  faEnvelope, 
  faPhone, 
  faShieldAlt 
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#2a2a2a] text-white py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Top section with logo and description */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="flex items-center mb-6 md:mb-0">
            <FontAwesomeIcon icon={faShieldAlt} className="text-4xl text-[#218EA6] mr-3" />
            <h2 className="text-2xl font-bold">SafeWatch</h2>
          </div>
          <p className="text-gray-400 max-w-md text-center md:text-right">
            Empowering women's safety through AI-driven monitoring and real-time threat detection.
          </p>
        </div>
        
        {/* Divider */}
        <div className="h-px bg-gray-700 w-full my-8"></div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#218EA6]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/live" className="text-gray-400 hover:text-white transition-colors">
                  Live Monitoring
                </Link>
              </li>
              <li>
                <Link to="/event" className="text-gray-400 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Connect with us */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#218EA6]">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#218EA6]/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#218EA6]/40 transition-all"
              >
                <FontAwesomeIcon icon={faLinkedin} className="text-[#218EA6]" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#218EA6]/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#218EA6]/40 transition-all"
              >
                <FontAwesomeIcon icon={faGithub} className="text-[#218EA6]" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#218EA6]/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#218EA6]/40 transition-all"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-[#218EA6]" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Follow us for updates on women's safety initiatives and technology advancements.
            </p>
          </div>
          
          {/* Get in touch */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#218EA6]">Get In Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="bg-[#218EA6]/20 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faEnvelope} className="text-[#218EA6] text-sm" />
                </div>
                <span className="text-gray-400">support@safewatch.com</span>
              </div>
              <div className="flex items-center">
                <div className="bg-[#218EA6]/20 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faPhone} className="text-[#218EA6] text-sm" />
                </div>
                <span className="text-gray-400">+91 98765 43210</span>
              </div>
            </div>
            <div className="mt-6">
              <RippleButton text="Register Now" />
            </div>
          </div>
        </div>
        
        {/* Bottom copyright */}
        <div className="h-px bg-gray-700 w-full my-8"></div>
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} SafeWatch. All rights reserved.</p>
          <p className="mt-1">Empowering communities through safety technology.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
